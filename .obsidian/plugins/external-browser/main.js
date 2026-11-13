"use strict";
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
  default: () => ExternalBrowserPlugin
});
module.exports = __toCommonJS(main_exports);
var import_electron = require("electron");
var import_obsidian2 = require("obsidian");

// src/launch.ts
var import_node_child_process = require("node:child_process");
var import_node_path = require("node:path");
var MAC_APPS = {
  firefox: "Firefox",
  chrome: "Google Chrome",
  edge: "Microsoft Edge",
  brave: "Brave Browser"
};
var LINUX_BINARIES = {
  firefox: ["firefox", "firefox-esr"],
  chrome: ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"],
  edge: ["microsoft-edge", "microsoft-edge-stable"],
  brave: ["brave-browser", "brave-browser-stable", "brave"]
};
var WINDOWS_APPS = {
  firefox: { subpath: "Mozilla Firefox", executable: "firefox.exe" },
  chrome: { subpath: "Google\\Chrome\\Application", executable: "chrome.exe" },
  edge: { subpath: "Microsoft\\Edge\\Application", executable: "msedge.exe" },
  brave: { subpath: "BraveSoftware\\Brave-Browser\\Application", executable: "brave.exe" }
};
function browserCommands(browser, customExecutable, platform = process.platform, env = process.env) {
  if (browser === "custom") {
    return customExecutable.trim() ? [{ program: customExecutable.trim(), args: [] }] : [];
  }
  if (platform === "darwin") {
    return [{ program: "open", args: ["-a", MAC_APPS[browser]], waitForExit: true }];
  }
  if (platform === "win32") {
    const { subpath, executable } = WINDOWS_APPS[browser];
    const roots = [env.LOCALAPPDATA, env.ProgramFiles, env["ProgramFiles(x86)"]].filter(
      (value) => Boolean(value)
    );
    const paths = roots.map((root) => ({ program: import_node_path.win32.join(root, ...subpath.split("\\"), executable), args: [] }));
    return [...paths, { program: executable, args: [] }];
  }
  return LINUX_BINARIES[browser].map((program) => ({ program, args: [] }));
}
function runCommand(command, url) {
  return new Promise((resolve, reject) => {
    const child = (0, import_node_child_process.spawn)(command.program, [...command.args, url], {
      shell: false,
      detached: !command.waitForExit,
      stdio: "ignore",
      windowsHide: true
    });
    child.once("error", reject);
    if (command.waitForExit) {
      child.once("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error("Browser launcher exited with code " + (code ?? "unknown") + "."));
      });
    } else {
      child.once("spawn", () => {
        child.unref();
        resolve();
      });
    }
  });
}
async function launchBrowser(url, browser, customExecutable) {
  const commands = browserCommands(browser, customExecutable);
  if (commands.length === 0) throw new Error("No custom browser executable configured.");
  let lastError;
  for (const command of commands) {
    try {
      await runCommand(command, url);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unable to launch the selected browser.");
}

// src/routing.ts
function selectBrowser(settings, keys) {
  const modifier = settings.alternateModifier;
  if (modifier !== "none" && keys[modifier + "Key"]) {
    return settings.alternateBrowser;
  }
  return settings.primaryBrowser;
}
function parseExternalUrl(href) {
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

// src/settings.ts
var import_obsidian = require("obsidian");

// src/types.ts
var BROWSERS = {
  system: "System default",
  firefox: "Firefox",
  chrome: "Google Chrome",
  edge: "Microsoft Edge",
  brave: "Brave",
  custom: "Custom executable"
};
var DEFAULT_SETTINGS = {
  primaryBrowser: "system",
  alternateBrowser: "system",
  alternateModifier: "none",
  customExecutable: ""
};

// src/settings.ts
var MODIFIERS = {
  none: "Disabled",
  alt: "Alt",
  ctrl: "Ctrl",
  meta: "Meta (Command on macOS)",
  shift: "Shift"
};
var ExternalBrowserSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  // Obsidian 1.13+: searchable declarative settings.
  // Older Obsidian versions use the display() fallback below.
  getSettingDefinitions() {
    return [
      {
        name: "Browser for external links",
        desc: "Applies to HTTP and HTTPS links. System default leaves normal Obsidian behavior unchanged.",
        control: {
          type: "dropdown",
          key: "primaryBrowser",
          defaultValue: "system",
          options: BROWSERS
        }
      },
      {
        name: "Alternative browser modifier",
        desc: "Hold this key while opening a link to use the alternative browser.",
        control: {
          type: "dropdown",
          key: "alternateModifier",
          defaultValue: "none",
          options: MODIFIERS
        }
      },
      {
        name: "Alternative browser",
        desc: "Used only while the selected modifier is held.",
        control: {
          type: "dropdown",
          key: "alternateBrowser",
          defaultValue: "system",
          options: BROWSERS
        }
      },
      {
        name: "Custom executable",
        desc: "Executable path or command on PATH (without quotes or additional arguments). The URL is passed separately.",
        visible: () => this.plugin.settings.primaryBrowser === "custom" || this.plugin.settings.alternateBrowser === "custom",
        control: {
          type: "text",
          key: "customExecutable",
          placeholder: "e.g. /usr/bin/firefox"
        }
      }
    ];
  }
  // Fallback for Obsidian versions older than 1.13.0.
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Browser for external links").setDesc("Applies to HTTP and HTTPS links. System default leaves the normal Obsidian behavior unchanged.").addDropdown((dropdown) => dropdown.addOptions(BROWSERS).setValue(this.plugin.settings.primaryBrowser).onChange(async (value) => {
      this.plugin.settings.primaryBrowser = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    new import_obsidian.Setting(containerEl).setName("Alternative browser modifier").setDesc("Hold this key while opening a link to use the alternative browser.").addDropdown((dropdown) => dropdown.addOptions(MODIFIERS).setValue(this.plugin.settings.alternateModifier).onChange(async (value) => {
      this.plugin.settings.alternateModifier = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Alternative browser").setDesc("Used only while the selected modifier is held.").addDropdown((dropdown) => dropdown.addOptions(BROWSERS).setValue(this.plugin.settings.alternateBrowser).onChange(async (value) => {
      this.plugin.settings.alternateBrowser = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.primaryBrowser === "custom" || this.plugin.settings.alternateBrowser === "custom") {
      new import_obsidian.Setting(containerEl).setName("Custom executable").setDesc("Full path to an executable (or command available in PATH). Do not add quotes or command arguments. The link URL is passed as one separate argument.").addText((text) => text.setPlaceholder("e.g. /usr/bin/firefox").setValue(this.plugin.settings.customExecutable).onChange(async (value) => {
        this.plugin.settings.customExecutable = value;
        await this.plugin.saveSettings();
      }));
    }
  }
};

// src/window-router.ts
function installWindowOpenRouter(win, getSettings, openInBrowser, now = Date.now) {
  const previousOpen = win.open;
  let active = true;
  let recentClick = null;
  let nextClickId = 0;
  let lastRouted = null;
  const windowOpen = (url, target, features) => {
    if (!active) return previousOpen.call(win, url, target, features);
    const safeUrl = parseExternalUrl(url === void 0 ? "" : String(url));
    const elapsed = recentClick ? now() - recentClick.time : Infinity;
    if (!safeUrl || !recentClick || elapsed < 0 || elapsed > 1500) {
      return previousOpen.call(win, url, target, features);
    }
    const browser = selectBrowser(getSettings(), recentClick.modifiers);
    if (browser === "system") {
      return previousOpen.call(win, url, target, features);
    }
    if (lastRouted?.id !== recentClick.id || lastRouted.url !== safeUrl) {
      lastRouted = { id: recentClick.id, url: safeUrl };
      openInBrowser(safeUrl, browser);
    }
    return null;
  };
  win.open = windowOpen;
  return {
    recordMouseEvent(keys) {
      recentClick = {
        time: now(),
        id: ++nextClickId,
        modifiers: {
          altKey: keys.altKey,
          ctrlKey: keys.ctrlKey,
          metaKey: keys.metaKey,
          shiftKey: keys.shiftKey
        }
      };
    },
    dispose() {
      active = false;
      recentClick = null;
      if (win.open === windowOpen) {
        win.open = previousOpen;
      }
    }
  };
}

// src/main.ts
var ExternalBrowserPlugin = class extends import_obsidian2.Plugin {
  registeredDocuments = /* @__PURE__ */ new WeakSet();
  async onload() {
    const saved = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...saved ?? {} };
    this.addSettingTab(new ExternalBrowserSettingTab(this.app, this));
    this.addCommand({
      id: "test-primary-browser",
      name: "Test primary browser (open example.com)",
      callback: () => {
        void this.testBrowser(this.settings.primaryBrowser);
      }
    });
    this.addCommand({
      id: "test-alternative-browser",
      name: "Test alternative browser (open example.com)",
      callback: () => {
        void this.testBrowser(this.settings.alternateBrowser);
      }
    });
    this.registerDocument(document);
    this.registerEvent(this.app.workspace.on("window-open", (_workspaceWindow, window) => {
      this.registerDocument(window.document);
    }));
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  registerDocument(doc) {
    if (this.registeredDocuments.has(doc)) return;
    this.registeredDocuments.add(doc);
    const win = doc.defaultView;
    const router = win ? installWindowOpenRouter(
      win,
      () => this.settings,
      (url, browser) => this.openLink(url, browser)
    ) : null;
    if (router) this.register(() => router.dispose());
    const onClick = (event) => {
      router?.recordMouseEvent(event);
      this.onLinkClick(event);
    };
    this.registerDomEvent(doc, "mousedown", (event) => router?.recordMouseEvent(event), { capture: true });
    this.registerDomEvent(doc, "click", onClick, { capture: true });
    this.registerDomEvent(doc, "auxclick", onClick, { capture: true });
  }
  onLinkClick(event) {
    if (event.defaultPrevented) return;
    const isMainClick = event.type === "click" && event.button === 0;
    const isMiddleClick = event.type === "auxclick" && event.button === 1;
    if (!isMainClick && !isMiddleClick) return;
    const target = event.target;
    if (!target || typeof target.closest !== "function") return;
    const anchor = target.closest("a[href], a[data-href]");
    if (!anchor || anchor.hasAttribute("download")) return;
    const url = parseExternalUrl(anchor.getAttribute("href") ?? anchor.getAttribute("data-href") ?? "");
    if (!url) return;
    const browser = selectBrowser(this.settings, event);
    if (browser === "system") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.openLink(url, browser);
  }
  openLink(url, browser) {
    void launchBrowser(url, browser, this.settings.customExecutable).catch(async (error) => {
      console.error("[External Browser] Failed to open link with " + browser, error);
      new import_obsidian2.Notice("External Browser: could not start " + BROWSERS[browser] + "; using the system browser.");
      try {
        await import_electron.shell.openExternal(url);
      } catch (fallbackError) {
        console.error("[External Browser] System browser fallback failed", fallbackError);
        new import_obsidian2.Notice("External Browser: unable to open the link.");
      }
    });
  }
  async testBrowser(browser) {
    const url = "https://example.com/";
    try {
      if (browser === "system") {
        await import_electron.shell.openExternal(url);
      } else {
        await launchBrowser(url, browser, this.settings.customExecutable);
      }
      new import_obsidian2.Notice("External Browser: launch request sent to " + BROWSERS[browser] + ".");
    } catch (error) {
      console.error("[External Browser] Browser test failed", error);
      new import_obsidian2.Notice("External Browser: failed to launch " + BROWSERS[browser] + ". Check the developer console.");
    }
  }
};

/* nosourcemap */