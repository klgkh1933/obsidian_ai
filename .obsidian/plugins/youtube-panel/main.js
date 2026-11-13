var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => YouTubePanelPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/view.ts
var import_obsidian3 = require("obsidian");

// src/utils.ts
var import_obsidian = require("obsidian");
var VIDEO_ID_RE = /^[\w-]{11}$/;
function parseTimestamp(raw) {
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (h ? parseInt(h, 10) * 3600 : 0) + (m ? parseInt(m, 10) * 60 : 0) + (s ? parseInt(s, 10) : 0);
}
function parseYouTubeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (VIDEO_ID_RE.test(trimmed)) {
    return { videoId: trimmed, playlistId: null, start: 0 };
  }
  let url;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  if (host !== "youtube.com" && host !== "youtu.be" && host !== "youtube-nocookie.com" && host !== "music.youtube.com") {
    return null;
  }
  const start = parseTimestamp(
    url.searchParams.get("t") ?? url.searchParams.get("start") ?? "0"
  );
  const playlistId = url.searchParams.get("list");
  let videoId = null;
  if (host === "youtu.be") {
    videoId = url.pathname.slice(1).split("/")[0] || null;
  } else if (url.searchParams.has("v")) {
    videoId = url.searchParams.get("v");
  } else {
    const pathMatch = url.pathname.match(
      /^\/(?:shorts|live|embed|v)\/([\w-]{11})/
    );
    if (pathMatch) videoId = pathMatch[1];
  }
  if (videoId && !VIDEO_ID_RE.test(videoId)) videoId = null;
  if (!videoId && !playlistId) return null;
  return { videoId, playlistId, start };
}
function buildEmbedUrl(parsed) {
  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  if (parsed.start > 0) params.set("start", String(parsed.start));
  if (parsed.videoId) {
    if (parsed.playlistId) params.set("list", parsed.playlistId);
    return `https://www.youtube-nocookie.com/embed/${parsed.videoId}?${params}`;
  }
  params.set("listType", "playlist");
  params.set("list", parsed.playlistId);
  return `https://www.youtube-nocookie.com/embed/videoseries?${params}`;
}
async function fetchVideoTitle(input) {
  const parsed = parseYouTubeUrl(input);
  if (!parsed) return null;
  const watchUrl = parsed.videoId ? `https://www.youtube.com/watch?v=${parsed.videoId}` : `https://www.youtube.com/playlist?list=${parsed.playlistId}`;
  try {
    const res = await (0, import_obsidian.requestUrl)(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );
    const json = res.json;
    if (!json || typeof json !== "object") return null;
    const title = json.title;
    return typeof title === "string" ? title : null;
  } catch {
    return null;
  }
}
function collectVideoRenderers(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) collectVideoRenderers(child, out);
    return;
  }
  const obj = node;
  if (obj.videoRenderer && typeof obj.videoRenderer === "object") {
    out.push(obj.videoRenderer);
  }
  for (const value of Object.values(obj)) collectVideoRenderers(value, out);
}
function asString(value) {
  return typeof value === "string" ? value : null;
}
function runText(value) {
  if (!value || typeof value !== "object") return null;
  const runs = value.runs;
  if (!Array.isArray(runs)) return null;
  const first = runs[0];
  if (!first || typeof first !== "object") return null;
  return asString(first.text);
}
function simpleText(value) {
  if (!value || typeof value !== "object") return null;
  return asString(value.simpleText);
}
async function searchYouTube(query) {
  const res = await (0, import_obsidian.requestUrl)(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  );
  const html = res.text;
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start === -1) return [];
  const end = html.indexOf(";<\/script>", start);
  if (end === -1) return [];
  let data;
  try {
    data = JSON.parse(html.slice(start + marker.length, end));
  } catch {
    return [];
  }
  const renderers = [];
  collectVideoRenderers(data, renderers);
  const results = [];
  for (const renderer of renderers) {
    if (!renderer || typeof renderer !== "object") continue;
    const obj = renderer;
    const videoId = asString(obj.videoId);
    if (!videoId) continue;
    results.push({
      videoId,
      title: runText(obj.title) ?? "(untitled)",
      channel: runText(obj.ownerText) ?? "",
      duration: simpleText(obj.lengthText) ?? ""
    });
    if (results.length >= 20) break;
  }
  return results;
}
function findYouTubeUrlInText(text) {
  const urlRe = /https?:\/\/[^\s)\]>"']+/g;
  for (const match of text.matchAll(urlRe)) {
    if (parseYouTubeUrl(match[0])) return match[0];
  }
  return null;
}

// src/search-modal.ts
var import_obsidian2 = require("obsidian");
var YouTubeSearchModal = class extends import_obsidian2.SuggestModal {
  plugin;
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.setPlaceholder("Search YouTube\u2026");
    this.limit = 20;
    this.setInstructions([
      { command: "\u21B5", purpose: "add to queue" },
      { command: "\u2318 \u21B5", purpose: "play now" }
    ]);
    this.scope.register(["Mod"], "Enter", (evt) => {
      const chooser = this.chooser;
      chooser?.useSelectedItem?.(evt);
      return false;
    });
  }
  async getSuggestions(query) {
    const q = query.trim();
    if (q.length < 2) return [];
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (this.inputEl.value.trim() !== q) return [];
    try {
      return await searchYouTube(q);
    } catch {
      return [];
    }
  }
  renderSuggestion(item, el) {
    el.addClass("ytp-search-suggestion");
    el.createDiv({ cls: "ytp-search-title", text: item.title });
    const meta = [item.channel, item.duration || "live"].filter(Boolean).join(" \xB7 ");
    el.createDiv({ cls: "ytp-search-meta", text: meta });
  }
  onChooseSuggestion(item, evt) {
    const url = `https://www.youtube.com/watch?v=${item.videoId}`;
    if (import_obsidian2.Keymap.isModEvent(evt)) {
      void this.plugin.playUrl(url);
    } else {
      void this.plugin.addToQueue(url, item.title);
    }
  }
};

// src/view.ts
var YOUTUBE_PANEL_VIEW = "youtube-panel-view";
var YouTubeView = class extends import_obsidian3.ItemView {
  plugin;
  urlInput = null;
  playerWrap = null;
  queueListEl = null;
  queueCountEl = null;
  currentUrl = "";
  lastPlayerState = -1;
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return YOUTUBE_PANEL_VIEW;
  }
  getDisplayText() {
    return "YouTube player";
  }
  getIcon() {
    return "play-circle";
  }
  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("ytp-container");
    this.playerWrap = container.createDiv({ cls: "ytp-player" });
    const queueWrap = container.createDiv({ cls: "ytp-queue" });
    const header = queueWrap.createDiv({ cls: "ytp-queue-header" });
    header.createSpan({ cls: "ytp-queue-title", text: "Queue" });
    this.queueCountEl = header.createSpan({ cls: "ytp-queue-count" });
    const clearBtn = header.createEl("button", {
      cls: "ytp-queue-clear",
      text: "Clear"
    });
    clearBtn.addEventListener("click", () => {
      this.plugin.settings.queue = [];
      void this.plugin.saveSettings();
      this.renderQueue();
    });
    this.queueListEl = queueWrap.createDiv({ cls: "ytp-queue-list" });
    this.renderQueue();
    const bar = container.createDiv({ cls: "ytp-bar" });
    this.urlInput = bar.createEl("input", {
      cls: "ytp-input",
      attr: {
        type: "text",
        placeholder: "Paste a YouTube URL\u2026",
        spellcheck: "false"
      }
    });
    this.urlInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" && this.urlInput) {
        this.loadUrl(this.urlInput.value);
      }
    });
    const playBtn = bar.createEl("button", { cls: "ytp-go", text: "Play" });
    playBtn.addEventListener("click", () => {
      if (this.urlInput) this.loadUrl(this.urlInput.value);
    });
    const queueBtn = bar.createEl("button", {
      cls: "ytp-go",
      text: "+ Queue",
      attr: { "aria-label": "Add to queue" }
    });
    queueBtn.addEventListener("click", () => {
      if (this.urlInput) {
        void this.addToQueue(this.urlInput.value);
        this.urlInput.value = "";
      }
    });
    const searchBtn = bar.createEl("button", {
      cls: "ytp-go ytp-icon-btn",
      attr: { "aria-label": "Search YouTube" }
    });
    (0, import_obsidian3.setIcon)(searchBtn, "search");
    searchBtn.addEventListener("click", () => {
      new YouTubeSearchModal(this.app, this.plugin).open();
    });
    this.registerDomEvent(window, "message", (evt) => {
      this.onPlayerMessage(evt);
    });
    const lastUrl = this.plugin.settings.lastUrl;
    if (lastUrl) {
      this.urlInput.value = lastUrl;
      this.loadUrl(lastUrl, false);
    } else {
      this.showEmptyState();
    }
  }
  async onClose() {
    this.contentEl.empty();
  }
  showEmptyState() {
    if (!this.playerWrap) return;
    this.playerWrap.empty();
    this.playerWrap.createDiv({
      cls: "ytp-empty",
      text: "No video loaded"
    });
  }
  /** Load a URL (or bare video id) into the embedded player */
  loadUrl(input, autoplay = true) {
    const parsed = parseYouTubeUrl(input);
    if (!parsed) {
      new import_obsidian3.Notice("Not a recognizable YouTube URL");
      return;
    }
    const src = new URL(buildEmbedUrl(parsed));
    src.searchParams.set("enablejsapi", "1");
    if (!autoplay) src.searchParams.set("autoplay", "0");
    this.currentUrl = input.trim();
    this.lastPlayerState = -1;
    if (this.urlInput) this.urlInput.value = this.currentUrl;
    if (this.playerWrap) {
      this.playerWrap.empty();
      const iframe = this.playerWrap.createEl("iframe", {
        cls: "ytp-iframe",
        attr: {
          src: src.toString(),
          frameborder: "0",
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowfullscreen: "true"
        }
      });
      iframe.addEventListener("load", () => {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "listening", id: "ytp", channel: "widget" }),
          "*"
        );
      });
    }
    this.plugin.settings.lastUrl = this.currentUrl;
    void this.plugin.saveSettings();
    this.renderQueue();
  }
  async addToQueue(input) {
    await this.plugin.addToQueue(input);
  }
  /** Re-render the queue list (called by the plugin after queue changes) */
  refreshQueue() {
    this.renderQueue();
  }
  renderQueue() {
    if (!this.queueListEl || !this.queueCountEl) return;
    const queue = this.plugin.settings.queue;
    this.queueCountEl.setText(queue.length ? `${queue.length}` : "");
    this.queueListEl.empty();
    if (queue.length === 0) {
      this.queueListEl.createDiv({
        cls: "ytp-queue-empty",
        text: "Queue is empty"
      });
      return;
    }
    queue.forEach((item, i) => {
      const row = this.queueListEl.createDiv({ cls: "ytp-queue-item" });
      if (item.url === this.currentUrl) row.addClass("is-playing");
      row.createSpan({ cls: "ytp-queue-index", text: `${i + 1}` });
      row.createSpan({ cls: "ytp-queue-item-title", text: item.title });
      const removeBtn = row.createEl("button", {
        cls: "ytp-queue-remove",
        attr: { "aria-label": "Remove from queue" }
      });
      (0, import_obsidian3.setIcon)(removeBtn, "x");
      removeBtn.addEventListener("click", (evt) => {
        evt.stopPropagation();
        this.plugin.settings.queue.splice(i, 1);
        void this.plugin.saveSettings();
        this.renderQueue();
      });
      row.addEventListener("click", () => this.loadUrl(item.url));
    });
  }
  /** Play the queue item after the currently playing one (or the first) */
  playNext() {
    const queue = this.plugin.settings.queue;
    if (queue.length === 0) return;
    const idx = queue.findIndex((item) => item.url === this.currentUrl);
    const next = queue[idx + 1] ?? (idx === -1 ? queue[0] : void 0);
    if (next) this.loadUrl(next.url);
  }
  onPlayerMessage(evt) {
    if (typeof evt.origin !== "string" || !/https:\/\/(www\.)?(youtube|youtube-nocookie)\.com$/.test(evt.origin)) {
      return;
    }
    if (typeof evt.data !== "string") return;
    let parsed;
    try {
      parsed = JSON.parse(evt.data);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object") return;
    const data = parsed;
    let state;
    if (data.event === "onStateChange" && typeof data.info === "number") {
      state = data.info;
    } else if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
      const playerState = data.info.playerState;
      if (typeof playerState === "number") state = playerState;
    }
    if (state === void 0) return;
    if (state === 0 && this.lastPlayerState !== 0) {
      this.lastPlayerState = state;
      this.playNext();
      return;
    }
    this.lastPlayerState = state;
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  lastUrl: "",
  queue: []
};
var YouTubePanelPlugin = class extends import_obsidian4.Plugin {
  settings = DEFAULT_SETTINGS;
  async onload() {
    await this.loadSettings();
    this.registerView(
      YOUTUBE_PANEL_VIEW,
      (leaf) => new YouTubeView(leaf, this)
    );
    this.addRibbonIcon("play-circle", "Open YouTube player", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-player",
      name: "Open YouTube player",
      callback: () => void this.activateView()
    });
    this.addCommand({
      id: "play-selection",
      name: "Play YouTube link from selection or current line",
      editorCallback: (editor) => {
        const url = this.linkFromEditor(editor);
        if (!url) {
          new import_obsidian4.Notice("No YouTube link found in selection");
          return;
        }
        void this.playUrl(url);
      }
    });
    this.addCommand({
      id: "queue-selection",
      name: "Add YouTube link from selection or current line to queue",
      editorCallback: (editor) => {
        const url = this.linkFromEditor(editor);
        if (!url) {
          new import_obsidian4.Notice("No YouTube link found in selection");
          return;
        }
        void this.addToQueue(url);
      }
    });
    this.addCommand({
      id: "search-youtube",
      name: "Search YouTube",
      callback: () => new YouTubeSearchModal(this.app, this).open()
    });
    this.addCommand({
      id: "play-clipboard",
      name: "Play YouTube link from clipboard",
      callback: async () => {
        const text = await navigator.clipboard.readText();
        const url = findYouTubeUrlInText(text ?? "");
        if (!url) {
          new import_obsidian4.Notice("No YouTube link found in clipboard");
          return;
        }
        void this.playUrl(url);
      }
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        const line = editor.getLine(editor.getCursor().line);
        const url = findYouTubeUrlInText(line);
        if (!url) return;
        menu.addItem((item) => {
          item.setTitle("Play in side panel").setIcon("play-circle").onClick(() => void this.playUrl(url));
        });
        menu.addItem((item) => {
          item.setTitle("Add to YouTube queue").setIcon("list-plus").onClick(() => void this.addToQueue(url));
        });
      })
    );
  }
  linkFromEditor(editor) {
    const text = editor.getSelection() || editor.getLine(editor.getCursor().line);
    return findYouTubeUrlInText(text);
  }
  /** Open (or reveal) the view in the right sidebar and return it */
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(YOUTUBE_PANEL_VIEW);
    if (existing.length > 0) {
      await this.app.workspace.revealLeaf(existing[0]);
      const view2 = existing[0].view;
      return view2 instanceof YouTubeView ? view2 : null;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return null;
    await leaf.setViewState({ type: YOUTUBE_PANEL_VIEW, active: true });
    await this.app.workspace.revealLeaf(leaf);
    const view = leaf.view;
    return view instanceof YouTubeView ? view : null;
  }
  async playUrl(url) {
    const view = await this.activateView();
    view?.loadUrl(url);
  }
  /** Append a video to the queue, resolving its title in the background if unknown */
  async addToQueue(input, knownTitle) {
    const url = input.trim();
    if (!parseYouTubeUrl(url)) {
      new import_obsidian4.Notice("Not a recognizable YouTube URL");
      return;
    }
    const item = { url, title: knownTitle ?? url };
    this.settings.queue.push(item);
    await this.saveSettings();
    this.refreshQueueViews();
    new import_obsidian4.Notice("Added to queue");
    if (!knownTitle) {
      const title = await fetchVideoTitle(url);
      if (title) {
        item.title = title;
        await this.saveSettings();
        this.refreshQueueViews();
      }
    }
  }
  refreshQueueViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(YOUTUBE_PANEL_VIEW)) {
      if (leaf.view instanceof YouTubeView) leaf.view.refreshQueue();
    }
  }
  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    if (!Array.isArray(this.settings.queue)) this.settings.queue = [];
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};


/* nosourcemap */