"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// vendor/foliate-js/fixed-layout.js
var fixed_layout_exports = {};
__export(fixed_layout_exports, {
  FixedLayout: () => FixedLayout
});
var parseViewport, getViewport, FixedLayout;
var init_fixed_layout = __esm({
  "vendor/foliate-js/fixed-layout.js"() {
    "use strict";
    parseViewport = (str) => str?.split(/[,;\s]/)?.filter((x) => x)?.map((x) => x.split("=").map((x2) => x2.trim()));
    getViewport = (doc, viewport) => {
      if (doc.documentElement.localName === "svg") {
        const [, , width, height] = doc.documentElement.getAttribute("viewBox")?.split(/\s/) ?? [];
        return { width, height };
      }
      const meta = parseViewport(doc.querySelector('meta[name="viewport"]')?.getAttribute("content"));
      if (meta) return Object.fromEntries(meta);
      if (typeof viewport === "string") return parseViewport(viewport);
      if (viewport?.width && viewport.height) return viewport;
      const img = doc.querySelector("img");
      if (img) return { width: img.naturalWidth, height: img.naturalHeight };
      console.warn(new Error("Missing viewport properties"));
      return { width: 1e3, height: 2e3 };
    };
    FixedLayout = class extends HTMLElement {
      static observedAttributes = ["zoom"];
      #root = this.attachShadow({ mode: "closed" });
      #observer = new ResizeObserver(() => this.#render());
      #spreads;
      #index = -1;
      defaultViewport;
      spread;
      #portrait = false;
      #left;
      #right;
      #center;
      #side;
      #zoom;
      constructor() {
        super();
        const sheet = new CSSStyleSheet();
        this.#root.adoptedStyleSheets = [sheet];
        sheet.replaceSync(`:host {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
        }`);
        this.#observer.observe(this);
      }
      attributeChangedCallback(name, _, value) {
        switch (name) {
          case "zoom":
            this.#zoom = value !== "fit-width" && value !== "fit-page" ? parseFloat(value) : value;
            this.#render();
            break;
        }
      }
      async #createFrame({ index, src: srcOption }) {
        const srcOptionIsString = typeof srcOption === "string";
        const src = srcOptionIsString ? srcOption : srcOption?.src;
        const onZoom = srcOptionIsString ? null : srcOption?.onZoom;
        const element = document.createElement("div");
        element.setAttribute("dir", "ltr");
        const iframe = document.createElement("iframe");
        element.append(iframe);
        Object.assign(iframe.style, {
          border: "0",
          display: "none",
          overflow: "hidden"
        });
        iframe.setAttribute(
          "sandbox",
          this.getAttribute("sandbox") ?? "allow-same-origin allow-scripts"
        );
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("part", "filter");
        this.#root.append(element);
        if (!src) return { blank: true, element, iframe };
        return new Promise((resolve) => {
          iframe.addEventListener("load", () => {
            const doc = iframe.contentDocument;
            this.dispatchEvent(new CustomEvent("load", { detail: { doc, index } }));
            const { width, height } = getViewport(doc, this.defaultViewport);
            resolve({
              element,
              iframe,
              width: parseFloat(width),
              height: parseFloat(height),
              onZoom
            });
          }, { once: true });
          iframe.src = src;
        });
      }
      #render(side = this.#side) {
        if (!side) return;
        const left = this.#left ?? {};
        const right = this.#center ?? this.#right ?? {};
        const target = side === "left" ? left : right;
        const { width, height } = this.getBoundingClientRect();
        const portrait = this.spread !== "both" && this.spread !== "portrait" && height > width;
        this.#portrait = portrait;
        const blankWidth = left.width ?? right.width ?? 0;
        const blankHeight = left.height ?? right.height ?? 0;
        const scale = typeof this.#zoom === "number" && !isNaN(this.#zoom) ? this.#zoom : (this.#zoom === "fit-width" ? portrait || this.#center ? width / (target.width ?? blankWidth) : width / ((left.width ?? blankWidth) + (right.width ?? blankWidth)) : portrait || this.#center ? Math.min(
          width / (target.width ?? blankWidth),
          height / (target.height ?? blankHeight)
        ) : Math.min(
          width / ((left.width ?? blankWidth) + (right.width ?? blankWidth)),
          height / Math.max(
            left.height ?? blankHeight,
            right.height ?? blankHeight
          )
        )) || 1;
        const transform = (frame) => {
          let { element, iframe, width: width2, height: height2, blank, onZoom } = frame;
          if (!iframe) return;
          if (onZoom) onZoom({ doc: frame.iframe.contentDocument, scale });
          const iframeScale = onZoom ? scale : 1;
          Object.assign(iframe.style, {
            width: `${width2 * iframeScale}px`,
            height: `${height2 * iframeScale}px`,
            transform: onZoom ? "none" : `scale(${scale})`,
            transformOrigin: "top left",
            display: blank ? "none" : "block"
          });
          Object.assign(element.style, {
            width: `${(width2 ?? blankWidth) * scale}px`,
            height: `${(height2 ?? blankHeight) * scale}px`,
            overflow: "hidden",
            display: "block",
            flexShrink: "0",
            marginBlock: "auto"
          });
          if (portrait && frame !== target) {
            element.style.display = "none";
          }
        };
        if (this.#center) {
          transform(this.#center);
        } else {
          transform(left);
          transform(right);
        }
      }
      async #showSpread({ left, right, center, side }) {
        this.#root.replaceChildren();
        this.#left = null;
        this.#right = null;
        this.#center = null;
        if (center) {
          this.#center = await this.#createFrame(center);
          this.#side = "center";
          this.#render();
        } else {
          this.#left = await this.#createFrame(left);
          this.#right = await this.#createFrame(right);
          this.#side = this.#left.blank ? "right" : this.#right.blank ? "left" : side;
          this.#render();
        }
      }
      #goLeft() {
        if (this.#center || this.#left?.blank) return;
        if (this.#portrait && this.#left?.element?.style?.display === "none") {
          this.#side = "left";
          this.#render();
          this.#reportLocation("page");
          return true;
        }
      }
      #goRight() {
        if (this.#center || this.#right?.blank) return;
        if (this.#portrait && this.#right?.element?.style?.display === "none") {
          this.#side = "right";
          this.#render();
          this.#reportLocation("page");
          return true;
        }
      }
      open(book) {
        this.book = book;
        const { rendition } = book;
        this.spread = rendition?.spread;
        this.defaultViewport = rendition?.viewport;
        const rtl = book.dir === "rtl";
        const ltr = !rtl;
        this.rtl = rtl;
        if (rendition?.spread === "none")
          this.#spreads = book.sections.map((section) => ({ center: section }));
        else this.#spreads = book.sections.reduce((arr, section, i) => {
          const last = arr[arr.length - 1];
          const { pageSpread } = section;
          const newSpread = () => {
            const spread = {};
            arr.push(spread);
            return spread;
          };
          if (pageSpread === "center") {
            const spread = last.left || last.right ? newSpread() : last;
            spread.center = section;
          } else if (pageSpread === "left") {
            const spread = last.center || last.left || ltr && i ? newSpread() : last;
            spread.left = section;
          } else if (pageSpread === "right") {
            const spread = last.center || last.right || rtl && i ? newSpread() : last;
            spread.right = section;
          } else if (ltr) {
            if (last.center || last.right) newSpread().left = section;
            else if (last.left || !i) last.right = section;
            else last.left = section;
          } else {
            if (last.center || last.left) newSpread().right = section;
            else if (last.right || !i) last.left = section;
            else last.right = section;
          }
          return arr;
        }, [{}]);
      }
      get index() {
        const spread = this.#spreads[this.#index];
        const section = spread?.center ?? (this.#side === "left" ? spread.left ?? spread.right : spread.right ?? spread.left);
        return this.book.sections.indexOf(section);
      }
      #reportLocation(reason) {
        this.dispatchEvent(new CustomEvent("relocate", { detail: { reason, range: null, index: this.index, fraction: 0, size: 1 } }));
      }
      getSpreadOf(section) {
        const spreads = this.#spreads;
        for (let index = 0; index < spreads.length; index++) {
          const { left, right, center } = spreads[index];
          if (left === section) return { index, side: "left" };
          if (right === section) return { index, side: "right" };
          if (center === section) return { index, side: "center" };
        }
      }
      async goToSpread(index, side, reason) {
        if (index < 0 || index > this.#spreads.length - 1) return;
        if (index === this.#index) {
          this.#render(side);
          return;
        }
        this.#index = index;
        const spread = this.#spreads[index];
        if (spread.center) {
          const index2 = this.book.sections.indexOf(spread.center);
          const src = await spread.center?.load?.();
          await this.#showSpread({ center: { index: index2, src } });
        } else {
          const indexL = this.book.sections.indexOf(spread.left);
          const indexR = this.book.sections.indexOf(spread.right);
          const srcL = await spread.left?.load?.();
          const srcR = await spread.right?.load?.();
          const left = { index: indexL, src: srcL };
          const right = { index: indexR, src: srcR };
          await this.#showSpread({ left, right, side });
        }
        this.#reportLocation(reason);
      }
      async select(target) {
        await this.goTo(target);
      }
      async goTo(target) {
        const { book } = this;
        const resolved = await target;
        const section = book.sections[resolved.index];
        if (!section) return;
        const { index, side } = this.getSpreadOf(section);
        await this.goToSpread(index, side);
      }
      async next() {
        const s = this.rtl ? this.#goLeft() : this.#goRight();
        if (!s) return this.goToSpread(this.#index + 1, this.rtl ? "right" : "left", "page");
      }
      async prev() {
        const s = this.rtl ? this.#goRight() : this.#goLeft();
        if (!s) return this.goToSpread(this.#index - 1, this.rtl ? "left" : "right", "page");
      }
      getContents() {
        return Array.from(this.#root.querySelectorAll("iframe"), (frame) => ({
          doc: frame.contentDocument
          // TODO: index, overlayer
        }));
      }
      destroy() {
        this.#observer.unobserve(this);
      }
    };
    if (!customElements.get("foliate-fxl")) customElements.define("foliate-fxl", FixedLayout);
  }
});

// vendor/foliate-js/paginator.js
var paginator_exports = {};
__export(paginator_exports, {
  Paginator: () => Paginator
});
var wait, debounce, lerp, easeOutQuad, animate, uncollapse, makeRange, bisectNode, SHOW_ELEMENT, SHOW_TEXT, SHOW_CDATA_SECTION, FILTER_ACCEPT, FILTER_REJECT, FILTER_SKIP, filter2, getBoundingClientRect, getVisibleRange, selectionIsBackward, setSelectionTo, getDirection, getBackground, makeMarginals, setStylesImportant, View, Paginator;
var init_paginator = __esm({
  "vendor/foliate-js/paginator.js"() {
    "use strict";
    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    debounce = (f, wait2, immediate) => {
      let timeout;
      return (...args) => {
        const later = () => {
          timeout = null;
          if (!immediate) f(...args);
        };
        const callNow = immediate && !timeout;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait2);
        if (callNow) f(...args);
      };
    };
    lerp = (min, max, x) => x * (max - min) + min;
    easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
    animate = (a, b, duration, ease, render) => new Promise((resolve) => {
      let start;
      const step = (now) => {
        if (document.hidden) {
          render(lerp(a, b, 1));
          return resolve();
        }
        start ??= now;
        const fraction = Math.min(1, (now - start) / duration);
        render(lerp(a, b, ease(fraction)));
        if (fraction < 1) requestAnimationFrame(step);
        else resolve();
      };
      if (document.hidden) {
        render(lerp(a, b, 1));
        return resolve();
      }
      requestAnimationFrame(step);
    });
    uncollapse = (range) => {
      if (!range?.collapsed) return range;
      const { endOffset, endContainer } = range;
      if (endContainer.nodeType === 1) {
        const node = endContainer.childNodes[endOffset];
        if (node?.nodeType === 1) return node;
        return endContainer;
      }
      if (endOffset + 1 < endContainer.length) range.setEnd(endContainer, endOffset + 1);
      else if (endOffset > 1) range.setStart(endContainer, endOffset - 1);
      else return endContainer.parentNode;
      return range;
    };
    makeRange = (doc, node, start, end = start) => {
      const range = doc.createRange();
      range.setStart(node, start);
      range.setEnd(node, end);
      return range;
    };
    bisectNode = (doc, node, cb, start = 0, end = node.nodeValue.length) => {
      if (end - start === 1) {
        const result2 = cb(makeRange(doc, node, start), makeRange(doc, node, end));
        return result2 < 0 ? start : end;
      }
      const mid = Math.floor(start + (end - start) / 2);
      const result = cb(makeRange(doc, node, start, mid), makeRange(doc, node, mid, end));
      return result < 0 ? bisectNode(doc, node, cb, start, mid) : result > 0 ? bisectNode(doc, node, cb, mid, end) : mid;
    };
    ({
      SHOW_ELEMENT,
      SHOW_TEXT,
      SHOW_CDATA_SECTION,
      FILTER_ACCEPT,
      FILTER_REJECT,
      FILTER_SKIP
    } = NodeFilter);
    filter2 = SHOW_ELEMENT | SHOW_TEXT | SHOW_CDATA_SECTION;
    getBoundingClientRect = (target) => {
      let top = Infinity, right = -Infinity, left = Infinity, bottom = -Infinity;
      for (const rect of target.getClientRects()) {
        left = Math.min(left, rect.left);
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
      }
      return new DOMRect(left, top, right - left, bottom - top);
    };
    getVisibleRange = (doc, start, end, mapRect) => {
      const acceptNode2 = (node) => {
        const name = node.localName?.toLowerCase();
        if (name === "script" || name === "style") return FILTER_REJECT;
        if (node.nodeType === 1) {
          const { left, right } = mapRect(node.getBoundingClientRect());
          if (right < start || left > end) return FILTER_REJECT;
          if (left >= start && right <= end) return FILTER_ACCEPT;
        } else {
          if (!node.nodeValue?.trim()) return FILTER_SKIP;
          const range2 = doc.createRange();
          range2.selectNodeContents(node);
          const { left, right } = mapRect(range2.getBoundingClientRect());
          if (right >= start && left <= end) return FILTER_ACCEPT;
        }
        return FILTER_SKIP;
      };
      const walker = doc.createTreeWalker(doc.body, filter2, { acceptNode: acceptNode2 });
      const nodes = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode())
        nodes.push(node);
      const from = nodes[0] ?? doc.body;
      const to = nodes[nodes.length - 1] ?? from;
      const startOffset = from.nodeType === 1 ? 0 : bisectNode(doc, from, (a, b) => {
        const p = mapRect(getBoundingClientRect(a));
        const q = mapRect(getBoundingClientRect(b));
        if (p.right < start && q.left > start) return 0;
        return q.left > start ? -1 : 1;
      });
      const endOffset = to.nodeType === 1 ? 0 : bisectNode(doc, to, (a, b) => {
        const p = mapRect(getBoundingClientRect(a));
        const q = mapRect(getBoundingClientRect(b));
        if (p.right < end && q.left > end) return 0;
        return q.left > end ? -1 : 1;
      });
      const range = doc.createRange();
      range.setStart(from, startOffset);
      range.setEnd(to, endOffset);
      return range;
    };
    selectionIsBackward = (sel) => {
      const range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);
      return range.collapsed;
    };
    setSelectionTo = (target, collapse2) => {
      let range;
      if (target.startContainer) range = target.cloneRange();
      else if (target.nodeType) {
        range = document.createRange();
        range.selectNode(target);
      }
      if (range) {
        const sel = range.startContainer.ownerDocument.defaultView.getSelection();
        if (sel) {
          sel.removeAllRanges();
          if (collapse2 === -1) range.collapse(true);
          else if (collapse2 === 1) range.collapse();
          sel.addRange(range);
        }
      }
    };
    getDirection = (doc) => {
      const { defaultView } = doc;
      const { writingMode, direction } = defaultView.getComputedStyle(doc.body);
      const vertical = writingMode === "vertical-rl" || writingMode === "vertical-lr";
      const rtl = doc.body.dir === "rtl" || direction === "rtl" || doc.documentElement.dir === "rtl";
      return { vertical, rtl };
    };
    getBackground = (doc) => {
      const bodyStyle = doc.defaultView.getComputedStyle(doc.body);
      return bodyStyle.backgroundColor === "rgba(0, 0, 0, 0)" && bodyStyle.backgroundImage === "none" ? doc.defaultView.getComputedStyle(doc.documentElement).background : bodyStyle.background;
    };
    makeMarginals = (length, part) => Array.from({ length }, () => {
      const div = document.createElement("div");
      const child = document.createElement("div");
      div.append(child);
      child.setAttribute("part", part);
      return div;
    });
    setStylesImportant = (el, styles) => {
      const { style } = el;
      for (const [k, v] of Object.entries(styles)) style.setProperty(k, v, "important");
    };
    View = class {
      #observer = new ResizeObserver(() => this.expand());
      #element = document.createElement("div");
      #iframe = document.createElement("iframe");
      #contentRange = document.createRange();
      #overlayer;
      #vertical = false;
      #rtl = false;
      #column = true;
      #size;
      #layout = {};
      constructor({ container, onExpand }) {
        this.container = container;
        this.onExpand = onExpand;
        this.#iframe.setAttribute("part", "filter");
        this.#element.append(this.#iframe);
        Object.assign(this.#element.style, {
          boxSizing: "content-box",
          position: "relative",
          overflow: "hidden",
          flex: "0 0 auto",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        });
        Object.assign(this.#iframe.style, {
          overflow: "hidden",
          border: "0",
          display: "none",
          width: "100%",
          height: "100%"
        });
        this.#iframe.setAttribute(
          "sandbox",
          container.getAttribute("sandbox") ?? "allow-same-origin allow-scripts"
        );
        this.#iframe.setAttribute("scrolling", "no");
      }
      get element() {
        return this.#element;
      }
      get document() {
        return this.#iframe.contentDocument;
      }
      async load(src, afterLoad, beforeRender) {
        if (typeof src !== "string") throw new Error(`${src} is not string`);
        return new Promise((resolve) => {
          this.#iframe.addEventListener("load", () => {
            const doc = this.document;
            afterLoad?.(doc);
            this.#iframe.style.display = "block";
            const { vertical, rtl } = getDirection(doc);
            const background = getBackground(doc);
            this.#iframe.style.display = "none";
            this.#vertical = vertical;
            this.#rtl = rtl;
            this.#contentRange.selectNodeContents(doc.body);
            const layout = beforeRender?.({ vertical, rtl, background });
            this.#iframe.style.display = "block";
            this.render(layout);
            this.#observer.observe(doc.body);
            doc.fonts.ready.then(() => this.expand());
            resolve();
          }, { once: true });
          this.#iframe.src = src;
        });
      }
      render(layout) {
        if (!layout) return;
        this.#column = layout.flow !== "scrolled";
        this.#layout = layout;
        if (this.#column) this.columnize(layout);
        else this.scrolled(layout);
      }
      scrolled({ gap, columnWidth }) {
        const vertical = this.#vertical;
        const doc = this.document;
        setStylesImportant(doc.documentElement, {
          "box-sizing": "border-box",
          "padding": vertical ? `${gap}px 0` : `0 ${gap}px`,
          "column-width": "auto",
          "height": "auto",
          "width": "auto"
        });
        setStylesImportant(doc.body, {
          [vertical ? "max-height" : "max-width"]: `${columnWidth}px`,
          "margin": "auto"
        });
        this.setImageSize();
        this.expand();
      }
      columnize({ width, height, gap, columnWidth }) {
        const vertical = this.#vertical;
        this.#size = vertical ? height : width;
        const doc = this.document;
        setStylesImportant(doc.documentElement, {
          "box-sizing": "border-box",
          "column-width": `${Math.trunc(columnWidth)}px`,
          "column-gap": `${gap}px`,
          "column-fill": "auto",
          ...vertical ? { "width": `${width}px` } : { "height": `${height}px` },
          "padding": vertical ? `${gap / 2}px 0` : `0 ${gap / 2}px`,
          "overflow": "hidden",
          // force wrap long words
          "overflow-wrap": "break-word",
          // reset some potentially problematic props
          "position": "static",
          "border": "0",
          "margin": "0",
          "max-height": "none",
          "max-width": "none",
          "min-height": "none",
          "min-width": "none",
          // fix glyph clipping in WebKit
          "-webkit-line-box-contain": "block glyphs replaced"
        });
        setStylesImportant(doc.body, {
          "max-height": "none",
          "max-width": "none",
          "margin": "0"
        });
        this.setImageSize();
        this.expand();
      }
      setImageSize() {
        const { width, height, margin } = this.#layout;
        const vertical = this.#vertical;
        const doc = this.document;
        for (const el of doc.body.querySelectorAll("img, svg, video")) {
          const { maxHeight, maxWidth } = doc.defaultView.getComputedStyle(el);
          setStylesImportant(el, {
            "max-height": vertical ? maxHeight !== "none" && maxHeight !== "0px" ? maxHeight : "100%" : `${height - margin * 2}px`,
            "max-width": vertical ? `${width - margin * 2}px` : maxWidth !== "none" && maxWidth !== "0px" ? maxWidth : "100%",
            "object-fit": "contain",
            "page-break-inside": "avoid",
            "break-inside": "avoid",
            "box-sizing": "border-box"
          });
        }
      }
      expand() {
        const { documentElement } = this.document;
        if (this.#column) {
          const side = this.#vertical ? "height" : "width";
          const otherSide = this.#vertical ? "width" : "height";
          const contentRect = this.#contentRange.getBoundingClientRect();
          const rootRect = documentElement.getBoundingClientRect();
          const contentStart = this.#vertical ? 0 : this.#rtl ? rootRect.right - contentRect.right : contentRect.left - rootRect.left;
          const contentSize = contentStart + contentRect[side];
          const pageCount = Math.ceil(contentSize / this.#size);
          const expandedSize = pageCount * this.#size;
          this.#element.style.padding = "0";
          this.#iframe.style[side] = `${expandedSize}px`;
          this.#element.style[side] = `${expandedSize + this.#size * 2}px`;
          this.#iframe.style[otherSide] = "100%";
          this.#element.style[otherSide] = "100%";
          documentElement.style[side] = `${this.#size}px`;
          if (this.#overlayer) {
            this.#overlayer.element.style.margin = "0";
            this.#overlayer.element.style.left = this.#vertical ? "0" : `${this.#size}px`;
            this.#overlayer.element.style.top = this.#vertical ? `${this.#size}px` : "0";
            this.#overlayer.element.style[side] = `${expandedSize}px`;
            this.#overlayer.redraw();
          }
        } else {
          const side = this.#vertical ? "width" : "height";
          const otherSide = this.#vertical ? "height" : "width";
          const contentSize = documentElement.getBoundingClientRect()[side];
          const expandedSize = contentSize;
          const { margin } = this.#layout;
          const padding = this.#vertical ? `0 ${margin}px` : `${margin}px 0`;
          this.#element.style.padding = padding;
          this.#iframe.style[side] = `${expandedSize}px`;
          this.#element.style[side] = `${expandedSize}px`;
          this.#iframe.style[otherSide] = "100%";
          this.#element.style[otherSide] = "100%";
          if (this.#overlayer) {
            this.#overlayer.element.style.margin = padding;
            this.#overlayer.element.style.left = "0";
            this.#overlayer.element.style.top = "0";
            this.#overlayer.element.style[side] = `${expandedSize}px`;
            this.#overlayer.redraw();
          }
        }
        this.onExpand();
      }
      set overlayer(overlayer) {
        this.#overlayer = overlayer;
        this.#element.append(overlayer.element);
      }
      get overlayer() {
        return this.#overlayer;
      }
      destroy() {
        if (this.document) this.#observer.unobserve(this.document.body);
      }
    };
    Paginator = class extends HTMLElement {
      static observedAttributes = [
        "flow",
        "gap",
        "margin",
        "max-inline-size",
        "max-block-size",
        "max-column-count"
      ];
      #root = this.attachShadow({ mode: "closed" });
      #observer = new ResizeObserver(() => this.render());
      #top;
      #background;
      #container;
      #header;
      #footer;
      #view;
      #vertical = false;
      #rtl = false;
      #margin = 0;
      #index = -1;
      #anchor = 0;
      // anchor view to a fraction (0-1), Range, or Element
      #justAnchored = false;
      #locked = false;
      // while true, prevent any further navigation
      #styles;
      #styleMap = /* @__PURE__ */ new WeakMap();
      #mediaQuery = matchMedia("(prefers-color-scheme: dark)");
      #mediaQueryListener;
      #scrollBounds;
      #touchState;
      #touchScrolled;
      #lastVisibleRange;
      constructor() {
        super();
        this.#root.innerHTML = `<style>
        :host {
            display: block;
            container-type: size;
        }
        :host, #top {
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }
        #top {
            --_gap: 7%;
            --_margin: 48px;
            --_max-inline-size: 720px;
            --_max-block-size: 1440px;
            --_max-column-count: 2;
            --_max-column-count-portrait: 1;
            --_max-column-count-spread: var(--_max-column-count);
            --_half-gap: calc(var(--_gap) / 2);
            --_max-width: calc(var(--_max-inline-size) * var(--_max-column-count-spread));
            --_max-height: var(--_max-block-size);
            display: grid;
            grid-template-columns:
                minmax(var(--_half-gap), 1fr)
                var(--_half-gap)
                minmax(0, calc(var(--_max-width) - var(--_gap)))
                var(--_half-gap)
                minmax(var(--_half-gap), 1fr);
            grid-template-rows:
                minmax(var(--_margin), 1fr)
                minmax(0, var(--_max-height))
                minmax(var(--_margin), 1fr);
            &.vertical {
                --_max-column-count-spread: var(--_max-column-count-portrait);
                --_max-width: var(--_max-block-size);
                --_max-height: calc(var(--_max-inline-size) * var(--_max-column-count-spread));
            }
            @container (orientation: portrait) {
                & {
                    --_max-column-count-spread: var(--_max-column-count-portrait);
                }
                &.vertical {
                    --_max-column-count-spread: var(--_max-column-count);
                }
            }
        }
        #background {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
        }
        #container {
            grid-column: 2 / 5;
            grid-row: 2;
            overflow: hidden;
        }
        :host([flow="scrolled"]) #container {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            overflow: auto;
        }
        #header {
            grid-column: 3 / 4;
            grid-row: 1;
        }
        #footer {
            grid-column: 3 / 4;
            grid-row: 3;
            align-self: end;
        }
        #header, #footer {
            display: grid;
            height: var(--_margin);
        }
        :is(#header, #footer) > * {
            display: flex;
            align-items: center;
            min-width: 0;
        }
        :is(#header, #footer) > * > * {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            font-size: .75em;
            opacity: .6;
        }
        </style>
        <div id="top">
            <div id="background" part="filter"></div>
            <div id="header"></div>
            <div id="container"></div>
            <div id="footer"></div>
        </div>
        `;
        this.#top = this.#root.getElementById("top");
        this.#background = this.#root.getElementById("background");
        this.#container = this.#root.getElementById("container");
        this.#header = this.#root.getElementById("header");
        this.#footer = this.#root.getElementById("footer");
        this.#observer.observe(this.#container);
        this.#container.addEventListener("scroll", () => this.dispatchEvent(new Event("scroll")));
        this.#container.addEventListener("scroll", debounce(() => {
          if (this.scrolled) {
            if (this.#justAnchored) this.#justAnchored = false;
            else this.#afterScroll("scroll");
          }
        }, 250));
        const opts = { passive: false };
        this.addEventListener("touchstart", this.#onTouchStart.bind(this), opts);
        this.addEventListener("touchmove", this.#onTouchMove.bind(this), opts);
        this.addEventListener("touchend", this.#onTouchEnd.bind(this));
        this.addEventListener("load", ({ detail: { doc } }) => {
          doc.addEventListener("touchstart", this.#onTouchStart.bind(this), opts);
          doc.addEventListener("touchmove", this.#onTouchMove.bind(this), opts);
          doc.addEventListener("touchend", this.#onTouchEnd.bind(this));
        });
        this.addEventListener("relocate", ({ detail }) => {
          if (detail.reason === "selection") setSelectionTo(this.#anchor, 0);
          else if (detail.reason === "navigation") {
            if (this.#anchor === 1) setSelectionTo(detail.range, 1);
            else if (typeof this.#anchor === "number")
              setSelectionTo(detail.range, -1);
            else setSelectionTo(this.#anchor, -1);
          }
        });
        const checkPointerSelection = debounce((range, sel) => {
          if (!sel.rangeCount) return;
          const selRange = sel.getRangeAt(0);
          const backward = selectionIsBackward(sel);
          if (backward && selRange.compareBoundaryPoints(Range.START_TO_START, range) < 0)
            this.prev();
          else if (!backward && selRange.compareBoundaryPoints(Range.END_TO_END, range) > 0)
            this.next();
        }, 700);
        this.addEventListener("load", ({ detail: { doc } }) => {
          let isPointerSelecting = false;
          doc.addEventListener("pointerdown", () => isPointerSelecting = true);
          doc.addEventListener("pointerup", () => isPointerSelecting = false);
          let isKeyboardSelecting = false;
          doc.addEventListener("keydown", () => isKeyboardSelecting = true);
          doc.addEventListener("keyup", () => isKeyboardSelecting = false);
          doc.addEventListener("selectionchange", () => {
            if (this.scrolled) return;
            const range = this.#lastVisibleRange;
            if (!range) return;
            const sel = doc.getSelection();
            if (!sel.rangeCount) return;
            if (isPointerSelecting && sel.type === "Range")
              checkPointerSelection(range, sel);
            else if (isKeyboardSelecting) {
              const selRange = sel.getRangeAt(0).cloneRange();
              const backward = selectionIsBackward(sel);
              if (!backward) selRange.collapse();
              this.#scrollToAnchor(selRange);
            }
          });
          doc.addEventListener("focusin", (e) => this.scrolled ? null : (
            // NOTE: `requestAnimationFrame` is needed in WebKit
            requestAnimationFrame(() => this.#scrollToAnchor(e.target))
          ));
        });
        this.#mediaQueryListener = () => {
          if (!this.#view) return;
          this.#background.style.background = getBackground(this.#view.document);
        };
        this.#mediaQuery.addEventListener("change", this.#mediaQueryListener);
      }
      attributeChangedCallback(name, _, value) {
        switch (name) {
          case "flow":
            this.render();
            break;
          case "gap":
          case "margin":
          case "max-block-size":
          case "max-column-count":
            this.#top.style.setProperty("--_" + name, value);
            break;
          case "max-inline-size":
            this.#top.style.setProperty("--_" + name, value);
            this.render();
            break;
        }
      }
      open(book) {
        this.bookDir = book.dir;
        this.sections = book.sections;
        book.transformTarget?.addEventListener("data", ({ detail }) => {
          if (detail.type !== "text/css") return;
          const w = innerWidth;
          const h = innerHeight;
          detail.data = Promise.resolve(detail.data).then((data) => data.replace(/(?<=[{\s;])-epub-/gi, "").replace(/(\d*\.?\d+)vw/gi, (_, d) => parseFloat(d) * w / 100 + "px").replace(/(\d*\.?\d+)vh/gi, (_, d) => parseFloat(d) * h / 100 + "px").replace(/page-break-(after|before|inside)\s*:/gi, (_, x) => `-webkit-column-break-${x}:`).replace(/break-(after|before|inside)\s*:\s*(avoid-)?page/gi, (_, x, y) => `break-${x}: ${y ?? ""}column`));
        });
      }
      #createView() {
        if (this.#view) {
          this.#view.destroy();
          this.#container.removeChild(this.#view.element);
        }
        this.#view = new View({
          container: this,
          onExpand: () => this.#scrollToAnchor(this.#anchor)
        });
        this.#container.append(this.#view.element);
        return this.#view;
      }
      #beforeRender({ vertical, rtl, background }) {
        this.#vertical = vertical;
        this.#rtl = rtl;
        this.#top.classList.toggle("vertical", vertical);
        this.#background.style.background = background;
        const { width, height } = this.#container.getBoundingClientRect();
        const size = vertical ? height : width;
        const style = getComputedStyle(this.#top);
        const maxInlineSize = parseFloat(style.getPropertyValue("--_max-inline-size"));
        const maxColumnCount = parseInt(style.getPropertyValue("--_max-column-count-spread"));
        const margin = parseFloat(style.getPropertyValue("--_margin"));
        this.#margin = margin;
        const g2 = parseFloat(style.getPropertyValue("--_gap")) / 100;
        const gap = -g2 / (g2 - 1) * size;
        const flow = this.getAttribute("flow");
        if (flow === "scrolled") {
          this.setAttribute("dir", vertical ? "rtl" : "ltr");
          this.#top.style.padding = "0";
          const columnWidth2 = maxInlineSize;
          this.heads = null;
          this.feet = null;
          this.#header.replaceChildren();
          this.#footer.replaceChildren();
          return { flow, margin, gap, columnWidth: columnWidth2 };
        }
        const divisor = Math.min(maxColumnCount, Math.ceil(size / maxInlineSize));
        const columnWidth = size / divisor - gap;
        this.setAttribute("dir", rtl ? "rtl" : "ltr");
        const marginalDivisor = vertical ? Math.min(2, Math.ceil(width / maxInlineSize)) : divisor;
        const marginalStyle = {
          gridTemplateColumns: `repeat(${marginalDivisor}, 1fr)`,
          gap: `${gap}px`,
          direction: this.bookDir === "rtl" ? "rtl" : "ltr"
        };
        Object.assign(this.#header.style, marginalStyle);
        Object.assign(this.#footer.style, marginalStyle);
        const heads = makeMarginals(marginalDivisor, "head");
        const feet = makeMarginals(marginalDivisor, "foot");
        this.heads = heads.map((el) => el.children[0]);
        this.feet = feet.map((el) => el.children[0]);
        this.#header.replaceChildren(...heads);
        this.#footer.replaceChildren(...feet);
        return { height, width, margin, gap, columnWidth };
      }
      render() {
        if (!this.#view) return;
        this.#view.render(this.#beforeRender({
          vertical: this.#vertical,
          rtl: this.#rtl
        }));
        this.#scrollToAnchor(this.#anchor);
      }
      get scrolled() {
        return this.getAttribute("flow") === "scrolled";
      }
      get scrollProp() {
        const { scrolled } = this;
        return this.#vertical ? scrolled ? "scrollLeft" : "scrollTop" : scrolled ? "scrollTop" : "scrollLeft";
      }
      get sideProp() {
        const { scrolled } = this;
        return this.#vertical ? scrolled ? "width" : "height" : scrolled ? "height" : "width";
      }
      get size() {
        return this.#container.getBoundingClientRect()[this.sideProp];
      }
      get viewSize() {
        return this.#view.element.getBoundingClientRect()[this.sideProp];
      }
      get start() {
        return Math.abs(this.#container[this.scrollProp]);
      }
      get end() {
        return this.start + this.size;
      }
      get page() {
        return Math.floor((this.start + this.end) / 2 / this.size);
      }
      get pages() {
        return Math.round(this.viewSize / this.size);
      }
      scrollBy(dx, dy) {
        const delta = this.#vertical ? dy : dx;
        const element = this.#container;
        const { scrollProp } = this;
        const [offset, a, b] = this.#scrollBounds;
        const rtl = this.#rtl;
        const min = rtl ? offset - b : offset - a;
        const max = rtl ? offset + a : offset + b;
        element[scrollProp] = Math.max(min, Math.min(
          max,
          element[scrollProp] + delta
        ));
      }
      snap(vx, vy) {
        const velocity = this.#vertical ? vy : vx;
        const [offset, a, b] = this.#scrollBounds;
        const { start, end, pages, size } = this;
        const min = Math.abs(offset) - a;
        const max = Math.abs(offset) + b;
        const d = velocity * (this.#rtl ? -size : size);
        const page = Math.floor(
          Math.max(min, Math.min(max, (start + end) / 2 + (isNaN(d) ? 0 : d))) / size
        );
        this.#scrollToPage(page, "snap").then(() => {
          const dir = page <= 0 ? -1 : page >= pages - 1 ? 1 : null;
          if (dir) return this.#goTo({
            index: this.#adjacentIndex(dir),
            anchor: dir < 0 ? () => 1 : () => 0
          });
        });
      }
      #onTouchStart(e) {
        const touch = e.changedTouches[0];
        this.#touchState = {
          x: touch?.screenX,
          y: touch?.screenY,
          t: e.timeStamp,
          vx: 0,
          xy: 0
        };
      }
      #onTouchMove(e) {
        const state = this.#touchState;
        if (state.pinched) return;
        state.pinched = globalThis.visualViewport.scale > 1;
        if (this.scrolled || state.pinched) return;
        if (e.touches.length > 1) {
          if (this.#touchScrolled) e.preventDefault();
          return;
        }
        e.preventDefault();
        const touch = e.changedTouches[0];
        const x = touch.screenX, y = touch.screenY;
        const dx = state.x - x, dy = state.y - y;
        const dt = e.timeStamp - state.t;
        state.x = x;
        state.y = y;
        state.t = e.timeStamp;
        state.vx = dx / dt;
        state.vy = dy / dt;
        this.#touchScrolled = true;
        this.scrollBy(dx, dy);
      }
      #onTouchEnd() {
        this.#touchScrolled = false;
        if (this.scrolled) return;
        requestAnimationFrame(() => {
          if (globalThis.visualViewport.scale === 1)
            this.snap(this.#touchState.vx, this.#touchState.vy);
        });
      }
      // allows one to process rects as if they were LTR and horizontal
      #getRectMapper() {
        if (this.scrolled) {
          const size = this.viewSize;
          const margin = this.#margin;
          return this.#vertical ? ({ left, right }) => ({ left: size - right - margin, right: size - left - margin }) : ({ top, bottom }) => ({ left: top + margin, right: bottom + margin });
        }
        const pxSize = this.pages * this.size;
        return this.#rtl ? ({ left, right }) => ({ left: pxSize - right, right: pxSize - left }) : this.#vertical ? ({ top, bottom }) => ({ left: top, right: bottom }) : (f) => f;
      }
      async #scrollToRect(rect, reason) {
        if (this.scrolled) {
          const offset2 = this.#getRectMapper()(rect).left - this.#margin;
          return this.#scrollTo(offset2, reason);
        }
        const offset = this.#getRectMapper()(rect).left;
        return this.#scrollToPage(Math.floor(offset / this.size) + (this.#rtl ? -1 : 1), reason);
      }
      async #scrollTo(offset, reason, smooth) {
        const element = this.#container;
        const { scrollProp, size } = this;
        if (element[scrollProp] === offset) {
          this.#scrollBounds = [offset, this.atStart ? 0 : size, this.atEnd ? 0 : size];
          this.#afterScroll(reason);
          return;
        }
        if (this.scrolled && this.#vertical) offset = -offset;
        if ((reason === "snap" || smooth) && this.hasAttribute("animated")) return animate(
          element[scrollProp],
          offset,
          300,
          easeOutQuad,
          (x) => element[scrollProp] = x
        ).then(() => {
          this.#scrollBounds = [offset, this.atStart ? 0 : size, this.atEnd ? 0 : size];
          this.#afterScroll(reason);
        });
        else {
          element[scrollProp] = offset;
          this.#scrollBounds = [offset, this.atStart ? 0 : size, this.atEnd ? 0 : size];
          this.#afterScroll(reason);
        }
      }
      async #scrollToPage(page, reason, smooth) {
        const offset = this.size * (this.#rtl ? -page : page);
        return this.#scrollTo(offset, reason, smooth);
      }
      async scrollToAnchor(anchor, select) {
        return this.#scrollToAnchor(anchor, select ? "selection" : "navigation");
      }
      async #scrollToAnchor(anchor, reason = "anchor") {
        this.#anchor = anchor;
        const rects = uncollapse(anchor)?.getClientRects?.();
        if (rects) {
          const rect = Array.from(rects).find((r) => r.width > 0 && r.height > 0) || rects[0];
          if (!rect) return;
          await this.#scrollToRect(rect, reason);
          return;
        }
        if (this.scrolled) {
          await this.#scrollTo(anchor * this.viewSize, reason);
          return;
        }
        const { pages } = this;
        if (!pages) return;
        const textPages = pages - 2;
        const newPage = Math.round(anchor * (textPages - 1));
        await this.#scrollToPage(newPage + 1, reason);
      }
      #getVisibleRange() {
        if (this.scrolled) return getVisibleRange(
          this.#view.document,
          this.start + this.#margin,
          this.end - this.#margin,
          this.#getRectMapper()
        );
        const size = this.#rtl ? -this.size : this.size;
        return getVisibleRange(
          this.#view.document,
          this.start - size,
          this.end - size,
          this.#getRectMapper()
        );
      }
      #afterScroll(reason) {
        const range = this.#getVisibleRange();
        this.#lastVisibleRange = range;
        if (reason !== "selection" && reason !== "navigation" && reason !== "anchor")
          this.#anchor = range;
        else this.#justAnchored = true;
        const index = this.#index;
        const detail = { reason, range, index };
        if (this.scrolled) detail.fraction = this.start / this.viewSize;
        else if (this.pages > 0) {
          const { page, pages } = this;
          this.#header.style.visibility = page > 1 ? "visible" : "hidden";
          detail.fraction = (page - 1) / (pages - 2);
          detail.size = 1 / (pages - 2);
        }
        this.dispatchEvent(new CustomEvent("relocate", { detail }));
      }
      async #display(promise) {
        const { index, src, anchor, onLoad, select } = await promise;
        this.#index = index;
        const hasFocus = this.#view?.document?.hasFocus();
        if (src) {
          const view = this.#createView();
          const afterLoad = (doc) => {
            if (doc.head) {
              const $styleBefore = doc.createElement("style");
              doc.head.prepend($styleBefore);
              const $style = doc.createElement("style");
              doc.head.append($style);
              this.#styleMap.set(doc, [$styleBefore, $style]);
            }
            onLoad?.({ doc, index });
          };
          const beforeRender = this.#beforeRender.bind(this);
          await view.load(src, afterLoad, beforeRender);
          this.dispatchEvent(new CustomEvent("create-overlayer", {
            detail: {
              doc: view.document,
              index,
              attach: (overlayer) => view.overlayer = overlayer
            }
          }));
          this.#view = view;
        }
        await this.scrollToAnchor((typeof anchor === "function" ? anchor(this.#view.document) : anchor) ?? 0, select);
        if (hasFocus) this.focusView();
      }
      #canGoToIndex(index) {
        return index >= 0 && index <= this.sections.length - 1;
      }
      async #goTo({ index, anchor, select }) {
        if (index === this.#index) await this.#display({ index, anchor, select });
        else {
          const oldIndex = this.#index;
          const onLoad = (detail) => {
            this.sections[oldIndex]?.unload?.();
            this.setStyles(this.#styles);
            this.dispatchEvent(new CustomEvent("load", { detail }));
          };
          await this.#display(Promise.resolve(this.sections[index].load()).then((src) => ({ index, src, anchor, onLoad, select })).catch((e) => {
            console.warn(e);
            console.warn(new Error(`Failed to load section ${index}`));
            return {};
          }));
        }
      }
      async goTo(target) {
        if (this.#locked) return;
        const resolved = await target;
        if (this.#canGoToIndex(resolved.index)) return this.#goTo(resolved);
      }
      #scrollPrev(distance) {
        if (!this.#view) return true;
        if (this.scrolled) {
          if (this.start > 0) return this.#scrollTo(
            Math.max(0, this.start - (distance ?? this.size)),
            null,
            true
          );
          return true;
        }
        if (this.atStart) return;
        const page = this.page - 1;
        return this.#scrollToPage(page, "page", true).then(() => page <= 0);
      }
      #scrollNext(distance) {
        if (!this.#view) return true;
        if (this.scrolled) {
          if (this.viewSize - this.end > 2) return this.#scrollTo(
            Math.min(this.viewSize, distance ? this.start + distance : this.end),
            null,
            true
          );
          return true;
        }
        if (this.atEnd) return;
        const page = this.page + 1;
        const pages = this.pages;
        return this.#scrollToPage(page, "page", true).then(() => page >= pages - 1);
      }
      get atStart() {
        return this.#adjacentIndex(-1) == null && this.page <= 1;
      }
      get atEnd() {
        return this.#adjacentIndex(1) == null && this.page >= this.pages - 2;
      }
      #adjacentIndex(dir) {
        for (let index = this.#index + dir; this.#canGoToIndex(index); index += dir)
          if (this.sections[index]?.linear !== "no") return index;
      }
      async #turnPage(dir, distance) {
        if (this.#locked) return;
        this.#locked = true;
        const prev = dir === -1;
        const shouldGo = await (prev ? this.#scrollPrev(distance) : this.#scrollNext(distance));
        if (shouldGo) await this.#goTo({
          index: this.#adjacentIndex(dir),
          anchor: prev ? () => 1 : () => 0
        });
        if (shouldGo || !this.hasAttribute("animated")) await wait(100);
        this.#locked = false;
      }
      prev(distance) {
        return this.#turnPage(-1, distance);
      }
      next(distance) {
        return this.#turnPage(1, distance);
      }
      prevSection() {
        return this.goTo({ index: this.#adjacentIndex(-1) });
      }
      nextSection() {
        return this.goTo({ index: this.#adjacentIndex(1) });
      }
      firstSection() {
        const index = this.sections.findIndex((section) => section.linear !== "no");
        return this.goTo({ index });
      }
      lastSection() {
        const index = this.sections.findLastIndex((section) => section.linear !== "no");
        return this.goTo({ index });
      }
      getContents() {
        if (this.#view) return [{
          index: this.#index,
          overlayer: this.#view.overlayer,
          doc: this.#view.document
        }];
        return [];
      }
      setStyles(styles) {
        this.#styles = styles;
        const $$styles = this.#styleMap.get(this.#view?.document);
        if (!$$styles) return;
        const [$beforeStyle, $style] = $$styles;
        if (Array.isArray(styles)) {
          const [beforeStyle, style] = styles;
          $beforeStyle.textContent = beforeStyle;
          $style.textContent = style;
        } else $style.textContent = styles;
        requestAnimationFrame(() => this.#background.style.background = getBackground(this.#view.document));
        this.#view?.document?.fonts?.ready?.then(() => this.#view.expand());
      }
      focusView() {
        this.#view.document.defaultView.focus();
      }
      destroy() {
        this.#observer.unobserve(this);
        this.#view.destroy();
        this.#view = null;
        this.sections[this.#index]?.unload?.();
        this.#mediaQuery.removeEventListener("change", this.#mediaQueryListener);
      }
    };
    if (!customElements.get("foliate-paginator")) customElements.define("foliate-paginator", Paginator);
  }
});

// vendor/foliate-js/search.js
var search_exports = {};
__export(search_exports, {
  search: () => search,
  searchMatcher: () => searchMatcher
});
var CONTEXT_LENGTH, normalizeWhitespace2, makeExcerpt, simpleSearch, segmenterSearch, search, searchMatcher;
var init_search = __esm({
  "vendor/foliate-js/search.js"() {
    "use strict";
    CONTEXT_LENGTH = 50;
    normalizeWhitespace2 = (str) => str.replace(/\s+/g, " ");
    makeExcerpt = (strs, { startIndex, startOffset, endIndex, endOffset }) => {
      const start = strs[startIndex];
      const end = strs[endIndex];
      const match = start === end ? start.slice(startOffset, endOffset) : start.slice(startOffset) + strs.slice(start + 1, end).join("") + end.slice(0, endOffset);
      const trimmedStart = normalizeWhitespace2(start.slice(0, startOffset)).trimStart();
      const trimmedEnd = normalizeWhitespace2(end.slice(endOffset)).trimEnd();
      const ellipsisPre = trimmedStart.length < CONTEXT_LENGTH ? "" : "\u2026";
      const ellipsisPost = trimmedEnd.length < CONTEXT_LENGTH ? "" : "\u2026";
      const pre = `${ellipsisPre}${trimmedStart.slice(-CONTEXT_LENGTH)}`;
      const post = `${trimmedEnd.slice(0, CONTEXT_LENGTH)}${ellipsisPost}`;
      return { pre, match, post };
    };
    simpleSearch = function* (strs, query, options = {}) {
      const { locales = "en", sensitivity } = options;
      const matchCase = sensitivity === "variant";
      const haystack = strs.join("");
      const lowerHaystack = matchCase ? haystack : haystack.toLocaleLowerCase(locales);
      const needle = matchCase ? query : query.toLocaleLowerCase(locales);
      const needleLength = needle.length;
      let index = -1;
      let strIndex = -1;
      let sum = 0;
      do {
        index = lowerHaystack.indexOf(needle, index + 1);
        if (index > -1) {
          while (sum <= index) sum += strs[++strIndex].length;
          const startIndex = strIndex;
          const startOffset = index - (sum - strs[strIndex].length);
          const end = index + needleLength;
          while (sum <= end) sum += strs[++strIndex].length;
          const endIndex = strIndex;
          const endOffset = end - (sum - strs[strIndex].length);
          const range = { startIndex, startOffset, endIndex, endOffset };
          yield { range, excerpt: makeExcerpt(strs, range) };
        }
      } while (index > -1);
    };
    segmenterSearch = function* (strs, query, options = {}) {
      const { locales = "en", granularity = "word", sensitivity = "base" } = options;
      let segmenter, collator;
      try {
        segmenter = new Intl.Segmenter(locales, { usage: "search", granularity });
        collator = new Intl.Collator(locales, { sensitivity });
      } catch (e) {
        console.warn(e);
        segmenter = new Intl.Segmenter("en", { usage: "search", granularity });
        collator = new Intl.Collator("en", { sensitivity });
      }
      const queryLength = Array.from(segmenter.segment(query)).length;
      const substrArr = [];
      let strIndex = 0;
      let segments = segmenter.segment(strs[strIndex])[Symbol.iterator]();
      main: while (strIndex < strs.length) {
        while (substrArr.length < queryLength) {
          const { done, value } = segments.next();
          if (done) {
            strIndex++;
            if (strIndex < strs.length) {
              segments = segmenter.segment(strs[strIndex])[Symbol.iterator]();
              continue;
            } else break main;
          }
          const { index, segment } = value;
          if (!/[^\p{Format}]/u.test(segment)) continue;
          if (/\s/u.test(segment)) {
            if (!/\s/u.test(substrArr[substrArr.length - 1]?.segment))
              substrArr.push({ strIndex, index, segment: " " });
            continue;
          }
          value.strIndex = strIndex;
          substrArr.push(value);
        }
        const substr = substrArr.map((x) => x.segment).join("");
        if (collator.compare(query, substr) === 0) {
          const endIndex = strIndex;
          const lastSeg = substrArr[substrArr.length - 1];
          const endOffset = lastSeg.index + lastSeg.segment.length;
          const startIndex = substrArr[0].strIndex;
          const startOffset = substrArr[0].index;
          const range = { startIndex, startOffset, endIndex, endOffset };
          yield { range, excerpt: makeExcerpt(strs, range) };
        }
        substrArr.shift();
      }
    };
    search = (strs, query, options) => {
      const { granularity = "grapheme", sensitivity = "base" } = options;
      if (!Intl?.Segmenter || granularity === "grapheme" && (sensitivity === "variant" || sensitivity === "accent"))
        return simpleSearch(strs, query, options);
      return segmenterSearch(strs, query, options);
    };
    searchMatcher = (textWalker2, opts) => {
      const { defaultLocale, matchCase, matchDiacritics, matchWholeWords, acceptNode: acceptNode2 } = opts;
      return function* (doc, query) {
        const iter = textWalker2(doc, function* (strs, makeRange2) {
          for (const result of search(strs, query, {
            locales: doc.body.lang || doc.documentElement.lang || defaultLocale || "en",
            granularity: matchWholeWords ? "word" : "grapheme",
            sensitivity: matchDiacritics && matchCase ? "variant" : matchDiacritics && !matchCase ? "accent" : !matchDiacritics && matchCase ? "case" : "base"
          })) {
            const { startIndex, startOffset, endIndex, endOffset } = result.range;
            result.range = makeRange2(startIndex, startOffset, endIndex, endOffset);
            yield result;
          }
        }, acceptNode2);
        for (const result of iter) yield result;
      };
    };
  }
});

// vendor/foliate-js/tts.js
var tts_exports = {};
__export(tts_exports, {
  TTS: () => TTS
});
function* getBlocks(doc) {
  let last;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const name = node.tagName.toLowerCase();
    if (blockTags.has(name)) {
      if (last) {
        last.setEndBefore(node);
        if (!rangeIsEmpty(last)) yield last;
      }
      last = doc.createRange();
      last.setStart(node, 0);
    }
  }
  if (!last) {
    last = doc.createRange();
    last.setStart(doc.body.firstChild ?? doc.body, 0);
  }
  last.setEndAfter(doc.body.lastChild ?? doc.body);
  if (!rangeIsEmpty(last)) yield last;
}
var NS2, blockTags, getLang, getAlphabet, getSegmenter, fragmentToSSML, getFragmentWithMarks, rangeIsEmpty, ListIterator, TTS;
var init_tts = __esm({
  "vendor/foliate-js/tts.js"() {
    "use strict";
    NS2 = {
      XML: "http://www.w3.org/XML/1998/namespace",
      SSML: "http://www.w3.org/2001/10/synthesis"
    };
    blockTags = /* @__PURE__ */ new Set([
      "article",
      "aside",
      "audio",
      "blockquote",
      "caption",
      "details",
      "dialog",
      "div",
      "dl",
      "dt",
      "dd",
      "figure",
      "footer",
      "form",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "hr",
      "li",
      "main",
      "math",
      "nav",
      "ol",
      "p",
      "pre",
      "section",
      "tr"
    ]);
    getLang = (el) => {
      const x = el.lang || el?.getAttributeNS?.(NS2.XML, "lang");
      return x ? x : el.parentElement ? getLang(el.parentElement) : null;
    };
    getAlphabet = (el) => {
      const x = el?.getAttributeNS?.(NS2.XML, "lang");
      return x ? x : el.parentElement ? getAlphabet(el.parentElement) : null;
    };
    getSegmenter = (lang = "en", granularity = "word") => {
      const segmenter = new Intl.Segmenter(lang, { granularity });
      const granularityIsWord = granularity === "word";
      return function* (strs, makeRange2) {
        const str = strs.join("");
        let name = 0;
        let strIndex = -1;
        let sum = 0;
        for (const { index, segment, isWordLike } of segmenter.segment(str)) {
          if (granularityIsWord && !isWordLike) continue;
          while (sum <= index) sum += strs[++strIndex].length;
          const startIndex = strIndex;
          const startOffset = index - (sum - strs[strIndex].length);
          const end = index + segment.length - 1;
          if (end < str.length) while (sum <= end) sum += strs[++strIndex].length;
          const endIndex = strIndex;
          const endOffset = end - (sum - strs[strIndex].length) + 1;
          yield [
            (name++).toString(),
            makeRange2(startIndex, startOffset, endIndex, endOffset)
          ];
        }
      };
    };
    fragmentToSSML = (fragment, inherited) => {
      const ssml = document.implementation.createDocument(NS2.SSML, "speak");
      const { lang } = inherited;
      if (lang) ssml.documentElement.setAttributeNS(NS2.XML, "lang", lang);
      const convert = (node, parent, inheritedAlphabet) => {
        if (!node) return;
        if (node.nodeType === 3) return ssml.createTextNode(node.textContent);
        if (node.nodeType === 4) return ssml.createCDATASection(node.textContent);
        if (node.nodeType !== 1 && node.nodeType !== 11) return;
        let el;
        const nodeName = node.nodeName.toLowerCase();
        if (nodeName === "foliate-mark") {
          el = ssml.createElementNS(NS2.SSML, "mark");
          el.setAttribute("name", node.dataset.name);
        } else if (nodeName === "br")
          el = ssml.createElementNS(NS2.SSML, "break");
        else if (nodeName === "em" || nodeName === "strong")
          el = ssml.createElementNS(NS2.SSML, "emphasis");
        const lang2 = node.lang || node.getAttributeNS?.(NS2.XML, "lang");
        if (lang2) {
          if (!el) el = ssml.createElementNS(NS2.SSML, "lang");
          el.setAttributeNS(NS2.XML, "lang", lang2);
        }
        const alphabet = node.getAttributeNS?.(NS2.SSML, "alphabet") || inheritedAlphabet;
        if (!el) {
          const ph = node.getAttributeNS?.(NS2.SSML, "ph");
          if (ph) {
            el = ssml.createElementNS(NS2.SSML, "phoneme");
            if (alphabet) el.setAttribute("alphabet", alphabet);
            el.setAttribute("ph", ph);
          }
        }
        if (!el) el = parent;
        let child = node.firstChild;
        while (child) {
          const childEl = convert(child, el, alphabet);
          if (childEl && el !== childEl) el.append(childEl);
          child = child.nextSibling;
        }
        return el;
      };
      convert(fragment, ssml.documentElement, inherited.alphabet);
      return ssml;
    };
    getFragmentWithMarks = (range, textWalker2, granularity) => {
      const lang = getLang(range.commonAncestorContainer);
      const alphabet = getAlphabet(range.commonAncestorContainer);
      const segmenter = getSegmenter(lang, granularity);
      const fragment = range.cloneContents();
      const entries = [...textWalker2(range, segmenter)];
      const fragmentEntries = [...textWalker2(fragment, segmenter)];
      for (const [name, range2] of fragmentEntries) {
        const mark = document.createElement("foliate-mark");
        mark.dataset.name = name;
        range2.insertNode(mark);
      }
      const ssml = fragmentToSSML(fragment, { lang, alphabet });
      return { entries, ssml };
    };
    rangeIsEmpty = (range) => !range.toString().trim();
    ListIterator = class {
      #arr = [];
      #iter;
      #index = -1;
      #f;
      constructor(iter, f = (x) => x) {
        this.#iter = iter;
        this.#f = f;
      }
      current() {
        if (this.#arr[this.#index]) return this.#f(this.#arr[this.#index]);
      }
      first() {
        const newIndex = 0;
        if (this.#arr[newIndex]) {
          this.#index = newIndex;
          return this.#f(this.#arr[newIndex]);
        }
      }
      prev() {
        const newIndex = this.#index - 1;
        if (this.#arr[newIndex]) {
          this.#index = newIndex;
          return this.#f(this.#arr[newIndex]);
        }
      }
      next() {
        const newIndex = this.#index + 1;
        if (this.#arr[newIndex]) {
          this.#index = newIndex;
          return this.#f(this.#arr[newIndex]);
        }
        while (true) {
          const { done, value } = this.#iter.next();
          if (done) break;
          this.#arr.push(value);
          if (this.#arr[newIndex]) {
            this.#index = newIndex;
            return this.#f(this.#arr[newIndex]);
          }
        }
      }
      find(f) {
        const index = this.#arr.findIndex((x) => f(x));
        if (index > -1) {
          this.#index = index;
          return this.#f(this.#arr[index]);
        }
        while (true) {
          const { done, value } = this.#iter.next();
          if (done) break;
          this.#arr.push(value);
          if (f(value)) {
            this.#index = this.#arr.length - 1;
            return this.#f(value);
          }
        }
      }
    };
    TTS = class {
      #list;
      #ranges;
      #lastMark;
      #serializer = new XMLSerializer();
      constructor(doc, textWalker2, highlight, granularity) {
        this.doc = doc;
        this.highlight = highlight;
        this.#list = new ListIterator(getBlocks(doc), (range) => {
          const { entries, ssml } = getFragmentWithMarks(range, textWalker2, granularity);
          this.#ranges = new Map(entries);
          return [ssml, range];
        });
      }
      #getMarkElement(doc, mark) {
        if (!mark) return null;
        return doc.querySelector(`mark[name="${CSS.escape(mark)}"`);
      }
      #speak(doc, getNode) {
        if (!doc) return;
        if (!getNode) return this.#serializer.serializeToString(doc);
        const ssml = document.implementation.createDocument(NS2.SSML, "speak");
        ssml.documentElement.replaceWith(ssml.importNode(doc.documentElement, true));
        let node = getNode(ssml)?.previousSibling;
        while (node) {
          const next = node.previousSibling ?? node.parentNode?.previousSibling;
          node.parentNode.removeChild(node);
          node = next;
        }
        return this.#serializer.serializeToString(ssml);
      }
      start() {
        this.#lastMark = null;
        const [doc] = this.#list.first() ?? [];
        if (!doc) return this.next();
        return this.#speak(doc, (ssml) => this.#getMarkElement(ssml, this.#lastMark));
      }
      resume() {
        const [doc] = this.#list.current() ?? [];
        if (!doc) return this.next();
        return this.#speak(doc, (ssml) => this.#getMarkElement(ssml, this.#lastMark));
      }
      prev(paused) {
        this.#lastMark = null;
        const [doc, range] = this.#list.prev() ?? [];
        if (paused && range) this.highlight(range.cloneRange());
        return this.#speak(doc);
      }
      next(paused) {
        this.#lastMark = null;
        const [doc, range] = this.#list.next() ?? [];
        if (paused && range) this.highlight(range.cloneRange());
        return this.#speak(doc);
      }
      from(range) {
        this.#lastMark = null;
        const [doc] = this.#list.find((range_) => range.compareBoundaryPoints(Range.END_TO_START, range_) <= 0);
        let mark;
        for (const [name, range_] of this.#ranges.entries())
          if (range.compareBoundaryPoints(Range.START_TO_START, range_) <= 0) {
            mark = name;
            break;
          }
        return this.#speak(doc, (ssml) => this.#getMarkElement(ssml, mark));
      }
      setMark(mark) {
        const range = this.#ranges.get(mark);
        if (range) {
          this.#lastMark = mark;
          this.highlight(range.cloneRange());
        }
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MakiPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian9 = require("obsidian");

// src/backends/epub/epub-view.ts
var import_obsidian = require("obsidian");

// src/core/locator/cfi.ts
var RESERVED = /* @__PURE__ */ new Set(["%", "[", "]", ",", "&", "=", "#", "|", "(", ")", ":"]);
function encodeCfi(cfi) {
  let out = "";
  for (const ch of cfi) {
    if (RESERVED.has(ch)) {
      const code = ch.codePointAt(0);
      out += `%${code.toString(16).toUpperCase().padStart(2, "0")}`;
    } else {
      out += ch;
    }
  }
  return out;
}
function decodeCfi(encoded) {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}
function spineSectionIndex(cfi) {
  const match = /^\/6\/(\d+)/.exec(cfi);
  if (!match) return null;
  const step = Number(match[1]);
  if (step <= 0 || step % 2 !== 0) return null;
  return step / 2 - 1;
}
function wrapCfi(body) {
  return `epubcfi(${body})`;
}
function unwrapCfi(cfi) {
  const match = /^epubcfi\((.*)\)$/.exec(cfi);
  return match ? match[1] : cfi;
}

// src/core/locator/codec.ts
function expectBackend(loc, backend, codecName) {
  if (loc.backend !== backend) {
    throw new Error(`${codecName} cannot encode a '${loc.backend}' locator`);
  }
  return loc;
}

// src/core/locator/epub-codec.ts
var EpubLocatorCodec = {
  encode(loc) {
    const epub = expectBackend(loc, "epub", "EpubLocatorCodec");
    return { epubcfi: encodeCfi(epub.cfi) };
  },
  decode(params) {
    const encoded = params["epubcfi"];
    if (encoded === void 0 || encoded === "") return null;
    const cfi = decodeCfi(encoded);
    if (cfi === null || cfi === "") return null;
    return { backend: "epub", cfi };
  }
};

// src/core/locator/link.ts
var COLOR_PARAM_KEY = "color";
function serializeSubpath(params) {
  return Object.entries(params).map(([key, value]) => `${key}=${value}`).join("&");
}
function parseSubpath(subpath) {
  const params = {};
  for (const pair of subpath.split("&")) {
    if (pair === "") continue;
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    params[pair.slice(0, eq)] = pair.slice(eq + 1);
  }
  return params;
}
function buildLink(ref, params, display) {
  const subpath = serializeSubpath(params);
  const alias = display !== void 0 && display !== "" ? `|${display}` : "";
  return `[[${ref.path}#${subpath}${alias}]]`;
}
function highlightIdFor(loc, codec2) {
  return `${loc.backend}:${serializeSubpath(codec2.encode(loc))}`;
}
function parseAnnotationLink(rawLink) {
  const hash2 = rawLink.indexOf("#");
  if (hash2 < 0) return null;
  const params = parseSubpath(rawLink.slice(hash2 + 1));
  if (Object.keys(params).length === 0) return null;
  const target = { linkpath: rawLink.slice(0, hash2), params };
  const color = params[COLOR_PARAM_KEY];
  if (color !== void 0) target.color = color;
  return target;
}
function sameParams(a, b) {
  const aKeys = Object.keys(a);
  return aKeys.length === Object.keys(b).length && aKeys.every((k) => a[k] === b[k]);
}
function removeAnnotationLink(content, subpath, lineHint) {
  const lines = content.split("\n");
  const removeFrom = (index) => {
    const line = lines[index];
    if (line === void 0) return false;
    let cursor = 0;
    while (true) {
      const open = line.indexOf("[[", cursor);
      if (open < 0) return false;
      const close = line.indexOf("]]", open + 2);
      if (close < 0) return false;
      const inner = line.slice(open + 2, close);
      if (inner.includes("[[")) {
        cursor = open + 2;
        continue;
      }
      cursor = close + 2;
      const pipe = inner.indexOf("|");
      const target = pipe >= 0 ? inner.slice(0, pipe) : inner;
      const hash2 = target.indexOf("#");
      if (hash2 < 0) continue;
      if (!sameParams(parseSubpath(target.slice(hash2 + 1)), subpath)) continue;
      const start = open > 0 && line[open - 1] === "!" ? open - 1 : open;
      lines[index] = line.slice(0, start) + line.slice(close + 2);
      return true;
    }
  };
  if (lineHint !== void 0 && removeFrom(lineHint)) return lines.join("\n");
  for (let i = 0; i < lines.length; i++) {
    if (i === lineHint) continue;
    if (removeFrom(i)) return lines.join("\n");
  }
  return null;
}

// vendor/foliate-js/epubcfi.js
var findIndices = (arr, f) => arr.map((x, i, a) => f(x, i, a) ? i : null).filter((x) => x != null);
var splitAt = (arr, is) => [-1, ...is, arr.length].reduce(({ xs, a }, b) => ({ xs: xs?.concat([arr.slice(a + 1, b)]) ?? [], a: b }), {}).xs;
var concatArrays = (a, b) => a.slice(0, -1).concat([a[a.length - 1].concat(b[0])]).concat(b.slice(1));
var isNumber = /\d/;
var isCFI = /^epubcfi\((.*)\)$/;
var escapeCFI = (str) => str.replace(/[\^[\](),;=]/g, "^$&");
var wrap = (x) => isCFI.test(x) ? x : `epubcfi(${x})`;
var unwrap = (x) => x.match(isCFI)?.[1] ?? x;
var lift = (f) => (...xs) => `epubcfi(${f(...xs.map((x) => x.match(isCFI)?.[1] ?? x))})`;
var joinIndir = lift((...xs) => xs.join("!"));
var tokenizer = (str) => {
  const tokens = [];
  let state, escape, value = "";
  const push = (x) => (tokens.push(x), state = null, value = "");
  const cat = (x) => (value += x, escape = false);
  for (const char of Array.from(str.trim()).concat("")) {
    if (char === "^" && !escape) {
      escape = true;
      continue;
    }
    if (state === "!") push(["!"]);
    else if (state === ",") push([","]);
    else if (state === "/" || state === ":") {
      if (isNumber.test(char)) {
        cat(char);
        continue;
      } else push([state, parseInt(value)]);
    } else if (state === "~") {
      if (isNumber.test(char) || char === ".") {
        cat(char);
        continue;
      } else push(["~", parseFloat(value)]);
    } else if (state === "@") {
      if (char === ":") {
        push(["@", parseFloat(value)]);
        state = "@";
        continue;
      }
      if (isNumber.test(char) || char === ".") {
        cat(char);
        continue;
      } else push(["@", parseFloat(value)]);
    } else if (state === "[") {
      if (char === ";" && !escape) {
        push(["[", value]);
        state = ";";
      } else if (char === "," && !escape) {
        push(["[", value]);
        state = "[";
      } else if (char === "]" && !escape) push(["[", value]);
      else cat(char);
      continue;
    } else if (state?.startsWith(";")) {
      if (char === "=" && !escape) {
        state = `;${value}`;
        value = "";
      } else if (char === ";" && !escape) {
        push([state, value]);
        state = ";";
      } else if (char === "]" && !escape) push([state, value]);
      else cat(char);
      continue;
    }
    if (char === "/" || char === ":" || char === "~" || char === "@" || char === "[" || char === "!" || char === ",") state = char;
  }
  return tokens;
};
var findTokens = (tokens, x) => findIndices(tokens, ([t2]) => t2 === x);
var parser = (tokens) => {
  const parts = [];
  let state;
  for (const [type, val] of tokens) {
    if (type === "/") parts.push({ index: val });
    else {
      const last = parts[parts.length - 1];
      if (type === ":") last.offset = val;
      else if (type === "~") last.temporal = val;
      else if (type === "@") last.spatial = (last.spatial ?? []).concat(val);
      else if (type === ";s") last.side = val;
      else if (type === "[") {
        if (state === "/" && val) last.id = val;
        else {
          last.text = (last.text ?? []).concat(val);
          continue;
        }
      }
    }
    state = type;
  }
  return parts;
};
var parserIndir = (tokens) => splitAt(tokens, findTokens(tokens, "!")).map(parser);
var parse = (cfi) => {
  const tokens = tokenizer(unwrap(cfi));
  const commas = findTokens(tokens, ",");
  if (!commas.length) return parserIndir(tokens);
  const [parent, start, end] = splitAt(tokens, commas).map(parserIndir);
  return { parent, start, end };
};
var partToString = ({ index, id, offset, temporal, spatial, text, side }) => {
  const param = side ? `;s=${side}` : "";
  return `/${index}` + (id ? `[${escapeCFI(id)}${param}]` : "") + (offset != null && index % 2 ? `:${offset}` : "") + (temporal ? `~${temporal}` : "") + (spatial ? `@${spatial.join(":")}` : "") + (text || !id && side ? "[" + (text?.map(escapeCFI)?.join(",") ?? "") + param + "]" : "");
};
var toInnerString = (parsed) => parsed.parent ? [parsed.parent, parsed.start, parsed.end].map(toInnerString).join(",") : parsed.map((parts) => parts.map(partToString).join("")).join("!");
var toString = (parsed) => wrap(toInnerString(parsed));
var collapse = (x, toEnd) => typeof x === "string" ? toString(collapse(parse(x), toEnd)) : x.parent ? concatArrays(x.parent, x[toEnd ? "end" : "start"]) : x;
var buildRange = (from, to) => {
  if (typeof from === "string") from = parse(from);
  if (typeof to === "string") to = parse(to);
  from = collapse(from);
  to = collapse(to, true);
  const localFrom = from[from.length - 1], localTo = to[to.length - 1];
  const localParent = [], localStart = [], localEnd = [];
  let pushToParent = true;
  const len = Math.max(localFrom.length, localTo.length);
  for (let i = 0; i < len; i++) {
    const a = localFrom[i], b = localTo[i];
    pushToParent &&= a?.index === b?.index && !a?.offset && !b?.offset;
    if (pushToParent) localParent.push(a);
    else {
      if (a) localStart.push(a);
      if (b) localEnd.push(b);
    }
  }
  const parent = from.slice(0, -1).concat([localParent]);
  return toString({ parent, start: [localStart], end: [localEnd] });
};
var compare = (a, b) => {
  if (typeof a === "string") a = parse(a);
  if (typeof b === "string") b = parse(b);
  if (a.start || b.start) return compare(collapse(a), collapse(b)) || compare(collapse(a, true), collapse(b, true));
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const p = a[i] ?? [], q = b[i] ?? [];
    const maxIndex = Math.max(p.length, q.length) - 1;
    for (let i2 = 0; i2 <= maxIndex; i2++) {
      const x = p[i2], y = q[i2];
      if (!x) return -1;
      if (!y) return 1;
      if (x.index > y.index) return 1;
      if (x.index < y.index) return -1;
      if (i2 === maxIndex) {
        if (x.offset > y.offset) return 1;
        if (x.offset < y.offset) return -1;
      }
    }
  }
  return 0;
};
var isTextNode = ({ nodeType }) => nodeType === 3 || nodeType === 4;
var isElementNode = ({ nodeType }) => nodeType === 1;
var getChildNodes = (node, filter3) => {
  const nodes = Array.from(node.childNodes).filter((node2) => isTextNode(node2) || isElementNode(node2));
  return filter3 ? nodes.map((node2) => {
    const accept = filter3(node2);
    if (accept === NodeFilter.FILTER_REJECT) return null;
    else if (accept === NodeFilter.FILTER_SKIP) return getChildNodes(node2, filter3);
    else return node2;
  }).flat().filter((x) => x) : nodes;
};
var indexChildNodes = (node, filter3) => {
  const nodes = getChildNodes(node, filter3).reduce((arr, node2) => {
    let last = arr[arr.length - 1];
    if (!last) arr.push(node2);
    else if (isTextNode(node2)) {
      if (Array.isArray(last)) last.push(node2);
      else if (isTextNode(last)) arr[arr.length - 1] = [last, node2];
      else arr.push(node2);
    } else {
      if (isElementNode(last)) arr.push(null, node2);
      else arr.push(node2);
    }
    return arr;
  }, []);
  if (isElementNode(nodes[0])) nodes.unshift("first");
  if (isElementNode(nodes[nodes.length - 1])) nodes.push("last");
  nodes.unshift("before");
  nodes.push("after");
  return nodes;
};
var partsToNode = (node, parts, filter3) => {
  const { id } = parts[parts.length - 1];
  if (id) {
    const el = node.ownerDocument.getElementById(id);
    if (el) return { node: el, offset: 0 };
  }
  for (const { index } of parts) {
    const newNode = node ? indexChildNodes(node, filter3)[index] : null;
    if (newNode === "first") return { node: node.firstChild ?? node };
    if (newNode === "last") return { node: node.lastChild ?? node };
    if (newNode === "before") return { node, before: true };
    if (newNode === "after") return { node, after: true };
    node = newNode;
  }
  const { offset } = parts[parts.length - 1];
  if (!Array.isArray(node)) return { node, offset };
  let sum = 0;
  for (const n of node) {
    const { length } = n.nodeValue;
    if (sum + length >= offset) return { node: n, offset: offset - sum };
    sum += length;
  }
};
var nodeToParts = (node, offset, filter3) => {
  let { id, parentNode } = node;
  while (filter3 && parentNode && parentNode !== node.ownerDocument.documentElement && filter3(parentNode) === NodeFilter.FILTER_SKIP)
    parentNode = parentNode.parentNode;
  const indexed = indexChildNodes(parentNode, filter3);
  const index = indexed.findIndex((x) => Array.isArray(x) ? x.some((x2) => x2 === node) : x === node);
  const chunk = indexed[index];
  if (Array.isArray(chunk)) {
    let sum = 0;
    for (const x of chunk) {
      if (x === node) {
        sum += offset;
        break;
      } else sum += x.nodeValue.length;
    }
    offset = sum;
  }
  const part = { id, index, offset };
  return (parentNode !== node.ownerDocument.documentElement ? nodeToParts(parentNode, null, filter3).concat(part) : [part]).filter((x) => x.index !== -1);
};
var fromRange = (range, filter3) => {
  const { startContainer, startOffset, endContainer, endOffset } = range;
  const start = nodeToParts(startContainer, startOffset, filter3);
  if (range.collapsed) return toString([start]);
  const end = nodeToParts(endContainer, endOffset, filter3);
  return buildRange([start], [end]);
};
var toRange = (doc, parts, filter3) => {
  const startParts = collapse(parts);
  const endParts = collapse(parts, true);
  const root = doc.documentElement;
  const start = partsToNode(root, startParts[0], filter3);
  const end = partsToNode(root, endParts[0], filter3);
  const range = doc.createRange();
  if (start.before) range.setStartBefore(start.node);
  else if (start.after) range.setStartAfter(start.node);
  else range.setStart(start.node, start.offset);
  if (end.before) range.setEndBefore(end.node);
  else if (end.after) range.setEndAfter(end.node);
  else range.setEnd(end.node, end.offset);
  return range;
};
var fromElements = (elements) => {
  const results = [];
  const { parentNode } = elements[0];
  const parts = nodeToParts(parentNode);
  for (const [index, node] of indexChildNodes(parentNode).entries()) {
    const el = elements[results.length];
    if (node === el)
      results.push(toString([parts.concat({ id: el.id, index })]));
  }
  return results;
};
var toElement = (doc, parts) => partsToNode(doc.documentElement, collapse(parts)).node;
var fake = {
  fromIndex: (index) => wrap(`/6/${(index + 1) * 2}`),
  toIndex: (parts) => parts?.at(-1).index / 2 - 1
};

// vendor/foliate-js/epub.js
var NS = {
  CONTAINER: "urn:oasis:names:tc:opendocument:xmlns:container",
  XHTML: "http://www.w3.org/1999/xhtml",
  OPF: "http://www.idpf.org/2007/opf",
  EPUB: "http://www.idpf.org/2007/ops",
  DC: "http://purl.org/dc/elements/1.1/",
  DCTERMS: "http://purl.org/dc/terms/",
  ENC: "http://www.w3.org/2001/04/xmlenc#",
  NCX: "http://www.daisy.org/z3986/2005/ncx/",
  XLINK: "http://www.w3.org/1999/xlink",
  SMIL: "http://www.w3.org/ns/SMIL"
};
var MIME = {
  XML: "application/xml",
  NCX: "application/x-dtbncx+xml",
  XHTML: "application/xhtml+xml",
  HTML: "text/html",
  CSS: "text/css",
  SVG: "image/svg+xml",
  JS: /\/(x-)?(javascript|ecmascript)/
};
var PREFIX = {
  a11y: "http://www.idpf.org/epub/vocab/package/a11y/#",
  dcterms: "http://purl.org/dc/terms/",
  marc: "http://id.loc.gov/vocabulary/",
  media: "http://www.idpf.org/epub/vocab/overlays/#",
  onix: "http://www.editeur.org/ONIX/book/codelists/current.html#",
  rendition: "http://www.idpf.org/vocab/rendition/#",
  schema: "http://schema.org/",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  msv: "http://www.idpf.org/epub/vocab/structure/magazine/#",
  prism: "http://www.prismstandard.org/specifications/3.0/PRISM_CV_Spec_3.0.htm#"
};
var RELATORS = {
  art: "artist",
  aut: "author",
  clr: "colorist",
  edt: "editor",
  ill: "illustrator",
  nrt: "narrator",
  trl: "translator",
  pbl: "publisher"
};
var ONIX5 = {
  "02": "isbn",
  "06": "doi",
  "15": "isbn",
  "26": "doi",
  "34": "issn"
};
var camel = (x) => x.toLowerCase().replace(/[-:](.)/g, (_, g2) => g2.toUpperCase());
var normalizeWhitespace = (str) => str ? str.replace(/[\t\n\f\r ]+/g, " ").replace(/^[\t\n\f\r ]+/, "").replace(/[\t\n\f\r ]+$/, "") : "";
var filterAttribute = (attr, value, isList) => isList ? (el) => el.getAttribute(attr)?.split(/\s/)?.includes(value) : typeof value === "function" ? (el) => value(el.getAttribute(attr)) : (el) => el.getAttribute(attr) === value;
var getAttributes = (...xs) => (el) => el ? Object.fromEntries(xs.map((x) => [camel(x), el.getAttribute(x)])) : null;
var getElementText = (el) => normalizeWhitespace(el?.textContent);
var childGetter = (doc, ns) => {
  const useNS = doc.lookupNamespaceURI(null) === ns || doc.lookupPrefix(ns);
  const f = useNS ? (el, name) => (el2) => el2.namespaceURI === ns && el2.localName === name : (el, name) => (el2) => el2.localName === name;
  return {
    $: (el, name) => [...el.children].find(f(el, name)),
    $$: (el, name) => [...el.children].filter(f(el, name)),
    $$$: useNS ? (el, name) => [...el.getElementsByTagNameNS(ns, name)] : (el, name) => [...el.getElementsByTagName(name)]
  };
};
var resolveURL = (url, relativeTo) => {
  try {
    if (relativeTo.includes(":")) return new URL(url, relativeTo);
    const root = "https://invalid.invalid/";
    const obj = new URL(url, root + relativeTo);
    obj.search = "";
    return decodeURI(obj.href.replace(root, ""));
  } catch (e) {
    console.warn(e);
    return url;
  }
};
var isExternal = (uri) => /^(?!blob)\w+:/i.test(uri);
var pathRelative = (from, to) => {
  if (!from) return to;
  const as = from.replace(/\/$/, "").split("/");
  const bs = to.replace(/\/$/, "").split("/");
  const i = (as.length > bs.length ? as : bs).findIndex((_, i2) => as[i2] !== bs[i2]);
  return i < 0 ? "" : Array(as.length - i).fill("..").concat(bs.slice(i)).join("/");
};
var pathDirname = (str) => str.slice(0, str.lastIndexOf("/") + 1);
var replaceSeries = async (str, regex, f) => {
  const matches = [];
  str.replace(regex, (...args) => (matches.push(args), null));
  const results = [];
  for (const args of matches) results.push(await f(...args));
  return str.replace(regex, () => results.shift());
};
var regexEscape = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
var tidy = (obj) => {
  for (const [key, val] of Object.entries(obj))
    if (val == null) delete obj[key];
    else if (Array.isArray(val)) {
      obj[key] = val.filter((x) => x).map((x) => typeof x === "object" && !Array.isArray(x) ? tidy(x) : x);
      if (!obj[key].length) delete obj[key];
      else if (obj[key].length === 1) obj[key] = obj[key][0];
    } else if (typeof val === "object") {
      obj[key] = tidy(val);
      if (!Object.keys(val).length) delete obj[key];
    }
  const keys = Object.keys(obj);
  if (keys.length === 1 && keys[0] === "name") return obj[keys[0]];
  return obj;
};
var getPrefixes = (doc) => {
  const map = new Map(Object.entries(PREFIX));
  const value = doc.documentElement.getAttributeNS(NS.EPUB, "prefix") || doc.documentElement.getAttribute("prefix");
  if (value) for (const [, prefix, url] of value.matchAll(/(.+): +(.+)[ \t\r\n]*/g)) map.set(prefix, url);
  return map;
};
var getPropertyURL = (value, prefixes) => {
  if (!value) return null;
  const [a, b] = value.split(":");
  const prefix = b ? a : null;
  const reference = b ? b : a;
  const baseURL = prefixes.get(prefix);
  return baseURL ? baseURL + reference : null;
};
var getMetadata = (opf) => {
  const { $ } = childGetter(opf, NS.OPF);
  const $metadata = $(opf.documentElement, "metadata");
  const els = Object.groupBy($metadata.children, (el) => el.namespaceURI === NS.DC ? "dc" : el.namespaceURI === NS.OPF && el.localName === "meta" ? el.hasAttribute("name") ? "legacyMeta" : "meta" : "");
  const baseLang = $metadata.getAttribute("xml:lang") ?? opf.documentElement.getAttribute("xml:lang") ?? "und";
  const prefixes = getPrefixes(opf);
  const parse2 = (el) => {
    const property = el.getAttribute("property");
    const scheme = el.getAttribute("scheme");
    return {
      property: getPropertyURL(property, prefixes) ?? property,
      scheme: getPropertyURL(scheme, prefixes) ?? scheme,
      lang: el.getAttribute("xml:lang"),
      value: getElementText(el),
      props: getProperties(el),
      // `opf:` attributes from EPUB 2 & EPUB 3.1 (removed in EPUB 3.2)
      attrs: Object.fromEntries(Array.from(el.attributes).filter((attr) => attr.namespaceURI === NS.OPF).map((attr) => [attr.localName, attr.value]))
    };
  };
  const refines = Map.groupBy(els.meta ?? [], (el) => el.getAttribute("refines"));
  const getProperties = (el) => {
    const els2 = refines.get(el ? "#" + el.getAttribute("id") : null);
    if (!els2) return null;
    return Object.groupBy(els2.map(parse2), (x) => x.property);
  };
  const dc = Object.fromEntries(Object.entries(Object.groupBy(els.dc, (el) => el.localName)).map(([name, els2]) => [name, els2.map(parse2)]));
  const properties = getProperties() ?? {};
  const legacyMeta = Object.fromEntries(els.legacyMeta?.map((el) => [el.getAttribute("name"), el.getAttribute("content")]) ?? []);
  const one = (x) => x?.[0]?.value;
  const prop = (x, p) => one(x?.props?.[p]);
  const makeLanguageMap = (x) => {
    if (!x) return null;
    const alts = x.props?.["alternate-script"] ?? [];
    const altRep = x.attrs["alt-rep"];
    if (!alts.length && (!x.lang || x.lang === baseLang) && !altRep) return x.value;
    const map = { [x.lang ?? baseLang]: x.value };
    if (altRep) map[x.attrs["alt-rep-lang"]] = altRep;
    for (const y of alts) map[y.lang] ??= y.value;
    return map;
  };
  const makeContributor = (x) => x ? {
    name: makeLanguageMap(x),
    sortAs: makeLanguageMap(x.props?.["file-as"]?.[0]) ?? x.attrs["file-as"],
    role: x.props?.role?.filter((x2) => x2.scheme === PREFIX.marc + "relators")?.map((x2) => x2.value) ?? [x.attrs.role],
    code: prop(x, "term") ?? x.attrs.term,
    scheme: prop(x, "authority") ?? x.attrs.authority
  } : null;
  const makeCollection = (x) => ({
    name: makeLanguageMap(x),
    // NOTE: webpub requires number but EPUB allows values like "2.2.1"
    position: one(x.props?.["group-position"])
  });
  const makeAltIdentifier = (x) => {
    const { value } = x;
    if (/^urn:/i.test(value)) return value;
    if (/^doi:/i.test(value)) return `urn:${value}`;
    const type = x.props?.["identifier-type"];
    if (!type) {
      const scheme = x.attrs.scheme;
      if (!scheme) return value;
      if (/^(doi|isbn|uuid)$/i.test(scheme)) return `urn:${scheme}:${value}`;
      return { scheme, value };
    }
    if (type.scheme === PREFIX.onix + "codelist5") {
      const nid = ONIX5[type.value];
      if (nid) return `urn:${nid}:${value}`;
    }
    return value;
  };
  const belongsTo = Object.groupBy(
    properties["belongs-to-collection"] ?? [],
    (x) => prop(x, "collection-type") === "series" ? "series" : "collection"
  );
  const mainTitle = dc.title?.find((x) => prop(x, "title-type") === "main") ?? dc.title?.[0];
  const metadata = {
    identifier: getIdentifier(opf),
    title: makeLanguageMap(mainTitle),
    sortAs: makeLanguageMap(mainTitle?.props?.["file-as"]?.[0]) ?? mainTitle?.attrs?.["file-as"] ?? legacyMeta?.["calibre:title_sort"],
    subtitle: dc.title?.find((x) => prop(x, "title-type") === "subtitle")?.value,
    language: dc.language?.map((x) => x.value),
    description: one(dc.description),
    publisher: dc.publisher?.map(makeContributor),
    published: dc.date?.find((x) => x.attrs.event === "publication")?.value ?? one(dc.date),
    modified: one(properties[PREFIX.dcterms + "modified"]) ?? dc.date?.find((x) => x.attrs.event === "modification")?.value,
    subject: dc.subject?.map(makeContributor),
    belongsTo: {
      collection: belongsTo.collection?.map(makeCollection),
      series: belongsTo.series?.map(makeCollection) ?? legacyMeta?.["calibre:series"] ? {
        name: legacyMeta?.["calibre:series"],
        position: parseFloat(legacyMeta?.["calibre:series_index"])
      } : null
    },
    altIdentifier: dc.identifier?.map(makeAltIdentifier),
    source: dc.source?.map(makeAltIdentifier),
    // NOTE: not in webpub schema
    rights: one(dc.rights),
    // NOTE: not in webpub schema
    pageBreakSource: one(properties["pageBreakSource"])
    // NOTE: not in webpub schema
  };
  const remapContributor = (defaultKey) => (x) => {
    const keys = new Set(x.role?.map((role) => RELATORS[role] ?? defaultKey));
    return [keys.size ? keys : [defaultKey], x];
  };
  for (const [keys, val] of [].concat(
    dc.creator?.map(makeContributor)?.map(remapContributor("author")) ?? [],
    dc.contributor?.map(makeContributor)?.map(remapContributor("contributor")) ?? []
  ))
    for (const key of keys)
      if (metadata[key]) metadata[key].push(val);
      else metadata[key] = [val];
  tidy(metadata);
  if (metadata.altIdentifier === metadata.identifier)
    delete metadata.altIdentifier;
  const rendition = {};
  const media = {};
  for (const [key, val] of Object.entries(properties)) {
    if (key.startsWith(PREFIX.rendition))
      rendition[camel(key.replace(PREFIX.rendition, ""))] = one(val);
    else if (key.startsWith(PREFIX.media))
      media[camel(key.replace(PREFIX.media, ""))] = one(val);
  }
  if (media.duration) media.duration = parseClock(media.duration);
  return { metadata, rendition, media };
};
var parseNav = (doc, resolve = (f) => f) => {
  const { $, $$, $$$ } = childGetter(doc, NS.XHTML);
  const resolveHref = (href) => href ? decodeURI(resolve(href)) : null;
  const parseLI = (getType) => ($li) => {
    const $a = $($li, "a") ?? $($li, "span");
    const $ol = $($li, "ol");
    const href = resolveHref($a?.getAttribute("href"));
    const label2 = getElementText($a) || $a?.getAttribute("title");
    const result = { label: label2, href, subitems: parseOL($ol) };
    if (getType) result.type = $a?.getAttributeNS(NS.EPUB, "type")?.split(/\s/);
    return result;
  };
  const parseOL = ($ol, getType) => $ol ? $$($ol, "li").map(parseLI(getType)) : null;
  const parseNav2 = ($nav, getType) => parseOL($($nav, "ol"), getType);
  const $$nav = $$$(doc, "nav");
  let toc = null, pageList = null, landmarks = null, others = [];
  for (const $nav of $$nav) {
    const type = $nav.getAttributeNS(NS.EPUB, "type")?.split(/\s/) ?? [];
    if (type.includes("toc")) toc ??= parseNav2($nav);
    else if (type.includes("page-list")) pageList ??= parseNav2($nav);
    else if (type.includes("landmarks")) landmarks ??= parseNav2($nav, true);
    else others.push({
      label: getElementText($nav.firstElementChild),
      type,
      list: parseNav2($nav)
    });
  }
  return { toc, pageList, landmarks, others };
};
var parseNCX = (doc, resolve = (f) => f) => {
  const { $, $$ } = childGetter(doc, NS.NCX);
  const resolveHref = (href) => href ? decodeURI(resolve(href)) : null;
  const parseItem = (el) => {
    const $label = $(el, "navLabel");
    const $content = $(el, "content");
    const label2 = getElementText($label);
    const href = resolveHref($content.getAttribute("src"));
    if (el.localName === "navPoint") {
      const els = $$(el, "navPoint");
      return { label: label2, href, subitems: els.length ? els.map(parseItem) : null };
    }
    return { label: label2, href };
  };
  const parseList = (el, itemName) => $$(el, itemName).map(parseItem);
  const getSingle = (container, itemName) => {
    const $container = $(doc.documentElement, container);
    return $container ? parseList($container, itemName) : null;
  };
  return {
    toc: getSingle("navMap", "navPoint"),
    pageList: getSingle("pageList", "pageTarget"),
    others: $$(doc.documentElement, "navList").map((el) => ({
      label: getElementText($(el, "navLabel")),
      list: parseList(el, "navTarget")
    }))
  };
};
var parseClock = (str) => {
  if (!str) return;
  const parts = str.split(":").map((x2) => parseFloat(x2));
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 60 * 60 + m * 60 + s;
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  const [x, unit] = str.split(/(?=[^\d.])/);
  const n = parseFloat(x);
  const f = unit === "h" ? 60 * 60 : unit === "min" ? 60 : unit === "ms" ? 1e-3 : 1;
  return n * f;
};
var MediaOverlay = class extends EventTarget {
  #entries;
  #lastMediaOverlayItem;
  #sectionIndex;
  #audioIndex;
  #itemIndex;
  #audio;
  #volume = 1;
  #rate = 1;
  #state;
  constructor(book, loadXML) {
    super();
    this.book = book;
    this.loadXML = loadXML;
  }
  async #loadSMIL(item) {
    if (this.#lastMediaOverlayItem === item) return;
    const doc = await this.loadXML(item.href);
    const resolve = (href) => href ? resolveURL(href, item.href) : null;
    const { $, $$$ } = childGetter(doc, NS.SMIL);
    this.#audioIndex = -1;
    this.#itemIndex = -1;
    this.#entries = $$$(doc, "par").reduce((arr, $par) => {
      const text = resolve($($par, "text")?.getAttribute("src"));
      const $audio = $($par, "audio");
      if (!text || !$audio) return arr;
      const src = resolve($audio.getAttribute("src"));
      const begin = parseClock($audio.getAttribute("clipBegin"));
      const end = parseClock($audio.getAttribute("clipEnd"));
      const last = arr.at(-1);
      if (last?.src === src) last.items.push({ text, begin, end });
      else arr.push({ src, items: [{ text, begin, end }] });
      return arr;
    }, []);
    this.#lastMediaOverlayItem = item;
  }
  get #activeAudio() {
    return this.#entries[this.#audioIndex];
  }
  get #activeItem() {
    return this.#activeAudio?.items?.[this.#itemIndex];
  }
  #error(e) {
    console.error(e);
    this.dispatchEvent(new CustomEvent("error", { detail: e }));
  }
  #highlight() {
    this.dispatchEvent(new CustomEvent("highlight", { detail: this.#activeItem }));
  }
  #unhighlight() {
    this.dispatchEvent(new CustomEvent("unhighlight", { detail: this.#activeItem }));
  }
  async #play(audioIndex, itemIndex) {
    this.#stop();
    this.#audioIndex = audioIndex;
    this.#itemIndex = itemIndex;
    const src = this.#activeAudio?.src;
    if (!src || !this.#activeItem) return this.start(this.#sectionIndex + 1);
    const url = URL.createObjectURL(await this.book.loadBlob(src));
    const audio = new Audio(url);
    this.#audio = audio;
    audio.volume = this.#volume;
    audio.playbackRate = this.#rate;
    audio.addEventListener("timeupdate", () => {
      if (audio.paused) return;
      const t2 = audio.currentTime;
      const { items } = this.#activeAudio;
      if (t2 > this.#activeItem?.end) {
        this.#unhighlight();
        if (this.#itemIndex === items.length - 1) {
          this.#play(this.#audioIndex + 1, 0).catch((e) => this.#error(e));
          return;
        }
      }
      const oldIndex = this.#itemIndex;
      while (items[this.#itemIndex + 1]?.begin <= t2) this.#itemIndex++;
      if (this.#itemIndex !== oldIndex) this.#highlight();
    });
    audio.addEventListener("error", () => this.#error(new Error(`Failed to load ${src}`)));
    audio.addEventListener("playing", () => this.#highlight());
    audio.addEventListener("ended", () => {
      this.#unhighlight();
      URL.revokeObjectURL(url);
      this.#audio = null;
      this.#play(audioIndex + 1, 0).catch((e) => this.#error(e));
    });
    if (this.#state === "paused") {
      this.#highlight();
      audio.currentTime = this.#activeItem.begin ?? 0;
    } else audio.addEventListener("canplaythrough", () => {
      audio.currentTime = this.#activeItem.begin ?? 0;
      this.#state = "playing";
      audio.play().catch((e) => this.#error(e));
    }, { once: true });
  }
  async start(sectionIndex, filter3 = () => true) {
    this.#audio?.pause();
    const section = this.book.sections[sectionIndex];
    const href = section?.id;
    if (!href) return;
    const { mediaOverlay } = section;
    if (!mediaOverlay) return this.start(sectionIndex + 1);
    this.#sectionIndex = sectionIndex;
    await this.#loadSMIL(mediaOverlay);
    for (let i = 0; i < this.#entries.length; i++) {
      const { items } = this.#entries[i];
      for (let j = 0; j < items.length; j++) {
        if (items[j].text.split("#")[0] === href && filter3(items[j], j, items))
          return this.#play(i, j).catch((e) => this.#error(e));
      }
    }
  }
  pause() {
    this.#state = "paused";
    this.#audio?.pause();
  }
  resume() {
    this.#state = "playing";
    this.#audio?.play().catch((e) => this.#error(e));
  }
  #stop() {
    if (this.#audio) {
      this.#audio.pause();
      URL.revokeObjectURL(this.#audio.src);
      this.#audio = null;
      this.#unhighlight();
    }
  }
  stop() {
    this.#state = "stopped";
    this.#stop();
  }
  prev() {
    if (this.#itemIndex > 0) this.#play(this.#audioIndex, this.#itemIndex - 1);
    else if (this.#audioIndex > 0) this.#play(
      this.#audioIndex - 1,
      this.#entries[this.#audioIndex - 1].items.length - 1
    );
    else if (this.#sectionIndex > 0)
      this.start(this.#sectionIndex - 1, (_, i, items) => i === items.length - 1);
  }
  next() {
    this.#play(this.#audioIndex, this.#itemIndex + 1);
  }
  setVolume(volume) {
    this.#volume = volume;
    if (this.#audio) this.#audio.volume = volume;
  }
  setRate(rate) {
    this.#rate = rate;
    if (this.#audio) this.#audio.playbackRate = rate;
  }
};
var isUUID = /([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})/;
var getUUID = (opf) => {
  for (const el of opf.getElementsByTagNameNS(NS.DC, "identifier")) {
    const [id] = getElementText(el).split(":").slice(-1);
    if (isUUID.test(id)) return id;
  }
  return "";
};
var getIdentifier = (opf) => getElementText(
  opf.getElementById(opf.documentElement.getAttribute("unique-identifier")) ?? opf.getElementsByTagNameNS(NS.DC, "identifier")[0]
);
var deobfuscate = async (key, length, blob) => {
  const array = new Uint8Array(await blob.slice(0, length).arrayBuffer());
  length = Math.min(length, array.length);
  for (var i = 0; i < length; i++) array[i] = array[i] ^ key[i % key.length];
  return new Blob([array, blob.slice(length)], { type: blob.type });
};
var WebCryptoSHA1 = async (str) => {
  const data = new TextEncoder().encode(str);
  const buffer = await globalThis.crypto.subtle.digest("SHA-1", data);
  return new Uint8Array(buffer);
};
var deobfuscators = (sha1 = WebCryptoSHA1) => ({
  "http://www.idpf.org/2008/embedding": {
    key: (opf) => sha1(getIdentifier(opf).replaceAll(/[\u0020\u0009\u000d\u000a]/g, "")),
    decode: (key, blob) => deobfuscate(key, 1040, blob)
  },
  "http://ns.adobe.com/pdf/enc#RC": {
    key: (opf) => {
      const uuid = getUUID(opf).replaceAll("-", "");
      return Uint8Array.from({ length: 16 }, (_, i) => parseInt(uuid.slice(i * 2, i * 2 + 2), 16));
    },
    decode: (key, blob) => deobfuscate(key, 1024, blob)
  }
});
var Encryption = class {
  #uris = /* @__PURE__ */ new Map();
  #decoders = /* @__PURE__ */ new Map();
  #algorithms;
  constructor(algorithms) {
    this.#algorithms = algorithms;
  }
  async init(encryption, opf) {
    if (!encryption) return;
    const data = Array.from(
      encryption.getElementsByTagNameNS(NS.ENC, "EncryptedData"),
      (el) => ({
        algorithm: el.getElementsByTagNameNS(NS.ENC, "EncryptionMethod")[0]?.getAttribute("Algorithm"),
        uri: el.getElementsByTagNameNS(NS.ENC, "CipherReference")[0]?.getAttribute("URI")
      })
    );
    for (const { algorithm, uri } of data) {
      if (!this.#decoders.has(algorithm)) {
        const algo = this.#algorithms[algorithm];
        if (!algo) {
          console.warn("Unknown encryption algorithm");
          continue;
        }
        const key = await algo.key(opf);
        this.#decoders.set(algorithm, (blob) => algo.decode(key, blob));
      }
      this.#uris.set(uri, algorithm);
    }
  }
  getDecoder(uri) {
    return this.#decoders.get(this.#uris.get(uri)) ?? ((x) => x);
  }
};
var Resources = class {
  constructor({ opf, resolveHref }) {
    this.opf = opf;
    const { $, $$, $$$ } = childGetter(opf, NS.OPF);
    const $manifest = $(opf.documentElement, "manifest");
    const $spine = $(opf.documentElement, "spine");
    const $$itemref = $$($spine, "itemref");
    this.manifest = $$($manifest, "item").map(getAttributes("href", "id", "media-type", "properties", "media-overlay")).map((item) => {
      item.href = resolveHref(item.href);
      item.properties = item.properties?.split(/\s/);
      return item;
    });
    this.manifestById = new Map(this.manifest.map((item) => [item.id, item]));
    this.spine = $$itemref.map(getAttributes("idref", "id", "linear", "properties")).map((item) => (item.properties = item.properties?.split(/\s/), item));
    this.pageProgressionDirection = $spine.getAttribute("page-progression-direction");
    this.navPath = this.getItemByProperty("nav")?.href;
    this.ncxPath = (this.getItemByID($spine.getAttribute("toc")) ?? this.manifest.find((item) => item.mediaType === MIME.NCX))?.href;
    const $guide = $(opf.documentElement, "guide");
    if ($guide) this.guide = $$($guide, "reference").map(getAttributes("type", "title", "href")).map(({ type, title, href }) => ({
      label: title,
      type: type.split(/\s/),
      href: resolveHref(href)
    }));
    this.cover = this.getItemByProperty("cover-image") ?? this.getItemByID($$$(opf, "meta").find(filterAttribute("name", "cover"))?.getAttribute("content")) ?? this.getItemByHref(this.guide?.find((ref) => ref.type.includes("cover"))?.href);
    this.cfis = fromElements($$itemref);
  }
  getItemByID(id) {
    return this.manifestById.get(id);
  }
  getItemByHref(href) {
    return this.manifest.find((item) => item.href === href);
  }
  getItemByProperty(prop) {
    return this.manifest.find((item) => item.properties?.includes(prop));
  }
  resolveCFI(cfi) {
    const parts = parse(cfi);
    const top = (parts.parent ?? parts).shift();
    let $itemref = toElement(this.opf, top);
    if ($itemref && $itemref.nodeName !== "idref") {
      top.at(-1).id = null;
      $itemref = toElement(this.opf, top);
    }
    const idref = $itemref?.getAttribute("idref");
    const index = this.spine.findIndex((item) => item.idref === idref);
    const anchor = (doc) => toRange(doc, parts);
    return { index, anchor };
  }
};
var Loader = class {
  #cache = /* @__PURE__ */ new Map();
  #children = /* @__PURE__ */ new Map();
  #refCount = /* @__PURE__ */ new Map();
  eventTarget = new EventTarget();
  constructor({ loadText, loadBlob, resources }) {
    this.loadText = loadText;
    this.loadBlob = loadBlob;
    this.manifest = resources.manifest;
    this.assets = resources.manifest;
  }
  async createURL(href, data, type, parent) {
    if (!data) return "";
    const detail = { data, type };
    Object.defineProperty(detail, "name", { value: href });
    const event = new CustomEvent("data", { detail });
    this.eventTarget.dispatchEvent(event);
    const newData = await event.detail.data;
    const newType = await event.detail.type;
    const url = URL.createObjectURL(new Blob([newData], { type: newType }));
    this.#cache.set(href, url);
    this.#refCount.set(href, 1);
    if (parent) {
      const childList = this.#children.get(parent);
      if (childList) childList.push(href);
      else this.#children.set(parent, [href]);
    }
    return url;
  }
  ref(href, parent) {
    const childList = this.#children.get(parent);
    if (!childList?.includes(href)) {
      this.#refCount.set(href, this.#refCount.get(href) + 1);
      if (childList) childList.push(href);
      else this.#children.set(parent, [href]);
    }
    return this.#cache.get(href);
  }
  unref(href) {
    if (!this.#refCount.has(href)) return;
    const count = this.#refCount.get(href) - 1;
    if (count < 1) {
      URL.revokeObjectURL(this.#cache.get(href));
      this.#cache.delete(href);
      this.#refCount.delete(href);
      const childList = this.#children.get(href);
      if (childList) while (childList.length) this.unref(childList.pop());
      this.#children.delete(href);
    } else this.#refCount.set(href, count);
  }
  // load manifest item, recursively loading all resources as needed
  async loadItem(item, parents = []) {
    if (!item) return null;
    const { href, mediaType } = item;
    const isScript = MIME.JS.test(item.mediaType);
    const detail = { type: mediaType, isScript, allow: true };
    const event = new CustomEvent("load", { detail });
    this.eventTarget.dispatchEvent(event);
    const allow = await event.detail.allow;
    if (!allow) return null;
    const parent = parents.at(-1);
    if (this.#cache.has(href)) return this.ref(href, parent);
    const shouldReplace = (isScript || [MIME.XHTML, MIME.HTML, MIME.CSS, MIME.SVG].includes(mediaType)) && parents.every((p) => p !== href);
    if (shouldReplace) return this.loadReplaced(item, parents);
    const tryLoadBlob = Promise.resolve().then(() => this.loadBlob(href));
    return this.createURL(href, tryLoadBlob, mediaType, parent);
  }
  async loadHref(href, base, parents = []) {
    if (isExternal(href)) return href;
    const path = resolveURL(href, base);
    const item = this.manifest.find((item2) => item2.href === path);
    if (!item) return href;
    return this.loadItem(item, parents.concat(base));
  }
  async loadReplaced(item, parents = []) {
    const { href, mediaType } = item;
    const parent = parents.at(-1);
    let str = "";
    try {
      str = await this.loadText(href);
    } catch (e) {
      return this.createURL(href, Promise.reject(e), mediaType, parent);
    }
    if (!str) return null;
    if ([MIME.XHTML, MIME.HTML, MIME.SVG].includes(mediaType)) {
      let doc = new DOMParser().parseFromString(str, mediaType);
      if (mediaType === MIME.XHTML && (doc.querySelector("parsererror") || !doc.documentElement?.namespaceURI)) {
        console.warn(doc.querySelector("parsererror")?.innerText ?? "Invalid XHTML");
        item.mediaType = MIME.HTML;
        doc = new DOMParser().parseFromString(str, item.mediaType);
      }
      if ([MIME.XHTML, MIME.SVG].includes(item.mediaType)) {
        let child = doc.firstChild;
        while (child instanceof ProcessingInstruction) {
          if (child.data) {
            const replacedData = await replaceSeries(
              child.data,
              /(?:^|\s*)(href\s*=\s*['"])([^'"]*)(['"])/i,
              (_, p1, p2, p3) => this.loadHref(p2, href, parents).then((p22) => `${p1}${p22}${p3}`)
            );
            child.replaceWith(doc.createProcessingInstruction(
              child.target,
              replacedData
            ));
          }
          child = child.nextSibling;
        }
      }
      const replace = async (el, attr) => el.setAttribute(
        attr,
        await this.loadHref(el.getAttribute(attr), href, parents)
      );
      for (const el of doc.querySelectorAll("link[href]")) await replace(el, "href");
      for (const el of doc.querySelectorAll("[src]")) await replace(el, "src");
      for (const el of doc.querySelectorAll("[poster]")) await replace(el, "poster");
      for (const el of doc.querySelectorAll("object[data]")) await replace(el, "data");
      for (const el of doc.querySelectorAll("[*|href]:not([href])"))
        el.setAttributeNS(NS.XLINK, "href", await this.loadHref(
          el.getAttributeNS(NS.XLINK, "href"),
          href,
          parents
        ));
      for (const el of doc.querySelectorAll("[srcset]"))
        el.setAttribute("srcset", await replaceSeries(
          el.getAttribute("srcset"),
          /(\s*)(.+?)\s*((?:\s[\d.]+[wx])+\s*(?:,|$)|,\s+|$)/g,
          (_, p1, p2, p3) => this.loadHref(p2, href, parents).then((p22) => `${p1}${p22}${p3}`)
        ));
      for (const el of doc.querySelectorAll("style"))
        if (el.textContent) el.textContent = await this.replaceCSS(el.textContent, href, parents);
      for (const el of doc.querySelectorAll("[style]"))
        el.setAttribute(
          "style",
          await this.replaceCSS(el.getAttribute("style"), href, parents)
        );
      const result2 = new XMLSerializer().serializeToString(doc);
      return this.createURL(href, result2, item.mediaType, parent);
    }
    const result = mediaType === MIME.CSS ? await this.replaceCSS(str, href, parents) : await this.replaceString(str, href, parents);
    return this.createURL(href, result, mediaType, parent);
  }
  async replaceCSS(str, href, parents = []) {
    const replacedUrls = await replaceSeries(
      str,
      /url\(\s*["']?([^'"\n]*?)\s*["']?\s*\)/gi,
      (_, url) => this.loadHref(url, href, parents).then((url2) => `url("${url2}")`)
    );
    return replaceSeries(
      replacedUrls,
      /@import\s*["']([^"'\n]*?)["']/gi,
      (_, url) => this.loadHref(url, href, parents).then((url2) => `@import "${url2}"`)
    );
  }
  // find & replace all possible relative paths for all assets without parsing
  replaceString(str, href, parents = []) {
    const assetMap = /* @__PURE__ */ new Map();
    const urls = this.assets.map((asset) => {
      if (asset.href === href) return;
      const relative = pathRelative(pathDirname(href), asset.href);
      const relativeEnc = encodeURI(relative);
      const rootRelative = "/" + asset.href;
      const rootRelativeEnc = encodeURI(rootRelative);
      const set = /* @__PURE__ */ new Set([relative, relativeEnc, rootRelative, rootRelativeEnc]);
      for (const url of set) assetMap.set(url, asset);
      return Array.from(set);
    }).flat().filter((x) => x);
    if (!urls.length) return str;
    const regex = new RegExp(urls.map(regexEscape).join("|"), "g");
    return replaceSeries(str, regex, async (match) => this.loadItem(
      assetMap.get(match.replace(/^\//, "")),
      parents.concat(href)
    ));
  }
  unloadItem(item) {
    this.unref(item?.href);
  }
  destroy() {
    for (const url of this.#cache.values()) URL.revokeObjectURL(url);
  }
};
var getHTMLFragment = (doc, id) => doc.getElementById(id) ?? doc.querySelector(`[name="${CSS.escape(id)}"]`);
var getPageSpread = (properties) => {
  for (const p of properties) {
    if (p === "page-spread-left" || p === "rendition:page-spread-left")
      return "left";
    if (p === "page-spread-right" || p === "rendition:page-spread-right")
      return "right";
    if (p === "rendition:page-spread-center") return "center";
  }
};
var getDisplayOptions = (doc) => {
  if (!doc) return null;
  return {
    fixedLayout: getElementText(doc.querySelector('option[name="fixed-layout"]')),
    openToSpread: getElementText(doc.querySelector('option[name="open-to-spread"]'))
  };
};
var EPUB = class {
  parser = new DOMParser();
  #loader;
  #encryption;
  constructor({ loadText, loadBlob, getSize, sha1 }) {
    this.loadText = loadText;
    this.loadBlob = loadBlob;
    this.getSize = getSize;
    this.#encryption = new Encryption(deobfuscators(sha1));
  }
  async #loadXML(uri) {
    const str = await this.loadText(uri);
    if (!str) return null;
    const doc = this.parser.parseFromString(str, MIME.XML);
    if (doc.querySelector("parsererror"))
      throw new Error(`XML parsing error: ${uri}
${doc.querySelector("parsererror").innerText}`);
    return doc;
  }
  async init() {
    const $container = await this.#loadXML("META-INF/container.xml");
    if (!$container) throw new Error("Failed to load container file");
    const opfs = Array.from(
      $container.getElementsByTagNameNS(NS.CONTAINER, "rootfile"),
      getAttributes("full-path", "media-type")
    ).filter((file) => file.mediaType === "application/oebps-package+xml");
    if (!opfs.length) throw new Error("No package document defined in container");
    const opfPath = opfs[0].fullPath;
    const opf = await this.#loadXML(opfPath);
    if (!opf) throw new Error("Failed to load package document");
    const $encryption = await this.#loadXML("META-INF/encryption.xml");
    await this.#encryption.init($encryption, opf);
    this.resources = new Resources({
      opf,
      resolveHref: (url) => resolveURL(url, opfPath)
    });
    this.#loader = new Loader({
      loadText: this.loadText,
      loadBlob: (uri) => Promise.resolve(this.loadBlob(uri)).then(this.#encryption.getDecoder(uri)),
      resources: this.resources
    });
    this.transformTarget = this.#loader.eventTarget;
    this.sections = this.resources.spine.map((spineItem, index) => {
      const { idref, linear, properties = [] } = spineItem;
      const item = this.resources.getItemByID(idref);
      if (!item) {
        console.warn(`Could not find item with ID "${idref}" in manifest`);
        return null;
      }
      return {
        id: item.href,
        load: () => this.#loader.loadItem(item),
        unload: () => this.#loader.unloadItem(item),
        createDocument: () => this.loadDocument(item),
        size: this.getSize(item.href),
        cfi: this.resources.cfis[index],
        linear,
        pageSpread: getPageSpread(properties),
        resolveHref: (href) => resolveURL(href, item.href),
        mediaOverlay: item.mediaOverlay ? this.resources.getItemByID(item.mediaOverlay) : null
      };
    }).filter((s) => s);
    const { navPath, ncxPath } = this.resources;
    if (navPath) try {
      const resolve = (url) => resolveURL(url, navPath);
      const nav = parseNav(await this.#loadXML(navPath), resolve);
      this.toc = nav.toc;
      this.pageList = nav.pageList;
      this.landmarks = nav.landmarks;
    } catch (e) {
      console.warn(e);
    }
    if (!this.toc && ncxPath) try {
      const resolve = (url) => resolveURL(url, ncxPath);
      const ncx = parseNCX(await this.#loadXML(ncxPath), resolve);
      this.toc = ncx.toc;
      this.pageList = ncx.pageList;
    } catch (e) {
      console.warn(e);
    }
    this.landmarks ??= this.resources.guide;
    const { metadata, rendition, media } = getMetadata(opf);
    this.metadata = metadata;
    this.rendition = rendition;
    this.media = media;
    this.dir = this.resources.pageProgressionDirection;
    const displayOptions = getDisplayOptions(
      await this.#loadXML("META-INF/com.apple.ibooks.display-options.xml") ?? await this.#loadXML("META-INF/com.kobobooks.display-options.xml")
    );
    if (displayOptions) {
      if (displayOptions.fixedLayout === "true")
        this.rendition.layout ??= "pre-paginated";
      if (displayOptions.openToSpread === "false") this.sections.find((section) => section.linear !== "no").pageSpread ??= this.dir === "rtl" ? "left" : "right";
    }
    return this;
  }
  async loadDocument(item) {
    const str = await this.loadText(item.href);
    return this.parser.parseFromString(str, item.mediaType);
  }
  getMediaOverlay() {
    return new MediaOverlay(this, this.#loadXML.bind(this));
  }
  resolveCFI(cfi) {
    return this.resources.resolveCFI(cfi);
  }
  resolveHref(href) {
    const [path, hash2] = href.split("#");
    const item = this.resources.getItemByHref(decodeURI(path));
    if (!item) return null;
    const index = this.resources.spine.findIndex(({ idref }) => idref === item.id);
    const anchor = hash2 ? (doc) => getHTMLFragment(doc, hash2) : () => 0;
    return { index, anchor };
  }
  splitTOCHref(href) {
    return href?.split("#") ?? [];
  }
  getTOCFragment(doc, id) {
    return doc.getElementById(id) ?? doc.querySelector(`[name="${CSS.escape(id)}"]`);
  }
  isExternal(uri) {
    return isExternal(uri);
  }
  async getCover() {
    const cover = this.resources?.cover;
    return cover?.href ? new Blob([await this.loadBlob(cover.href)], { type: cover.mediaType }) : null;
  }
  async getCalibreBookmarks() {
    const txt = await this.loadText("META-INF/calibre_bookmarks.txt");
    const magic = "encoding=json+base64:";
    if (txt?.startsWith(magic)) {
      const json = atob(txt.slice(magic.length));
      return JSON.parse(json);
    }
  }
  destroy() {
    this.#loader?.destroy();
  }
};

// vendor/foliate-js/progress.js
var assignIDs = (toc) => {
  let id = 0;
  const assignID = (item) => {
    item.id = id++;
    if (item.subitems) for (const subitem of item.subitems) assignID(subitem);
  };
  for (const item of toc) assignID(item);
  return toc;
};
var flatten = (items) => items.map((item) => item.subitems?.length ? [item, flatten(item.subitems)].flat() : item).flat();
var TOCProgress = class {
  async init({ toc, ids, splitHref, getFragment }) {
    assignIDs(toc);
    const items = flatten(toc);
    const grouped = /* @__PURE__ */ new Map();
    for (const [i, item] of items.entries()) {
      const [id, fragment] = await splitHref(item?.href) ?? [];
      const value = { fragment, item };
      if (grouped.has(id)) grouped.get(id).items.push(value);
      else grouped.set(id, { prev: items[i - 1], items: [value] });
    }
    const map = /* @__PURE__ */ new Map();
    for (const [i, id] of ids.entries()) {
      if (grouped.has(id)) map.set(id, grouped.get(id));
      else map.set(id, map.get(ids[i - 1]));
    }
    this.ids = ids;
    this.map = map;
    this.getFragment = getFragment;
  }
  getProgress(index, range) {
    if (!this.ids) return;
    const id = this.ids[index];
    const obj = this.map.get(id);
    if (!obj) return null;
    const { prev, items } = obj;
    if (!items) return prev;
    if (!range || items.length === 1 && !items[0].fragment) return items[0].item;
    const doc = range.startContainer.getRootNode();
    for (const [i, { fragment }] of items.entries()) {
      const el = this.getFragment(doc, fragment);
      if (!el) continue;
      if (range.comparePoint(el, 0) > 0)
        return items[i - 1]?.item ?? prev;
    }
    return items[items.length - 1].item;
  }
};
var SectionProgress = class {
  constructor(sections, sizePerLoc, sizePerTimeUnit) {
    this.sizes = sections.map((s) => s.linear != "no" && s.size > 0 ? s.size : 0);
    this.sizePerLoc = sizePerLoc;
    this.sizePerTimeUnit = sizePerTimeUnit;
    this.sizeTotal = this.sizes.reduce((a, b) => a + b, 0);
    this.sectionFractions = this.#getSectionFractions();
  }
  #getSectionFractions() {
    const { sizeTotal } = this;
    const results = [0];
    let sum = 0;
    for (const size of this.sizes) results.push((sum += size) / sizeTotal);
    return results;
  }
  // get progress given index of and fractions within a section
  getProgress(index, fractionInSection, pageFraction = 0) {
    const { sizes, sizePerLoc, sizePerTimeUnit, sizeTotal } = this;
    const sizeInSection = sizes[index] ?? 0;
    const sizeBefore = sizes.slice(0, index).reduce((a, b) => a + b, 0);
    const size = sizeBefore + fractionInSection * sizeInSection;
    const nextSize = size + pageFraction * sizeInSection;
    const remainingTotal = sizeTotal - size;
    const remainingSection = (1 - fractionInSection) * sizeInSection;
    return {
      fraction: nextSize / sizeTotal,
      section: {
        current: index,
        total: sizes.length
      },
      location: {
        current: Math.floor(size / sizePerLoc),
        next: Math.floor(nextSize / sizePerLoc),
        total: Math.ceil(sizeTotal / sizePerLoc)
      },
      time: {
        section: remainingSection / sizePerTimeUnit,
        total: remainingTotal / sizePerTimeUnit
      }
    };
  }
  // the inverse of `getProgress`
  // get index of and fraction in section based on total fraction
  getSection(fraction) {
    if (fraction <= 0) return [0, 0];
    if (fraction >= 1) return [this.sizes.length - 1, 1];
    fraction = fraction + Number.EPSILON;
    const { sizeTotal } = this;
    let index = this.sectionFractions.findIndex((x) => x > fraction) - 1;
    if (index < 0) return [0, 0];
    while (!this.sizes[index]) index++;
    const fractionInSection = (fraction - this.sectionFractions[index]) / (this.sizes[index] / sizeTotal);
    return [index, fractionInSection];
  }
};

// vendor/foliate-js/overlayer.js
var createSVGElement = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);
var Overlayer = class {
  #svg = createSVGElement("svg");
  #map = /* @__PURE__ */ new Map();
  constructor() {
    Object.assign(this.#svg.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none"
    });
  }
  get element() {
    return this.#svg;
  }
  add(key, range, draw, options) {
    if (this.#map.has(key)) this.remove(key);
    if (typeof range === "function") range = range(this.#svg.getRootNode());
    const rects = range.getClientRects();
    const element = draw(rects, options);
    this.#svg.append(element);
    this.#map.set(key, { range, draw, options, element, rects });
  }
  remove(key) {
    if (!this.#map.has(key)) return;
    this.#svg.removeChild(this.#map.get(key).element);
    this.#map.delete(key);
  }
  redraw() {
    for (const obj of this.#map.values()) {
      const { range, draw, options, element } = obj;
      this.#svg.removeChild(element);
      const rects = range.getClientRects();
      const el = draw(rects, options);
      this.#svg.append(el);
      obj.element = el;
      obj.rects = rects;
    }
  }
  hitTest({ x, y }) {
    const arr = Array.from(this.#map.entries());
    for (let i = arr.length - 1; i >= 0; i--) {
      const [key, obj] = arr[i];
      for (const { left, top, right, bottom } of obj.rects)
        if (top <= y && left <= x && bottom > y && right > x)
          return [key, obj.range];
    }
    return [];
  }
  static underline(rects, options = {}) {
    const { color = "red", width: strokeWidth = 2, writingMode } = options;
    const g2 = createSVGElement("g");
    g2.setAttribute("fill", color);
    if (writingMode === "vertical-rl" || writingMode === "vertical-lr")
      for (const { right, top, height } of rects) {
        const el = createSVGElement("rect");
        el.setAttribute("x", right - strokeWidth);
        el.setAttribute("y", top);
        el.setAttribute("height", height);
        el.setAttribute("width", strokeWidth);
        g2.append(el);
      }
    else for (const { left, bottom, width } of rects) {
      const el = createSVGElement("rect");
      el.setAttribute("x", left);
      el.setAttribute("y", bottom - strokeWidth);
      el.setAttribute("height", strokeWidth);
      el.setAttribute("width", width);
      g2.append(el);
    }
    return g2;
  }
  static strikethrough(rects, options = {}) {
    const { color = "red", width: strokeWidth = 2, writingMode } = options;
    const g2 = createSVGElement("g");
    g2.setAttribute("fill", color);
    if (writingMode === "vertical-rl" || writingMode === "vertical-lr")
      for (const { right, left, top, height } of rects) {
        const el = createSVGElement("rect");
        el.setAttribute("x", (right + left) / 2);
        el.setAttribute("y", top);
        el.setAttribute("height", height);
        el.setAttribute("width", strokeWidth);
        g2.append(el);
      }
    else for (const { left, top, bottom, width } of rects) {
      const el = createSVGElement("rect");
      el.setAttribute("x", left);
      el.setAttribute("y", (top + bottom) / 2);
      el.setAttribute("height", strokeWidth);
      el.setAttribute("width", width);
      g2.append(el);
    }
    return g2;
  }
  static squiggly(rects, options = {}) {
    const { color = "red", width: strokeWidth = 2, writingMode } = options;
    const g2 = createSVGElement("g");
    g2.setAttribute("fill", "none");
    g2.setAttribute("stroke", color);
    g2.setAttribute("stroke-width", strokeWidth);
    const block = strokeWidth * 1.5;
    if (writingMode === "vertical-rl" || writingMode === "vertical-lr")
      for (const { right, top, height } of rects) {
        const el = createSVGElement("path");
        const n = Math.round(height / block / 1.5);
        const inline = height / n;
        const ls = Array.from(
          { length: n },
          (_, i) => `l${i % 2 ? -block : block} ${inline}`
        ).join("");
        el.setAttribute("d", `M${right} ${top}${ls}`);
        g2.append(el);
      }
    else for (const { left, bottom, width } of rects) {
      const el = createSVGElement("path");
      const n = Math.round(width / block / 1.5);
      const inline = width / n;
      const ls = Array.from(
        { length: n },
        (_, i) => `l${inline} ${i % 2 ? block : -block}`
      ).join("");
      el.setAttribute("d", `M${left} ${bottom}${ls}`);
      g2.append(el);
    }
    return g2;
  }
  static highlight(rects, options = {}) {
    const { color = "red" } = options;
    const g2 = createSVGElement("g");
    g2.setAttribute("fill", color);
    g2.style.opacity = "var(--overlayer-highlight-opacity, .3)";
    g2.style.mixBlendMode = "var(--overlayer-highlight-blend-mode, normal)";
    for (const { left, top, height, width } of rects) {
      const el = createSVGElement("rect");
      el.setAttribute("x", left);
      el.setAttribute("y", top);
      el.setAttribute("height", height);
      el.setAttribute("width", width);
      g2.append(el);
    }
    return g2;
  }
  static outline(rects, options = {}) {
    const { color = "red", width: strokeWidth = 3, radius = 3 } = options;
    const g2 = createSVGElement("g");
    g2.setAttribute("fill", "none");
    g2.setAttribute("stroke", color);
    g2.setAttribute("stroke-width", strokeWidth);
    for (const { left, top, height, width } of rects) {
      const el = createSVGElement("rect");
      el.setAttribute("x", left);
      el.setAttribute("y", top);
      el.setAttribute("height", height);
      el.setAttribute("width", width);
      el.setAttribute("rx", radius);
      g2.append(el);
    }
    return g2;
  }
  // make an exact copy of an image in the overlay
  // one can then apply filters to the entire element, without affecting them;
  // it's a bit silly and probably better to just invert images twice
  // (though the color will be off in that case if you do heu-rotate)
  static copyImage([rect], options = {}) {
    const { src } = options;
    const image = createSVGElement("image");
    const { left, top, height, width } = rect;
    image.setAttribute("href", src);
    image.setAttribute("x", left);
    image.setAttribute("y", top);
    image.setAttribute("height", height);
    image.setAttribute("width", width);
    return image;
  }
};

// vendor/foliate-js/text-walker.js
var walkRange = (range, walker) => {
  const nodes = [];
  for (let node = walker.currentNode; node; node = walker.nextNode()) {
    const compare2 = range.comparePoint(node, 0);
    if (compare2 === 0) nodes.push(node);
    else if (compare2 > 0) break;
  }
  return nodes;
};
var walkDocument = (_, walker) => {
  const nodes = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    nodes.push(node);
  return nodes;
};
var filter = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_CDATA_SECTION;
var acceptNode = (node) => {
  if (node.nodeType === 1) {
    const name = node.tagName.toLowerCase();
    if (name === "script" || name === "style") return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_SKIP;
  }
  return NodeFilter.FILTER_ACCEPT;
};
var textWalker = function* (x, func, filterFunc) {
  const root = x.commonAncestorContainer ?? x.body ?? x;
  const walker = document.createTreeWalker(root, filter, { acceptNode: filterFunc || acceptNode });
  const walk = x.commonAncestorContainer ? walkRange : walkDocument;
  const nodes = walk(x, walker);
  const strs = nodes.map((node) => node.nodeValue ?? "");
  const makeRange2 = (startIndex, startOffset, endIndex, endOffset) => {
    const range = document.createRange();
    range.setStart(nodes[startIndex], startOffset);
    range.setEnd(nodes[endIndex], endOffset);
    return range;
  };
  for (const match of func(strs, makeRange2)) yield match;
};

// vendor/foliate-js/view.js
var SEARCH_PREFIX = "foliate-search:";
var CursorAutohider = class _CursorAutohider {
  #timeout;
  #el;
  #check;
  #state;
  constructor(el, check, state = {}) {
    this.#el = el;
    this.#check = check;
    this.#state = state;
    if (this.#state.hidden) this.hide();
    this.#el.addEventListener("mousemove", ({ screenX, screenY }) => {
      if (screenX === this.#state.x && screenY === this.#state.y) return;
      this.#state.x = screenX, this.#state.y = screenY;
      this.show();
      if (this.#timeout) clearTimeout(this.#timeout);
      if (check()) this.#timeout = setTimeout(this.hide.bind(this), 1e3);
    }, false);
  }
  cloneFor(el) {
    return new _CursorAutohider(el, this.#check, this.#state);
  }
  hide() {
    this.#el.style.cursor = "none";
    this.#state.hidden = true;
  }
  show() {
    this.#el.style.removeProperty("cursor");
    this.#state.hidden = false;
  }
};
var History = class extends EventTarget {
  #arr = [];
  #index = -1;
  pushState(x) {
    const last = this.#arr[this.#index];
    if (last === x || last?.fraction && last.fraction === x.fraction) return;
    this.#arr[++this.#index] = x;
    this.#arr.length = this.#index + 1;
    this.dispatchEvent(new Event("index-change"));
  }
  replaceState(x) {
    const index = this.#index;
    this.#arr[index] = x;
  }
  back() {
    const index = this.#index;
    if (index <= 0) return;
    const detail = { state: this.#arr[index - 1] };
    this.#index = index - 1;
    this.dispatchEvent(new CustomEvent("popstate", { detail }));
    this.dispatchEvent(new Event("index-change"));
  }
  forward() {
    const index = this.#index;
    if (index >= this.#arr.length - 1) return;
    const detail = { state: this.#arr[index + 1] };
    this.#index = index + 1;
    this.dispatchEvent(new CustomEvent("popstate", { detail }));
    this.dispatchEvent(new Event("index-change"));
  }
  get canGoBack() {
    return this.#index > 0;
  }
  get canGoForward() {
    return this.#index < this.#arr.length - 1;
  }
  clear() {
    this.#arr = [];
    this.#index = -1;
  }
};
var languageInfo = (lang) => {
  if (!lang) return {};
  try {
    const canonical = Intl.getCanonicalLocales(lang)[0];
    const locale = new Intl.Locale(canonical);
    const isCJK = ["zh", "ja", "kr"].includes(locale.language);
    const direction = (locale.getTextInfo?.() ?? locale.textInfo)?.direction;
    return { canonical, locale, isCJK, direction };
  } catch (e) {
    console.warn(e);
    return {};
  }
};
var View2 = class extends HTMLElement {
  #root = this.attachShadow({ mode: "closed" });
  #sectionProgress;
  #tocProgress;
  #pageProgress;
  #searchResults = /* @__PURE__ */ new Map();
  #searchDraw;
  #searchDrawOptions;
  #cursorAutohider = new CursorAutohider(this, () => this.hasAttribute("autohide-cursor"));
  isFixedLayout = false;
  lastLocation;
  history = new History();
  constructor() {
    super();
    this.history.addEventListener("popstate", ({ detail }) => {
      const resolved = this.resolveNavigation(detail.state);
      this.renderer.goTo(resolved);
    });
  }
  async open(book) {
    if (typeof book === "string" || typeof book.arrayBuffer === "function" || book.isDirectory) throw new TypeError(
      "Expected a book object; use makeBook() to open files or URLs"
    );
    this.book = book;
    this.language = languageInfo(book.metadata?.language);
    if (book.splitTOCHref && book.getTOCFragment) {
      const ids = book.sections.map((s) => s.id);
      this.#sectionProgress = new SectionProgress(book.sections, 1500, 1600);
      const splitHref = book.splitTOCHref.bind(book);
      const getFragment = book.getTOCFragment.bind(book);
      this.#tocProgress = new TOCProgress();
      await this.#tocProgress.init({
        toc: book.toc ?? [],
        ids,
        splitHref,
        getFragment
      });
      this.#pageProgress = new TOCProgress();
      await this.#pageProgress.init({
        toc: book.pageList ?? [],
        ids,
        splitHref,
        getFragment
      });
    }
    this.isFixedLayout = this.book.rendition?.layout === "pre-paginated";
    if (this.isFixedLayout) {
      await Promise.resolve().then(() => (init_fixed_layout(), fixed_layout_exports));
      this.renderer = document.createElement("foliate-fxl");
    } else {
      await Promise.resolve().then(() => (init_paginator(), paginator_exports));
      this.renderer = document.createElement("foliate-paginator");
    }
    this.renderer.setAttribute("exportparts", "head,foot,filter");
    if (this.hasAttribute("sandbox"))
      this.renderer.setAttribute("sandbox", this.getAttribute("sandbox"));
    this.renderer.addEventListener("load", (e) => this.#onLoad(e.detail));
    this.renderer.addEventListener("relocate", (e) => this.#onRelocate(e.detail));
    this.renderer.addEventListener("create-overlayer", (e) => e.detail.attach(this.#createOverlayer(e.detail)));
    this.renderer.open(book);
    this.#root.append(this.renderer);
    if (book.sections.some((section) => section.mediaOverlay)) {
      const activeClass = book.media.activeClass;
      const playbackActiveClass = book.media.playbackActiveClass;
      this.mediaOverlay = book.getMediaOverlay();
      let lastActive;
      this.mediaOverlay.addEventListener("highlight", (e) => {
        const resolved = this.resolveNavigation(e.detail.text);
        this.renderer.goTo(resolved).then(() => {
          const { doc } = this.renderer.getContents().find((x) => x.index = resolved.index);
          const el = resolved.anchor(doc);
          el.classList.add(activeClass);
          if (playbackActiveClass) el.ownerDocument.documentElement.classList.add(playbackActiveClass);
          lastActive = new WeakRef(el);
        });
      });
      this.mediaOverlay.addEventListener("unhighlight", () => {
        const el = lastActive?.deref();
        if (el) {
          el.classList.remove(activeClass);
          if (playbackActiveClass) el.ownerDocument.documentElement.classList.remove(playbackActiveClass);
        }
      });
    }
  }
  close() {
    this.renderer?.destroy();
    this.renderer?.remove();
    this.#sectionProgress = null;
    this.#tocProgress = null;
    this.#pageProgress = null;
    this.#searchResults = /* @__PURE__ */ new Map();
    this.lastLocation = null;
    this.history.clear();
    this.tts = null;
    this.mediaOverlay = null;
  }
  goToTextStart() {
    return this.goTo(this.book.landmarks?.find((m) => m.type.includes("bodymatter") || m.type.includes("text"))?.href ?? this.book.sections.findIndex((s) => s.linear !== "no"));
  }
  async init({ lastLocation, showTextStart }) {
    const resolved = lastLocation ? this.resolveNavigation(lastLocation) : null;
    if (resolved) {
      await this.renderer.goTo(resolved);
      this.history.pushState(lastLocation);
    } else if (showTextStart) await this.goToTextStart();
    else {
      this.history.pushState(0);
      await this.next();
    }
  }
  #emit(name, detail, cancelable) {
    return this.dispatchEvent(new CustomEvent(name, { detail, cancelable }));
  }
  #onRelocate({ reason, range, index, fraction, size }) {
    const progress = this.#sectionProgress?.getProgress(index, fraction, size) ?? {};
    const tocItem = this.#tocProgress?.getProgress(index, range);
    const pageItem = this.#pageProgress?.getProgress(index, range);
    const cfi = this.getCFI(index, range);
    this.lastLocation = { ...progress, tocItem, pageItem, cfi, range };
    if (reason === "snap" || reason === "page" || reason === "scroll")
      this.history.replaceState(cfi);
    this.#emit("relocate", this.lastLocation);
  }
  #onLoad({ doc, index }) {
    doc.documentElement.lang ||= this.language.canonical ?? "";
    if (!this.language.isCJK)
      doc.documentElement.dir ||= this.language.direction ?? "";
    this.#handleLinks(doc, index);
    this.#cursorAutohider.cloneFor(doc.documentElement);
    this.#emit("load", { doc, index });
  }
  #handleLinks(doc, index) {
    const { book } = this;
    const section = book.sections[index];
    doc.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      e.preventDefault();
      const href_ = a.getAttribute("href");
      const href = section?.resolveHref?.(href_) ?? href_;
      if (book?.isExternal?.(href))
        Promise.resolve(this.#emit("external-link", { a, href_ }, true)).then((x) => x ? globalThis.open(href_, "_blank") : null).catch((e2) => console.error(e2));
      else Promise.resolve(this.#emit("link", { a, href }, true)).then((x) => x ? this.goTo(href) : null).catch((e2) => console.error(e2));
    });
  }
  async addAnnotation(annotation, remove) {
    const { value } = annotation;
    if (value.startsWith(SEARCH_PREFIX)) {
      const cfi = value.replace(SEARCH_PREFIX, "");
      const { index: index2, anchor: anchor2 } = await this.resolveNavigation(cfi);
      const obj2 = this.#getOverlayer(index2);
      if (obj2) {
        const { overlayer, doc } = obj2;
        if (remove) {
          overlayer.remove(value);
          return;
        }
        const range = doc ? anchor2(doc) : anchor2;
        overlayer.add(value, range, this.#searchDraw, this.#searchDrawOptions);
      }
      return;
    }
    const { index, anchor } = await this.resolveNavigation(value);
    const obj = this.#getOverlayer(index);
    if (obj) {
      const { overlayer, doc } = obj;
      overlayer.remove(value);
      if (!remove) {
        const range = doc ? anchor(doc) : anchor;
        const draw = (func, opts) => overlayer.add(value, range, func, opts);
        this.#emit("draw-annotation", { draw, annotation, doc, range });
      }
    }
    const label2 = this.#tocProgress.getProgress(index)?.label ?? "";
    return { index, label: label2 };
  }
  deleteAnnotation(annotation) {
    return this.addAnnotation(annotation, true);
  }
  #getOverlayer(index) {
    return this.renderer.getContents().find((x) => x.index === index && x.overlayer);
  }
  #createOverlayer({ doc, index }) {
    const overlayer = new Overlayer();
    doc.addEventListener("click", (e) => {
      const [value, range] = overlayer.hitTest(e);
      if (value && !value.startsWith(SEARCH_PREFIX)) {
        this.#emit("show-annotation", { value, index, range });
      }
    }, false);
    const list = this.#searchResults.get(index);
    if (list) for (const item of list) this.addAnnotation(item);
    this.#emit("create-overlay", { index });
    return overlayer;
  }
  async showAnnotation(annotation) {
    const { value } = annotation;
    const resolved = await this.goTo(value);
    if (resolved) {
      const { index, anchor } = resolved;
      const { doc } = this.#getOverlayer(index);
      const range = anchor(doc);
      this.#emit("show-annotation", { value, index, range });
    }
  }
  getCFI(index, range) {
    const baseCFI = this.book.sections[index].cfi ?? fake.fromIndex(index);
    if (!range) return baseCFI;
    return joinIndir(baseCFI, fromRange(range));
  }
  resolveCFI(cfi) {
    if (this.book.resolveCFI)
      return this.book.resolveCFI(cfi);
    else {
      const parts = parse(cfi);
      const index = fake.toIndex((parts.parent ?? parts).shift());
      const anchor = (doc) => toRange(doc, parts);
      return { index, anchor };
    }
  }
  resolveNavigation(target) {
    try {
      if (typeof target === "number") return { index: target };
      if (typeof target.fraction === "number") {
        const [index, anchor] = this.#sectionProgress.getSection(target.fraction);
        return { index, anchor };
      }
      if (isCFI.test(target)) return this.resolveCFI(target);
      return this.book.resolveHref(target);
    } catch (e) {
      console.error(e);
      console.error(`Could not resolve target ${target}`);
    }
  }
  async goTo(target) {
    const resolved = this.resolveNavigation(target);
    try {
      await this.renderer.goTo(resolved);
      this.history.pushState(target);
      return resolved;
    } catch (e) {
      console.error(e);
      console.error(`Could not go to ${target}`);
    }
  }
  async goToFraction(frac) {
    const [index, anchor] = this.#sectionProgress.getSection(frac);
    await this.renderer.goTo({ index, anchor });
    this.history.pushState({ fraction: frac });
  }
  async select(target) {
    try {
      const obj = await this.resolveNavigation(target);
      await this.renderer.goTo({ ...obj, select: true });
      this.history.pushState(target);
    } catch (e) {
      console.error(e);
      console.error(`Could not go to ${target}`);
    }
  }
  deselect() {
    for (const { doc } of this.renderer.getContents())
      doc.defaultView.getSelection().removeAllRanges();
  }
  getSectionFractions() {
    return (this.#sectionProgress?.sectionFractions ?? []).map((x) => x + Number.EPSILON);
  }
  getProgressOf(index, range) {
    const tocItem = this.#tocProgress?.getProgress(index, range);
    const pageItem = this.#pageProgress?.getProgress(index, range);
    return { tocItem, pageItem };
  }
  async getTOCItemOf(target) {
    try {
      const { index, anchor } = await this.resolveNavigation(target);
      const doc = await this.book.sections[index].createDocument();
      const frag = anchor(doc);
      const isRange = frag instanceof Range;
      const range = isRange ? frag : doc.createRange();
      if (!isRange) range.selectNodeContents(frag);
      return this.#tocProgress.getProgress(index, range);
    } catch (e) {
      console.error(e);
      console.error(`Could not get ${target}`);
    }
  }
  async prev(distance) {
    await this.renderer.prev(distance);
  }
  async next(distance) {
    await this.renderer.next(distance);
  }
  goLeft() {
    return this.book.dir === "rtl" ? this.next() : this.prev();
  }
  goRight() {
    return this.book.dir === "rtl" ? this.prev() : this.next();
  }
  async *#searchSection(matcher, query, index) {
    const doc = await this.book.sections[index].createDocument();
    for (const { range, excerpt } of matcher(doc, query))
      yield { cfi: this.getCFI(index, range), excerpt };
  }
  async *#searchBook(matcher, query) {
    const { sections } = this.book;
    for (const [index, { createDocument }] of sections.entries()) {
      if (!createDocument) continue;
      const doc = await createDocument();
      const subitems = Array.from(matcher(doc, query), ({ range, excerpt }) => ({ cfi: this.getCFI(index, range), excerpt }));
      const progress = (index + 1) / sections.length;
      yield { progress };
      if (subitems.length) yield { index, subitems };
    }
  }
  async *search(opts) {
    this.clearSearch();
    this.#searchDraw = opts.draw ?? Overlayer.outline;
    this.#searchDrawOptions = opts.drawOptions;
    const { searchMatcher: searchMatcher2 } = await Promise.resolve().then(() => (init_search(), search_exports));
    const { query, index } = opts;
    const matcher = searchMatcher2(
      textWalker,
      { defaultLocale: this.language, ...opts }
    );
    const iter = index != null ? this.#searchSection(matcher, query, index) : this.#searchBook(matcher, query);
    const list = [];
    this.#searchResults.set(index, list);
    for await (const result of iter) {
      if (result.subitems) {
        const list2 = result.subitems.map(({ cfi }) => ({ value: SEARCH_PREFIX + cfi }));
        this.#searchResults.set(result.index, list2);
        for (const item of list2) this.addAnnotation(item);
        yield {
          label: this.#tocProgress.getProgress(result.index)?.label ?? "",
          subitems: result.subitems
        };
      } else {
        if (result.cfi) {
          const item = { value: SEARCH_PREFIX + result.cfi };
          list.push(item);
          this.addAnnotation(item);
        }
        yield result;
      }
    }
    yield "done";
  }
  clearSearch() {
    for (const list of this.#searchResults.values())
      for (const item of list) this.deleteAnnotation(item);
    this.#searchResults.clear();
  }
  async initTTS(granularity = "word", highlight) {
    const doc = this.renderer.getContents()[0].doc;
    if (this.tts && this.tts.doc === doc) return;
    const { TTS: TTS2 } = await Promise.resolve().then(() => (init_tts(), tts_exports));
    this.tts = new TTS2(doc, textWalker, highlight || ((range) => this.renderer.scrollToAnchor(range, true)), granularity);
  }
  startMediaOverlay() {
    const { index } = this.renderer.getContents()[0];
    return this.mediaOverlay.start(index);
  }
};
if (!customElements.get("foliate-view")) customElements.define("foliate-view", View2);

// src/backends/epub/section-transform.ts
var SECTION_HTML_TYPES = /* @__PURE__ */ new Set(["application/xhtml+xml", "text/html"]);
function transformSectionHtml(source, mediaType, mutate) {
  const doc = new DOMParser().parseFromString(source, mediaType);
  if (!mutate(doc)) return source;
  if (mediaType === "text/html") {
    return `<!DOCTYPE html>${doc.documentElement?.outerHTML ?? source}`;
  }
  return new XMLSerializer().serializeToString(doc);
}

// src/backends/epub/epub-security.ts
var CSP = "script-src 'none'";
function injectCsp(source, mediaType) {
  return transformSectionHtml(source, mediaType, (doc) => {
    const head = doc.querySelector("head");
    if (!head) return false;
    const meta = doc.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Security-Policy");
    meta.setAttribute("content", CSP);
    head.insertBefore(meta, head.firstChild);
    return true;
  });
}
function hardenBook(book) {
  const target = book.transformTarget;
  if (!target) return;
  target.addEventListener("load", (event) => {
    const detail = event.detail;
    if (detail?.isScript) detail.allow = false;
  });
  target.addEventListener("data", (event) => {
    const detail = event.detail;
    if (!detail?.type || !SECTION_HTML_TYPES.has(detail.type)) return;
    const mediaType = detail.type;
    detail.data = Promise.resolve(detail.data).then(
      (data) => typeof data === "string" ? injectCsp(data, mediaType) : data
    );
  });
}

// src/backends/epub/epub-style-inline.ts
var XHTML_NS = "http://www.w3.org/1999/xhtml";
var PARKED_REL = "maki-stylesheet";
var BLOCKED_LINKS = 'link[rel~="stylesheet" i][href^="blob:"]:not([rel~="alternate" i])';
var IMPORT_PATTERN = /@import\s+(?:url\(\s*)?["']?(blob:[^"')\s]+)["']?\s*\)?\s*;/gi;
var MAX_IMPORT_DEPTH = 4;
function parkStylesheetLinks(doc) {
  const links = Array.from(doc.querySelectorAll(BLOCKED_LINKS));
  for (const link of links) link.setAttribute("rel", PARKED_REL);
  return links.length > 0;
}
function parkSectionStylesheets(book) {
  const target = book.transformTarget;
  if (!target) return;
  target.addEventListener("data", (event) => {
    const detail = event.detail;
    if (!detail?.type || !SECTION_HTML_TYPES.has(detail.type)) return;
    const mediaType = detail.type;
    detail.data = Promise.resolve(detail.data).then((data) => {
      if (typeof data !== "string") return data;
      return transformSectionHtml(data, mediaType, parkStylesheetLinks);
    });
  });
}
var SectionStyleInliner = class {
  /** Sections share sheets via foliate's loader cache; fetch each once. */
  cache = /* @__PURE__ */ new Map();
  /** Mirror every parked/blocked stylesheet link of a loaded section. */
  async apply(doc) {
    const links = Array.from(
      doc.querySelectorAll(`link[rel="${PARKED_REL}"], ${BLOCKED_LINKS}`)
    );
    await Promise.all(
      links.map(async (link) => {
        try {
          const css = await this.load(link.href, MAX_IMPORT_DEPTH);
          const style = doc.createElementNS(XHTML_NS, "style");
          const media = link.getAttribute("media");
          if (media) style.setAttribute("media", media);
          style.textContent = css;
          const head = doc.querySelector("head");
          if (head?.contains(link)) link.replaceWith(style);
          else head?.append(style);
        } catch (error) {
          console.debug("Maki[epub]: could not inline stylesheet", link.href, error);
        }
      })
    );
  }
  load(url, depth) {
    let pending = this.cache.get(url);
    if (!pending) {
      pending = fetch(url).then((response) => response.text());
      this.cache.set(url, pending);
    }
    return pending.then((css) => inlineCssImports(css, (u, d) => this.load(u, d), depth));
  }
};
async function inlineCssImports(css, load, depth) {
  if (depth <= 0) return css;
  const matches = [...css.matchAll(IMPORT_PATTERN)];
  if (matches.length === 0) return css;
  let result = "";
  let last = 0;
  for (const match of matches) {
    const [statement, url] = match;
    result += css.slice(last, match.index);
    last = match.index + statement.length;
    try {
      result += await load(url, depth - 1);
    } catch {
      result += statement;
    }
  }
  return result + css.slice(last);
}

// src/backends/epub/cfi-order.ts
function isInvertedRangeCfi(cfi) {
  try {
    return compare(collapse(cfi), collapse(cfi, true)) > 0;
  } catch {
    return true;
  }
}

// src/backends/snap-range.ts
function snapToTextEndpoints(range) {
  const startsInText = range.startContainer.nodeType === Node.TEXT_NODE;
  const endsInText = range.endContainer.nodeType === Node.TEXT_NODE;
  if (startsInText && endsInText) return range;
  const doc = range.commonAncestorContainer.ownerDocument;
  if (!doc) return null;
  const walker = doc.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
  let first = null;
  let last = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node;
    if (text.length === 0 || !range.intersectsNode(text)) continue;
    first ??= text;
    last = text;
  }
  if (!first || !last) return null;
  const snapped = range.cloneRange();
  if (!startsInText) snapped.setStart(first, 0);
  if (!endsInText) snapped.setEnd(last, last.length);
  return snapped.collapsed ? null : snapped;
}

// src/backends/epub/epub-viewer-adapter.ts
var HIGHLIGHT_OPACITY = 0.5;
var FLASH_VALUE_COLOR = "rgba(255, 208, 0, 0.5)";
var FLASH_MS = 1200;
var EpubViewerAdapter = class {
  constructor(ref, view) {
    this.ref = ref;
    this.view = view;
    const { signal } = this.aborter;
    this.view.addEventListener(
      "create-overlay",
      () => {
        for (const h of this.highlights.values()) void this.addToOverlay(h);
      },
      { signal }
    );
    this.view.addEventListener(
      "draw-annotation",
      (event) => {
        const { draw, annotation } = event.detail;
        draw(Overlayer.highlight, { color: annotation.color });
      },
      { signal }
    );
    this.view.addEventListener(
      "show-annotation",
      (event) => {
        const { value } = event.detail;
        const id = this.idByValue.get(value);
        if (id) for (const cb of this.activateCbs) cb(id);
      },
      { signal }
    );
    const onPointerUp = () => {
      for (const cb of this.dragCbs) cb(false);
    };
    const hostDoc = this.view.ownerDocument;
    hostDoc.addEventListener("pointerup", onPointerUp, { signal });
    hostDoc.addEventListener("pointercancel", onPointerUp, { signal });
    this.view.addEventListener(
      "load",
      (event) => {
        const { doc } = event.detail;
        doc.addEventListener("selectionchange", () => {
          const sel = this.liveSelection();
          this.remembered = sel;
          for (const cb of this.selectionCbs) cb(sel);
        });
        doc.addEventListener("pointerdown", () => {
          for (const cb of this.dragCbs) cb(true);
        });
        doc.addEventListener("pointerup", onPointerUp);
        doc.addEventListener("pointercancel", onPointerUp);
      },
      { signal }
    );
  }
  backend = "epub";
  highlights = /* @__PURE__ */ new Map();
  /** foliate addresses annotations by CFI value; map both directions. */
  idByValue = /* @__PURE__ */ new Map();
  activateCbs = /* @__PURE__ */ new Set();
  selectionCbs = /* @__PURE__ */ new Set();
  dragCbs = /* @__PURE__ */ new Set();
  aborter = new AbortController();
  /**
   * The last live selection. Section selections vanish without a
   * `selectionchange` (page turn unloads the section document); a collapse
   * *inside* a section does fire one and clears this — user intent.
   */
  remembered = null;
  // ---- navigation
  async reveal(target, opts) {
    if (target.backend !== "epub") return "not-found";
    const value = wrapCfi(target.cfi);
    try {
      const resolved = await this.view.goTo(value);
      if (resolved) {
        if (opts?.flash !== false) this.flash(value);
        return "exact";
      }
    } catch {
    }
    const index = spineSectionIndex(target.cfi);
    if (index !== null && index < this.view.book.sections.length) {
      try {
        if (await this.view.goTo(index)) return "fallback";
      } catch {
      }
    }
    return "not-found";
  }
  /** Transient emphasis after reveal, unless the passage is already drawn. */
  flash(value) {
    if (this.idByValue.has(value)) return;
    void this.view.addAnnotation({ value, color: FLASH_VALUE_COLOR }).then(() => {
      window.setTimeout(() => {
        if (!this.idByValue.has(value)) void this.view.deleteAnnotation({ value });
      }, FLASH_MS);
    });
  }
  // ---- selection
  captureSelection() {
    return this.liveSelection() ?? this.remembered;
  }
  liveSelection() {
    for (const { doc, index } of this.view.renderer?.getContents() ?? []) {
      const sel = doc.defaultView?.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) continue;
      const range = sel.getRangeAt(0);
      const text = sel.toString();
      if (text === "") continue;
      const snapped = snapToTextEndpoints(range);
      if (!snapped) {
        console.debug("Maki[epub]: selection rejected \u2014 no text to snap to");
        continue;
      }
      try {
        const cfi = this.view.getCFI(index, snapped);
        if (!cfi || isInvertedRangeCfi(cfi)) {
          console.debug("Maki[epub]: selection rejected \u2014", cfi ? `inverted CFI ${cfi}` : "empty CFI");
          continue;
        }
        return {
          locator: { backend: "epub", cfi: unwrapCfi(cfi) },
          text
        };
      } catch (error) {
        console.warn("Maki: EPUB selection \u2192 CFI failed", error);
        continue;
      }
    }
    return null;
  }
  onSelectionChange(cb) {
    this.selectionCbs.add(cb);
    return { dispose: () => this.selectionCbs.delete(cb) };
  }
  onSelectionDrag(cb) {
    this.dragCbs.add(cb);
    return { dispose: () => this.dragCbs.delete(cb) };
  }
  // ---- highlights
  drawHighlight(h) {
    if (h.locator.backend !== "epub") return;
    const value = wrapCfi(h.locator.cfi);
    if (isInvertedRangeCfi(value)) {
      console.warn(
        "Maki: EPUB highlight skipped \u2014 inverted range CFI; re-create the annotation",
        h.locator.cfi
      );
      return;
    }
    const previous = this.highlights.get(h.id);
    if (previous && previous.locator.backend === "epub" && previous.locator.cfi !== h.locator.cfi) {
      this.eraseHighlight(h.id);
    }
    this.highlights.set(h.id, h);
    this.idByValue.set(value, h.id);
    void this.addToOverlay(h);
  }
  eraseHighlight(id) {
    const h = this.highlights.get(id);
    this.highlights.delete(id);
    if (!h || h.locator.backend !== "epub") return;
    const value = wrapCfi(h.locator.cfi);
    this.idByValue.delete(value);
    void this.view.deleteAnnotation({ value }).catch(() => void 0);
  }
  clearHighlights() {
    for (const id of [...this.highlights.keys()]) this.eraseHighlight(id);
  }
  onHighlightActivate(cb) {
    this.activateCbs.add(cb);
    return { dispose: () => this.activateCbs.delete(cb) };
  }
  /** Best-effort: a CFI that no longer resolves draws nothing. */
  async addToOverlay(h) {
    if (h.locator.backend !== "epub") return;
    try {
      await this.view.addAnnotation({
        value: wrapCfi(h.locator.cfi),
        color: `rgba(${h.color.rgb.join(",")}, ${HIGHLIGHT_OPACITY})`
      });
    } catch (error) {
      console.warn("Maki: EPUB highlight did not resolve", h.locator.cfi, error);
    }
  }
  // ---- metadata / lifecycle
  metadata() {
    const meta = {};
    const title = this.view.book?.metadata?.title;
    if (typeof title === "string" && title !== "") meta.title = title;
    const location = this.view.lastLocation;
    const chapter = location?.tocItem?.label;
    if (typeof chapter === "string" && chapter !== "") meta.chapter = chapter.trim();
    if (typeof location?.fraction === "number") meta.progress = location.fraction;
    return meta;
  }
  destroy() {
    this.clearHighlights();
    this.aborter.abort();
    this.activateCbs.clear();
    this.selectionCbs.clear();
    this.dragCbs.clear();
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/constants.js
var MAX_32_BITS = 4294967295;
var MAX_16_BITS = 65535;
var MAX_8_BITS = 255;
var COMPRESSION_METHOD_DEFLATE = 8;
var COMPRESSION_METHOD_DEFLATE_64 = 9;
var COMPRESSION_METHOD_STORE = 0;
var COMPRESSION_METHOD_AES = 99;
var LOCAL_FILE_HEADER_SIGNATURE = 67324752;
var SPLIT_ZIP_FILE_SIGNATURE = 134695760;
var DATA_DESCRIPTOR_RECORD_SIGNATURE = SPLIT_ZIP_FILE_SIGNATURE;
var CENTRAL_FILE_HEADER_SIGNATURE = 33639248;
var END_OF_CENTRAL_DIR_SIGNATURE = 101010256;
var ZIP64_END_OF_CENTRAL_DIR_SIGNATURE = 101075792;
var ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE = 117853008;
var END_OF_CENTRAL_DIR_LENGTH = 22;
var ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH = 20;
var ZIP64_END_OF_CENTRAL_DIR_LENGTH = 56;
var ZIP64_END_OF_CENTRAL_DIR_TOTAL_LENGTH = END_OF_CENTRAL_DIR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH + ZIP64_END_OF_CENTRAL_DIR_LENGTH;
var DATA_DESCRIPTOR_RECORD_LENGTH = 12;
var DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH = 20;
var DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH = 4;
var EXTRAFIELD_TYPE_ZIP64 = 1;
var EXTRAFIELD_TYPE_AES = 39169;
var EXTRAFIELD_TYPE_NTFS = 10;
var EXTRAFIELD_TYPE_NTFS_TAG1 = 1;
var EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 21589;
var EXTRAFIELD_TYPE_UNICODE_PATH = 28789;
var EXTRAFIELD_TYPE_UNICODE_COMMENT = 25461;
var EXTRAFIELD_TYPE_USDZ = 6534;
var EXTRAFIELD_TYPE_INFOZIP = 30837;
var EXTRAFIELD_TYPE_UNIX = 30805;
var BITFLAG_ENCRYPTED = 1;
var BITFLAG_LEVEL = 6;
var BITFLAG_DATA_DESCRIPTOR = 8;
var BITFLAG_LANG_ENCODING_FLAG = 2048;
var FILE_ATTR_MSDOS_DIR_MASK = 16;
var FILE_ATTR_MSDOS_READONLY_MASK = 1;
var FILE_ATTR_MSDOS_HIDDEN_MASK = 2;
var FILE_ATTR_MSDOS_SYSTEM_MASK = 4;
var FILE_ATTR_MSDOS_ARCHIVE_MASK = 32;
var FILE_ATTR_UNIX_TYPE_MASK = 61440;
var FILE_ATTR_UNIX_TYPE_DIR = 16384;
var FILE_ATTR_UNIX_EXECUTABLE_MASK = 73;
var FILE_ATTR_UNIX_DEFAULT_MASK = 420;
var FILE_ATTR_UNIX_SETUID_MASK = 2048;
var FILE_ATTR_UNIX_SETGID_MASK = 1024;
var FILE_ATTR_UNIX_STICKY_MASK = 512;
var DIRECTORY_SIGNATURE = "/";
var HEADER_SIZE = 30;
var HEADER_OFFSET_SIGNATURE = 10;
var HEADER_OFFSET_COMPRESSED_SIZE = 14;
var HEADER_OFFSET_UNCOMPRESSED_SIZE = 18;
var MAX_DATE = new Date(2107, 11, 31);
var MIN_DATE = new Date(1980, 0, 1);
var UNDEFINED_VALUE = void 0;
var INFINITY_VALUE = Infinity;
var UNDEFINED_TYPE = "undefined";
var FUNCTION_TYPE = "function";

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/configuration.js
var MINIMUM_CHUNK_SIZE = 64;
var maxWorkers = 2;
try {
  if (typeof navigator != UNDEFINED_TYPE && navigator.hardwareConcurrency) {
    maxWorkers = navigator.hardwareConcurrency;
  }
} catch {
}
var DEFAULT_CONFIGURATION = {
  workerURI: "./core/web-worker-wasm.js",
  wasmURI: "./core/streams/zlib-wasm/zlib-streams.wasm",
  chunkSize: 64 * 1024,
  maxWorkers,
  terminateWorkerTimeout: 5e3,
  useWebWorkers: true,
  useCompressionStream: true,
  CompressionStream: typeof CompressionStream != UNDEFINED_TYPE && CompressionStream,
  DecompressionStream: typeof DecompressionStream != UNDEFINED_TYPE && DecompressionStream
};
var config = Object.assign({}, DEFAULT_CONFIGURATION);
function getConfiguration() {
  return config;
}
function getChunkSize(config2) {
  return Math.max(config2.chunkSize, MINIMUM_CHUNK_SIZE);
}
function configure(configuration) {
  const {
    baseURI,
    chunkSize,
    maxWorkers: maxWorkers2,
    terminateWorkerTimeout,
    useCompressionStream,
    useWebWorkers,
    CompressionStream: CompressionStream2,
    DecompressionStream: DecompressionStream2,
    CompressionStreamZlib: CompressionStreamZlib2,
    DecompressionStreamZlib: DecompressionStreamZlib2,
    workerURI,
    wasmURI
  } = configuration;
  setIfDefined("baseURI", baseURI);
  setIfDefined("wasmURI", wasmURI);
  setIfDefined("workerURI", workerURI);
  setIfDefined("chunkSize", chunkSize);
  setIfDefined("maxWorkers", maxWorkers2);
  setIfDefined("terminateWorkerTimeout", terminateWorkerTimeout);
  setIfDefined("useCompressionStream", useCompressionStream);
  setIfDefined("useWebWorkers", useWebWorkers);
  setIfDefined("CompressionStream", CompressionStream2);
  setIfDefined("DecompressionStream", DecompressionStream2);
  setIfDefined("CompressionStreamZlib", CompressionStreamZlib2);
  setIfDefined("DecompressionStreamZlib", DecompressionStreamZlib2);
}
function setIfDefined(propertyName, propertyValue) {
  if (propertyValue !== UNDEFINED_VALUE) {
    config[propertyName] = propertyValue;
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/web-worker-inline-wasm.js
function t(t2) {
  const e = '(t=>{"function"==typeof define&&define.amd?define(t):t()})(function(){"use strict";const{Array:t,Object:e,Number:n,Math:s,Error:r,Uint8Array:o,Uint16Array:i,Uint32Array:c,Int32Array:a,Map:h,DataView:f,Promise:l,TextEncoder:u,crypto:w,postMessage:p,TransformStream:d,ReadableStream:y,WritableStream:m,CompressionStream:g,DecompressionStream:S}=self,b=void 0,v="undefined",k="function",z=[];for(let t=0;256>t;t++){let e=t;for(let t=0;8>t;t++)1&e?e=e>>>1^3988292384:e>>>=1;z[t]=e}class C{constructor(t){this.t=t||-1}append(t){let e=0|this.t;for(let n=0,s=0|t.length;s>n;n++)e=e>>>8^z[255&(e^t[n])];this.t=e}get(){return~this.t}}class A extends d{constructor(){let t;const e=new C;super({transform(t,n){e.append(t),n.enqueue(t)},flush(){const n=new o(4);new f(n.buffer).setUint32(0,e.get()),t.value=n}}),t=this}}const x={concat(t,e){if(0===t.length||0===e.length)return t.concat(e);const n=t[t.length-1],s=x.o(n);return 32===s?t.concat(e):x.i(e,s,0|n,t.slice(0,t.length-1))},h(t){const e=t.length;if(0===e)return 0;const n=t[e-1];return 32*(e-1)+x.o(n)},l(t,e){if(32*t.length<e)return t;const n=(t=t.slice(0,s.ceil(e/32))).length;return e&=31,n>0&&e&&(t[n-1]=x.u(e,t[n-1]&2147483648>>e-1,1)),t},u:(t,e,n)=>32===t?e:(n?0|e:e<<32-t)+1099511627776*t,o:t=>s.round(t/1099511627776)||32,i(t,e,n,s){for(void 0===s&&(s=[]);e>=32;e-=32)s.push(n),n=0;if(0===e)return s.concat(t);for(let r=0;r<t.length;r++)s.push(n|t[r]>>>e),n=t[r]<<32-e;const r=t.length?t[t.length-1]:0,o=x.o(r);return s.push(x.u(e+o&31,e+o>32?n:s.pop(),1)),s}},I={bytes:{p(t){const e=x.h(t)/8,n=new o(e);let s;for(let r=0;e>r;r++)3&r||(s=t[r/4]),n[r]=s>>>24,s<<=8;return n},m(t){const e=[];let n,s=0;for(n=0;n<t.length;n++)s=s<<8|t[n],3&~n||(e.push(s),s=0);return 3&n&&e.push(x.u(8*(3&n),s)),e}}},R=class{constructor(t){const e=this;e.blockSize=512,e.S=[1732584193,4023233417,2562383102,271733878,3285377520],e.v=[1518500249,1859775393,2400959708,3395469782],t?(e.k=t.k.slice(0),e.C=t.C.slice(0),e.A=t.A):e.reset()}reset(){const t=this;return t.k=t.S.slice(0),t.C=[],t.A=0,t}update(t){const e=this;"string"==typeof t&&(t=I.I.m(t));const n=e.C=x.concat(e.C,t),s=e.A,o=e.A=s+x.h(t);if(o>9007199254740991)throw new r("Cannot hash more than 2^53 - 1 bits");const i=new c(n);let a=0;for(let t=e.blockSize+s-(e.blockSize+s&e.blockSize-1);o>=t;t+=e.blockSize)e.R(i.subarray(16*a,16*(a+1))),a+=1;return n.splice(0,16*a),e}P(){const t=this;let e=t.C;const n=t.k;e=x.concat(e,[x.u(1,1)]);for(let t=e.length+2;15&t;t++)e.push(0);for(e.push(s.floor(t.A/4294967296)),e.push(0|t.A);e.length;)t.R(e.splice(0,16));return t.reset(),n}U(t,e,n,s){return t>19?t>39?t>59?t>79?void 0:e^n^s:e&n|e&s|n&s:e^n^s:e&n|~e&s}V(t,e){return e<<t|e>>>32-t}R(e){const n=this,r=n.k,o=t(80);for(let t=0;16>t;t++)o[t]=e[t];let i=r[0],c=r[1],a=r[2],h=r[3],f=r[4];for(let t=0;79>=t;t++){16>t||(o[t]=n.V(1,o[t-3]^o[t-8]^o[t-14]^o[t-16]));const e=n.V(5,i)+n.U(t,c,a,h)+f+o[t]+n.v[s.floor(t/20)]|0;f=h,h=a,a=n.V(30,c),c=i,i=e}r[0]=r[0]+i|0,r[1]=r[1]+c|0,r[2]=r[2]+a|0,r[3]=r[3]+h|0,r[4]=r[4]+f|0}},P={getRandomValues(t){const e=new c(t.buffer),n=t=>{let e=987654321;const n=4294967295;return()=>(e=36969*(65535&e)+(e>>16)&n,(((e<<16)+(t=18e3*(65535&t)+(t>>16)&n)&n)/4294967296+.5)*(s.random()>.5?1:-1))};for(let r,o=0;o<t.length;o+=4){const t=n(4294967296*(r||s.random()));r=987654071*t(),e[o/4]=4294967296*t()|0}return t}},U={importKey:t=>new U.M(I.bytes.m(t)),_(t,e,n,s){if(n=n||1e4,0>s||0>n)throw new r("invalid params to pbkdf2");const o=1+(s>>5)<<2;let i,c,a,h,l;const u=new ArrayBuffer(o),w=new f(u);let p=0;const d=x;for(e=I.bytes.m(e),l=1;(o||1)>p;l++){for(i=c=t.encrypt(d.concat(e,[l])),a=1;n>a;a++)for(c=t.encrypt(c),h=0;h<c.length;h++)i[h]^=c[h];for(a=0;(o||1)>p&&a<i.length;a++)w.setInt32(p,i[a]),p+=4}return u.slice(0,s/8)},M:class{constructor(t){const e=this,n=e.B=R,s=[[],[]];e.D=[new n,new n];const r=e.D[0].blockSize/32;t.length>r&&(t=(new n).update(t).P());for(let e=0;r>e;e++)s[0][e]=909522486^t[e],s[1][e]=1549556828^t[e];e.D[0].update(s[0]),e.D[1].update(s[1]),e.W=new n(e.D[0])}reset(){const t=this;t.W=new t.B(t.D[0]),t.K=!1}update(t){this.K=!0,this.W.update(t)}digest(){const t=this,e=t.W.P(),n=new t.B(t.D[1]).update(e).P();return t.reset(),n}encrypt(t){if(this.K)throw new r("encrypt on already updated hmac called!");return this.update(t),this.digest(t)}}},V=typeof w!=v&&typeof w.getRandomValues==k,M="Invalid password",_="Invalid signature",B="zipjs-abort-check-password";function D(t){return V?w.getRandomValues(t):P.getRandomValues(t)}const W=16,K={name:"PBKDF2"},E=e.assign({hash:{name:"HMAC"}},K),L=e.assign({iterations:1e3,hash:{name:"SHA-1"}},K),O=["deriveBits"],T=[8,12,16],j=[16,24,32],H=10,Z=[0,0,0,0],F=typeof w!=v,N=F&&w.subtle,q=F&&typeof N!=v,G=I.bytes,J=class{constructor(t){const e=this;e.L=[[[],[],[],[],[]],[[],[],[],[],[]]],e.L[0][0][0]||e.O();const n=e.L[0][4],s=e.L[1],o=t.length;let i,c,a,h=1;if(4!==o&&6!==o&&8!==o)throw new r("invalid aes key size");for(e.v=[c=t.slice(0),a=[]],i=o;4*o+28>i;i++){let t=c[i-1];(i%o===0||8===o&&i%o===4)&&(t=n[t>>>24]<<24^n[t>>16&255]<<16^n[t>>8&255]<<8^n[255&t],i%o===0&&(t=t<<8^t>>>24^h<<24,h=h<<1^283*(h>>7))),c[i]=c[i-o]^t}for(let t=0;i;t++,i--){const e=c[3&t?i:i-4];a[t]=4>=i||4>t?e:s[0][n[e>>>24]]^s[1][n[e>>16&255]]^s[2][n[e>>8&255]]^s[3][n[255&e]]}}encrypt(t){return this.T(t,0)}decrypt(t){return this.T(t,1)}O(){const t=this.L[0],e=this.L[1],n=t[4],s=e[4],r=[],o=[];let i,c,a,h;for(let t=0;256>t;t++)o[(r[t]=t<<1^283*(t>>7))^t]=t;for(let f=i=0;!n[f];f^=c||1,i=o[i]||1){let o=i^i<<1^i<<2^i<<3^i<<4;o=o>>8^255&o^99,n[f]=o,s[o]=f,h=r[a=r[c=r[f]]];let l=16843009*h^65537*a^257*c^16843008*f,u=257*r[o]^16843008*o;for(let n=0;4>n;n++)t[n][f]=u=u<<24^u>>>8,e[n][o]=l=l<<24^l>>>8}for(let n=0;5>n;n++)t[n]=t[n].slice(0),e[n]=e[n].slice(0)}T(t,e){if(4!==t.length)throw new r("invalid aes block size");const n=this.v[e],s=n.length/4-2,o=[0,0,0,0],i=this.L[e],c=i[0],a=i[1],h=i[2],f=i[3],l=i[4];let u,w,p,d=t[0]^n[0],y=t[e?3:1]^n[1],m=t[2]^n[2],g=t[e?1:3]^n[3],S=4;for(let t=0;s>t;t++)u=c[d>>>24]^a[y>>16&255]^h[m>>8&255]^f[255&g]^n[S],w=c[y>>>24]^a[m>>16&255]^h[g>>8&255]^f[255&d]^n[S+1],p=c[m>>>24]^a[g>>16&255]^h[d>>8&255]^f[255&y]^n[S+2],g=c[g>>>24]^a[d>>16&255]^h[y>>8&255]^f[255&m]^n[S+3],S+=4,d=u,y=w,m=p;for(let t=0;4>t;t++)o[e?3&-t:t]=l[d>>>24]<<24^l[y>>16&255]<<16^l[m>>8&255]<<8^l[255&g]^n[S++],u=d,d=y,y=m,m=g,g=u;return o}},Q=class{constructor(t,e){this.j=t,this.H=e,this.Z=e}reset(){this.Z=this.H}update(t){return this.F(this.j,t,this.Z)}N(t){if(255&~(t>>24))t+=1<<24;else{let e=t>>16&255,n=t>>8&255,s=255&t;255===e?(e=0,255===n?(n=0,255===s?s=0:++s):++n):++e,t=0,t+=e<<16,t+=n<<8,t+=s}return t}q(t){0===(t[0]=this.N(t[0]))&&(t[1]=this.N(t[1]))}F(t,e,n){let s;if(!(s=e.length))return[];const r=x.h(e);for(let r=0;s>r;r+=4){this.q(n);const s=t.encrypt(n);e[r]^=s[0],e[r+1]^=s[1],e[r+2]^=s[2],e[r+3]^=s[3]}return x.l(e,r)}},X=U.M;let Y=F&&q&&typeof N.importKey==k,$=F&&q&&typeof N.deriveBits==k;class tt extends d{constructor({password:t,rawPassword:n,signed:s,encryptionStrength:i,checkPasswordOnly:c}){super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),signed:s,J:i-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:i,G:a,ready:h}=n;s?(await(async(t,e,n,s)=>{const o=await st(t,e,n,it(s,0,T[e])),i=it(s,T[e]);if(o[0]!=i[0]||o[1]!=i[1])throw new r(M)})(n,i,s,it(t,0,T[i]+2)),t=it(t,T[i]+2),c?e.error(new r(B)):a()):await h;const f=new o(t.length-H-(t.length-H)%W);e.enqueue(nt(n,t,f,0,H,!0))},async flush(t){const{signed:e,X:n,Y:s,pending:i,ready:c}=this;if(s&&n){await c;const a=it(i,0,i.length-H),h=it(i,i.length-H);let f=new o;if(a.length){const t=at(G,a);s.update(t);const e=n.update(t);f=ct(G,e)}if(e){const t=it(ct(G,s.digest()),0,H);for(let e=0;H>e;e++)if(t[e]!=h[e])throw new r(_)}t.enqueue(f)}}})}}class et extends d{constructor({password:t,rawPassword:n,encryptionStrength:s}){let r;super({start(){e.assign(this,{ready:new l(t=>this.G=t),password:rt(t,n),J:s-1,pending:new o})},async transform(t,e){const n=this,{password:s,J:r,G:i,ready:c}=n;let a=new o;s?(a=await(async(t,e,n)=>{const s=D(new o(T[e]));return ot(s,await st(t,e,n,s))})(n,r,s),i()):await c;const h=new o(a.length+t.length-t.length%W);h.set(a,0),e.enqueue(nt(n,t,h,a.length,0))},async flush(t){const{X:e,Y:n,pending:s,ready:i}=this;if(n&&e){await i;let c=new o;if(s.length){const t=e.update(at(G,s));n.update(t),c=ct(G,t)}r.signature=ct(G,n.digest()).slice(0,H),t.enqueue(ot(c,r.signature))}}}),r=this}}function nt(t,e,n,s,r,i){const{X:c,Y:a,pending:h}=t,f=e.length-r;let l;for(h.length&&(e=ot(h,e),n=((t,e)=>{if(e&&e>t.length){const n=t;(t=new o(e)).set(n,0)}return t})(n,f-f%W)),l=0;f-W>=l;l+=W){const t=at(G,it(e,l,l+W));i&&a.update(t);const r=c.update(t);i||a.update(r),n.set(ct(G,r),l+s)}return t.pending=it(e,l),n}async function st(n,s,r,i){n.password=null;const c=await(async(t,e,n,s,r)=>{if(!Y)return U.importKey(e);try{return await N.importKey("raw",e,n,!1,r)}catch{return Y=!1,U.importKey(e)}})(0,r,E,0,O),a=await(async(t,e,n)=>{if(!$)return U._(e,t.salt,L.iterations,n);try{return await N.deriveBits(t,e,n)}catch{return $=!1,U._(e,t.salt,L.iterations,n)}})(e.assign({salt:i},L),c,8*(2*j[s]+2)),h=new o(a),f=at(G,it(h,0,j[s])),l=at(G,it(h,j[s],2*j[s])),u=it(h,2*j[s]);return e.assign(n,{keys:{key:f,$:l,passwordVerification:u},X:new Q(new J(f),t.from(Z)),Y:new X(l)}),u}function rt(t,e){return e===b?(t=>{if(typeof u==v){const e=new o((t=unescape(encodeURIComponent(t))).length);for(let n=0;n<e.length;n++)e[n]=t.charCodeAt(n);return e}return(new u).encode(t)})(t):e}function ot(t,e){let n=t;return t.length+e.length&&(n=new o(t.length+e.length),n.set(t,0),n.set(e,t.length)),n}function it(t,e,n){return t.subarray(e,n)}function ct(t,e){return t.p(e)}function at(t,e){return t.m(e)}class ht extends d{constructor({password:t,passwordVerification:n,checkPasswordOnly:s}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;if(n.password){const e=lt(n,t.subarray(0,12));if(n.password=null,e.at(-1)!=n.passwordVerification)throw new r(M);t=t.subarray(12)}s?e.error(new r(B)):e.enqueue(lt(n,t))}})}}class ft extends d{constructor({password:t,passwordVerification:n}){super({start(){e.assign(this,{password:t,passwordVerification:n}),wt(this,t)},transform(t,e){const n=this;let s,r;if(n.password){n.password=null;const e=D(new o(12));e[11]=n.passwordVerification,s=new o(t.length+e.length),s.set(ut(n,e),0),r=12}else s=new o(t.length),r=0;s.set(ut(n,t),r),e.enqueue(s)}})}}function lt(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,n[s]);return n}function ut(t,e){const n=new o(e.length);for(let s=0;s<e.length;s++)n[s]=dt(t)^e[s],pt(t,e[s]);return n}function wt(t,n){const s=[305419896,591751049,878082192];e.assign(t,{keys:s,tt:new C(s[0]),et:new C(s[2])});for(let e=0;e<n.length;e++)pt(t,n.charCodeAt(e))}function pt(t,e){let[n,r,o]=t.keys;t.tt.append([e]),n=~t.tt.get(),r=mt(s.imul(mt(r+yt(n)),134775813)+1),t.et.append([r>>>24]),o=~t.et.get(),t.keys=[n,r,o]}function dt(t){const e=2|t.keys[2];return yt(s.imul(e,1^e)>>>8)}function yt(t){return 255&t}function mt(t){return 4294967295&t}class gt extends d{constructor(t,{chunkSize:e,nt:n,CompressionStream:s}){super({});const{compressed:r,encrypted:o,useCompressionStream:i,zipCrypto:c,signed:a,level:h}=t,l=this;let u,w,p=super.readable;o&&!c||!a||(u=new A,p=kt(p,u)),r&&(p=vt(p,i,{level:h,chunkSize:e},s,n,s)),o&&(c?p=kt(p,new ft(t)):(w=new et(t),p=kt(p,w))),bt(l,p,()=>{let t;o&&!c&&(t=w.signature),o&&!c||!a||(t=new f(u.value.buffer).getUint32(0)),l.signature=t})}}class St extends d{constructor(t,{chunkSize:e,st:n,DecompressionStream:s}){super({});const{zipCrypto:o,encrypted:i,signed:c,signature:a,compressed:h,useCompressionStream:l,rt:u}=t;let w,p,d=super.readable;i&&(o?d=kt(d,new ht(t)):(p=new tt(t),d=kt(d,p))),h&&(d=vt(d,l,{chunkSize:e,rt:u},s,n,s)),i&&!o||!c||(w=new A,d=kt(d,w)),bt(this,d,()=>{if((!i||o)&&c){const t=new f(w.value.buffer);if(a!=t.getUint32(0,!1))throw new r(_)}})}}function bt(t,n,s){n=kt(n,new d({flush:s})),e.defineProperty(t,"readable",{get:()=>n})}function vt(t,e,n,s,r,o){const i=e&&s?s:r||o,c=n.rt?"deflate64-raw":"deflate-raw";try{t=kt(t,new i(c,n))}catch(s){if(!e)throw s;if(r)t=kt(t,new r(c,n));else{if(!o)throw s;t=kt(t,new o(c,n))}}return t}function kt(t,e){return t.pipeThrough(e)}const zt="data",Ct="close";class At extends d{constructor(t,n){super({});const s=this,{codecType:o}=t;let i;o.startsWith("deflate")?i=gt:o.startsWith("inflate")&&(i=St),s.outputSize=0;let c=0;const a=new i(t,n),h=super.readable,f=new d({transform(t,e){t&&t.length&&(c+=t.length,e.enqueue(t))},flush(){e.assign(s,{inputSize:c})}}),l=new d({transform(e,n){if(e&&e.length&&(n.enqueue(e),s.outputSize+=e.length,t.outputSize!==b&&s.outputSize>t.outputSize))throw new r("Invalid uncompressed size")},flush(){const{signature:t}=a;e.assign(s,{signature:t,inputSize:c})}});e.defineProperty(s,"readable",{get:()=>h.pipeThrough(f).pipeThrough(a).pipeThrough(l)})}}class xt extends d{constructor(t){let e;super({transform:function n(s,r){if(e){const t=new o(e.length+s.length);t.set(e),t.set(s,e.length),s=t,e=null}s.length>t?(r.enqueue(s.slice(0,t)),n(s.slice(t),r)):e=s},flush(t){e&&e.length&&t.enqueue(e)}})}}const It=new h,Rt=new h;let Pt,Ut,Vt,Mt,_t,Bt=0;async function Dt(t){try{const{options:e,config:s}=t;if(!e.useCompressionStream)try{await self.initModule(t.config)}catch{e.useCompressionStream=!0}s.CompressionStream=self.CompressionStream,s.DecompressionStream=self.DecompressionStream;const r={highWaterMark:1},o=t.readable||new y({async pull(t){const e=new l(t=>It.set(Bt,t));Wt({type:"pull",messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER;const{value:s,done:r}=await e;t.enqueue(s),r&&t.close()}},r),i=t.writable||new m({async write(t){let e;const s=new l(t=>e=t);Rt.set(Bt,e),Wt({type:zt,value:t,messageId:Bt}),Bt=(Bt+1)%n.MAX_SAFE_INTEGER,await s}},r),c=new At(e,s);Pt=new AbortController;const{signal:a}=Pt;await o.pipeThrough(c).pipeThrough(new xt(s.chunkSize)).pipeTo(i,{signal:a,preventClose:!0,preventAbort:!0}),await i.getWriter().close();const{signature:h,inputSize:f,outputSize:u}=c;Wt({type:Ct,result:{signature:h,inputSize:f,outputSize:u}})}catch(t){t.outputSize=0,Kt(t)}}function Wt(t){let{value:e}=t;if(e)if(e.length)try{e=new o(e),t.value=e.buffer,p(t,[t.value])}catch{p(t)}else p(t);else p(t)}function Kt(t=new r("Unknown error")){const{message:e,stack:n,code:s,name:o,outputSize:i}=t;p({error:{message:e,stack:n,code:s,name:o,outputSize:i}})}function Et(t,e,n={}){const i="number"==typeof n.level?n.level:-1,c="number"==typeof n.ot?n.ot:65536,a="number"==typeof n.it?n.it:65536;return new d({start(){let n;if(this.ct=Vt(c),this.in=Vt(a),this.it=a,this.ht=new o(c),t?(this.ft=Ut.deflate_process,this.lt=Ut.deflate_last_consumed,this.ut=Ut.deflate_end,this.wt=Ut.deflate_new(),n="gzip"===e?Ut.deflate_init_gzip(this.wt,i):"deflate-raw"===e?Ut.deflate_init_raw(this.wt,i):Ut.deflate_init(this.wt,i)):"deflate64-raw"===e?(this.ft=Ut.inflate9_process,this.lt=Ut.inflate9_last_consumed,this.ut=Ut.inflate9_end,this.wt=Ut.inflate9_new(),n=Ut.inflate9_init_raw(this.wt)):(this.ft=Ut.inflate_process,this.lt=Ut.inflate_last_consumed,this.ut=Ut.inflate_end,this.wt=Ut.inflate_new(),n="deflate-raw"===e?Ut.inflate_init_raw(this.wt):"gzip"===e?Ut.inflate_init_gzip(this.wt):Ut.inflate_init(this.wt)),0!==n)throw new r("init failed:"+n)},transform(e,n){try{const i=e,a=new o(_t.buffer),h=this.ft,f=this.lt,l=this.ct,u=this.ht;let w=0;for(;w<i.length;){const e=s.min(i.length-w,32768);this.in&&this.it>=e||(this.in&&Mt&&Mt(this.in),this.in=Vt(e),this.it=e),a.set(i.subarray(w,w+e),this.in);const o=h(this.wt,this.in,e,l,c,0),p=16777215&o;if(p&&(u.set(a.subarray(l,l+p),0),n.enqueue(u.slice(0,p))),!t){const t=o>>24&255,e=128&t?t-256:t;if(0>e)throw new r("process error:"+e)}const d=f(this.wt);if(0===d)break;w+=d}}catch(t){this.ut&&this.wt&&this.ut(this.wt),this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct),n.error(t)}},flush(e){try{const n=new o(_t.buffer),s=this.ft,i=this.ct,a=this.ht;for(;;){const o=s(this.wt,0,0,i,c,4),h=16777215&o,f=o>>24&255;if(!t){const t=128&f?f-256:f;if(0>t)throw new r("process error:"+t)}if(h&&(a.set(n.subarray(i,i+h),0),e.enqueue(a.slice(0,h))),1===f||0===h)break}}catch(t){e.error(t)}finally{if(this.ut&&this.wt){const t=this.ut(this.wt);0!==t&&e.error(new r("end error:"+t))}this.in&&Mt&&Mt(this.in),this.ct&&Mt&&Mt(this.ct)}}})}addEventListener("message",({data:t})=>{const{type:e,messageId:n,value:s,done:r}=t;try{if("start"==e&&Dt(t),e==zt){const t=It.get(n);It.delete(n),t({value:new o(s),done:r})}if("ack"==e){const t=Rt.get(n);Rt.delete(n),t()}e==Ct&&Pt.abort()}catch(t){Kt(t)}});class Lt{constructor(t="deflate",e){return Et(!0,t,e)}}class Ot{constructor(t="deflate",e){return Et(!1,t,e)}}let Tt=!1;self.initModule=async t=>{try{const e=await(async(t,{baseURI:e})=>{if(!Tt){let n,s;try{try{s=new URL(t,e)}catch{}const r=await fetch(s);n=await r.arrayBuffer()}catch(e){if(!t.startsWith("data:application/wasm;base64,"))throw e;n=(t=>{const e=t.split(",")[1],n=atob(e),s=n.length,r=new o(s);for(let t=0;s>t;++t)r[t]=n.charCodeAt(t);return r.buffer})(t)}(t=>{if(Ut=t,({malloc:Vt,free:Mt,memory:_t}=Ut),"function"!=typeof Vt||"function"!=typeof Mt||!_t)throw Ut=Vt=Mt=_t=null,new r("Invalid WASM module")})((await WebAssembly.instantiate(n)).instance.exports),Tt=!0}})(t.wasmURI,t);return t.nt=Lt,t.st=Ot,e}catch{}}});\n';
  t2({ workerURI: (t3) => {
    const n = "text/javascript";
    if (t3) {
      const t4 = new Blob([e], { type: n });
      return URL.createObjectURL(t4);
    }
    return "data:" + n + "," + encodeURIComponent(e);
  } });
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codecs/crc32.js
var table = [];
for (let i = 0; i < 256; i++) {
  let t2 = i;
  for (let j = 0; j < 8; j++) {
    if (t2 & 1) {
      t2 = t2 >>> 1 ^ 3988292384;
    } else {
      t2 = t2 >>> 1;
    }
  }
  table[i] = t2;
}
var Crc32 = class {
  constructor(crc) {
    this.crc = crc || -1;
  }
  append(data) {
    let crc = this.crc | 0;
    for (let offset = 0, length = data.length | 0; offset < length; offset++) {
      crc = crc >>> 8 ^ table[(crc ^ data[offset]) & 255];
    }
    this.crc = crc;
  }
  get() {
    return ~this.crc;
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/crc32-stream.js
var Crc32Stream = class extends TransformStream {
  constructor() {
    let stream;
    const crc32 = new Crc32();
    super({
      transform(chunk, controller) {
        crc32.append(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        const value = new Uint8Array(4);
        const dataView = new DataView(value.buffer);
        dataView.setUint32(0, crc32.get());
        stream.value = value;
      }
    });
    stream = this;
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/encode-text.js
function encodeText(value) {
  if (typeof TextEncoder == UNDEFINED_TYPE) {
    value = unescape(encodeURIComponent(value));
    const result = new Uint8Array(value.length);
    for (let i = 0; i < result.length; i++) {
      result[i] = value.charCodeAt(i);
    }
    return result;
  } else {
    return new TextEncoder().encode(value);
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codecs/sjcl.js
var bitArray = {
  /**
   * Concatenate two bit arrays.
   * @param {bitArray} a1 The first array.
   * @param {bitArray} a2 The second array.
   * @return {bitArray} The concatenation of a1 and a2.
   */
  concat(a1, a2) {
    if (a1.length === 0 || a2.length === 0) {
      return a1.concat(a2);
    }
    const last = a1[a1.length - 1], shift = bitArray.getPartial(last);
    if (shift === 32) {
      return a1.concat(a2);
    } else {
      return bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
    }
  },
  /**
   * Find the length of an array of bits.
   * @param {bitArray} a The array.
   * @return {Number} The length of a, in bits.
   */
  bitLength(a) {
    const l = a.length;
    if (l === 0) {
      return 0;
    }
    const x = a[l - 1];
    return (l - 1) * 32 + bitArray.getPartial(x);
  },
  /**
   * Truncate an array.
   * @param {bitArray} a The array.
   * @param {Number} len The length to truncate to, in bits.
   * @return {bitArray} A new array, truncated to len bits.
   */
  clamp(a, len) {
    if (a.length * 32 < len) {
      return a;
    }
    a = a.slice(0, Math.ceil(len / 32));
    const l = a.length;
    len = len & 31;
    if (l > 0 && len) {
      a[l - 1] = bitArray.partial(len, a[l - 1] & 2147483648 >> len - 1, 1);
    }
    return a;
  },
  /**
   * Make a partial word for a bit array.
   * @param {Number} len The number of bits in the word.
   * @param {Number} x The bits.
   * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
   * @return {Number} The partial word.
   */
  partial(len, x, _end) {
    if (len === 32) {
      return x;
    }
    return (_end ? x | 0 : x << 32 - len) + len * 1099511627776;
  },
  /**
   * Get the number of bits used by a partial word.
   * @param {Number} x The partial word.
   * @return {Number} The number of bits used by the partial word.
   */
  getPartial(x) {
    return Math.round(x / 1099511627776) || 32;
  },
  /** Shift an array right.
   * @param {bitArray} a The array to shift.
   * @param {Number} shift The number of bits to shift.
   * @param {Number} [carry=0] A byte to carry in
   * @param {bitArray} [out=[]] An array to prepend to the output.
   * @private
   */
  _shiftRight(a, shift, carry, out) {
    if (out === void 0) {
      out = [];
    }
    for (; shift >= 32; shift -= 32) {
      out.push(carry);
      carry = 0;
    }
    if (shift === 0) {
      return out.concat(a);
    }
    for (let i = 0; i < a.length; i++) {
      out.push(carry | a[i] >>> shift);
      carry = a[i] << 32 - shift;
    }
    const last2 = a.length ? a[a.length - 1] : 0;
    const shift2 = bitArray.getPartial(last2);
    out.push(bitArray.partial(shift + shift2 & 31, shift + shift2 > 32 ? carry : out.pop(), 1));
    return out;
  }
};
var codec = {
  bytes: {
    /** Convert from a bitArray to an array of bytes. */
    fromBits(arr) {
      const bl = bitArray.bitLength(arr);
      const byteLength = bl / 8;
      const out = new Uint8Array(byteLength);
      let tmp;
      for (let i = 0; i < byteLength; i++) {
        if ((i & 3) === 0) {
          tmp = arr[i / 4];
        }
        out[i] = tmp >>> 24;
        tmp <<= 8;
      }
      return out;
    },
    /** Convert from an array of bytes to a bitArray. */
    toBits(bytes) {
      const out = [];
      let i;
      let tmp = 0;
      for (i = 0; i < bytes.length; i++) {
        tmp = tmp << 8 | bytes[i];
        if ((i & 3) === 3) {
          out.push(tmp);
          tmp = 0;
        }
      }
      if (i & 3) {
        out.push(bitArray.partial(8 * (i & 3), tmp));
      }
      return out;
    }
  }
};
var hash = {};
hash.sha1 = class {
  constructor(hash2) {
    const sha1 = this;
    sha1.blockSize = 512;
    sha1._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    sha1._key = [1518500249, 1859775393, 2400959708, 3395469782];
    if (hash2) {
      sha1._h = hash2._h.slice(0);
      sha1._buffer = hash2._buffer.slice(0);
      sha1._length = hash2._length;
    } else {
      sha1.reset();
    }
  }
  /**
   * Reset the hash state.
   * @return this
   */
  reset() {
    const sha1 = this;
    sha1._h = sha1._init.slice(0);
    sha1._buffer = [];
    sha1._length = 0;
    return sha1;
  }
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update(data) {
    const sha1 = this;
    if (typeof data === "string") {
      data = codec.utf8String.toBits(data);
    }
    const b = sha1._buffer = bitArray.concat(sha1._buffer, data);
    const ol = sha1._length;
    const nl = sha1._length = ol + bitArray.bitLength(data);
    if (nl > 9007199254740991) {
      throw new Error("Cannot hash more than 2^53 - 1 bits");
    }
    const c = new Uint32Array(b);
    let j = 0;
    for (let i = sha1.blockSize + ol - (sha1.blockSize + ol & sha1.blockSize - 1); i <= nl; i += sha1.blockSize) {
      sha1._block(c.subarray(16 * j, 16 * (j + 1)));
      j += 1;
    }
    b.splice(0, 16 * j);
    return sha1;
  }
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
   */
  finalize() {
    const sha1 = this;
    let b = sha1._buffer;
    const h = sha1._h;
    b = bitArray.concat(b, [bitArray.partial(1, 1)]);
    for (let i = b.length + 2; i & 15; i++) {
      b.push(0);
    }
    b.push(Math.floor(sha1._length / 4294967296));
    b.push(sha1._length | 0);
    while (b.length) {
      sha1._block(b.splice(0, 16));
    }
    sha1.reset();
    return h;
  }
  /**
   * The SHA-1 logical functions f(0), f(1), ..., f(79).
   * @private
   */
  _f(t2, b, c, d) {
    if (t2 <= 19) {
      return b & c | ~b & d;
    } else if (t2 <= 39) {
      return b ^ c ^ d;
    } else if (t2 <= 59) {
      return b & c | b & d | c & d;
    } else if (t2 <= 79) {
      return b ^ c ^ d;
    }
  }
  /**
   * Circular left-shift operator.
   * @private
   */
  _S(n, x) {
    return x << n | x >>> 32 - n;
  }
  /**
   * Perform one cycle of SHA-1.
   * @param {Uint32Array|bitArray} words one block of words.
   * @private
   */
  _block(words) {
    const sha1 = this;
    const h = sha1._h;
    const w = Array(80);
    for (let j = 0; j < 16; j++) {
      w[j] = words[j];
    }
    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    for (let t2 = 0; t2 <= 79; t2++) {
      if (t2 >= 16) {
        w[t2] = sha1._S(1, w[t2 - 3] ^ w[t2 - 8] ^ w[t2 - 14] ^ w[t2 - 16]);
      }
      const tmp = sha1._S(5, a) + sha1._f(t2, b, c, d) + e + w[t2] + sha1._key[Math.floor(t2 / 20)] | 0;
      e = d;
      d = c;
      c = sha1._S(30, b);
      b = a;
      a = tmp;
    }
    h[0] = h[0] + a | 0;
    h[1] = h[1] + b | 0;
    h[2] = h[2] + c | 0;
    h[3] = h[3] + d | 0;
    h[4] = h[4] + e | 0;
  }
};
var cipher = {};
cipher.aes = class {
  constructor(key) {
    const aes = this;
    aes._tables = [[[], [], [], [], []], [[], [], [], [], []]];
    if (!aes._tables[0][0][0]) {
      aes._precompute();
    }
    const sbox = aes._tables[0][4];
    const decTable = aes._tables[1];
    const keyLen = key.length;
    let i, encKey, decKey, rcon = 1;
    if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
      throw new Error("invalid aes key size");
    }
    aes._key = [encKey = key.slice(0), decKey = []];
    for (i = keyLen; i < 4 * keyLen + 28; i++) {
      let tmp = encKey[i - 1];
      if (i % keyLen === 0 || keyLen === 8 && i % keyLen === 4) {
        tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
        if (i % keyLen === 0) {
          tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
          rcon = rcon << 1 ^ (rcon >> 7) * 283;
        }
      }
      encKey[i] = encKey[i - keyLen] ^ tmp;
    }
    for (let j = 0; i; j++, i--) {
      const tmp = encKey[j & 3 ? i : i - 4];
      if (i <= 4 || j < 4) {
        decKey[j] = tmp;
      } else {
        decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
      }
    }
  }
  // public
  /* Something like this might appear here eventually
  name: "AES",
  blockSize: 4,
  keySizes: [4,6,8],
  */
  /**
   * Encrypt an array of 4 big-endian words.
   * @param {Array} data The plaintext.
   * @return {Array} The ciphertext.
   */
  encrypt(data) {
    return this._crypt(data, 0);
  }
  /**
   * Decrypt an array of 4 big-endian words.
   * @param {Array} data The ciphertext.
   * @return {Array} The plaintext.
   */
  decrypt(data) {
    return this._crypt(data, 1);
  }
  /**
   * Expand the S-box tables.
   *
   * @private
   */
  _precompute() {
    const encTable = this._tables[0];
    const decTable = this._tables[1];
    const sbox = encTable[4];
    const sboxInv = decTable[4];
    const d = [];
    const th = [];
    let xInv, x2, x4, x8;
    for (let i = 0; i < 256; i++) {
      th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
    }
    for (let x = xInv = 0; !sbox[x]; x ^= x2 || 1, xInv = th[xInv] || 1) {
      let s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
      s = s >> 8 ^ s & 255 ^ 99;
      sbox[x] = s;
      sboxInv[s] = x;
      x8 = d[x4 = d[x2 = d[x]]];
      let tDec = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
      let tEnc = d[s] * 257 ^ s * 16843008;
      for (let i = 0; i < 4; i++) {
        encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
      }
    }
    for (let i = 0; i < 5; i++) {
      encTable[i] = encTable[i].slice(0);
      decTable[i] = decTable[i].slice(0);
    }
  }
  /**
   * Encryption and decryption core.
   * @param {Array} input Four words to be encrypted or decrypted.
   * @param dir The direction, 0 for encrypt and 1 for decrypt.
   * @return {Array} The four encrypted or decrypted words.
   * @private
   */
  _crypt(input, dir) {
    if (input.length !== 4) {
      throw new Error("invalid aes block size");
    }
    const key = this._key[dir];
    const nInnerRounds = key.length / 4 - 2;
    const out = [0, 0, 0, 0];
    const table3 = this._tables[dir];
    const t0 = table3[0];
    const t1 = table3[1];
    const t2 = table3[2];
    const t3 = table3[3];
    const sbox = table3[4];
    let a = input[0] ^ key[0];
    let b = input[dir ? 3 : 1] ^ key[1];
    let c = input[2] ^ key[2];
    let d = input[dir ? 1 : 3] ^ key[3];
    let kIndex = 4;
    let a2, b2, c2;
    for (let i = 0; i < nInnerRounds; i++) {
      a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
      b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
      c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
      d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
      kIndex += 4;
      a = a2;
      b = b2;
      c = c2;
    }
    for (let i = 0; i < 4; i++) {
      out[dir ? 3 & -i : i] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
      a2 = a;
      a = b;
      b = c;
      c = d;
      d = a2;
    }
    return out;
  }
};
var random = {
  /** 
   * Generate random words with pure js, cryptographically not as strong & safe as native implementation.
   * @param {TypedArray} typedArray The array to fill.
   * @return {TypedArray} The random values.
   */
  getRandomValues(typedArray) {
    const words = new Uint32Array(typedArray.buffer);
    const r = (m_w) => {
      let m_z = 987654321;
      const mask = 4294967295;
      return function() {
        m_z = 36969 * (m_z & 65535) + (m_z >> 16) & mask;
        m_w = 18e3 * (m_w & 65535) + (m_w >> 16) & mask;
        const result = ((m_z << 16) + m_w & mask) / 4294967296 + 0.5;
        return result * (Math.random() > 0.5 ? 1 : -1);
      };
    };
    for (let i = 0, rcache; i < typedArray.length; i += 4) {
      const _r = r((rcache || Math.random()) * 4294967296);
      rcache = _r() * 987654071;
      words[i / 4] = _r() * 4294967296 | 0;
    }
    return typedArray;
  }
};
var mode = {};
mode.ctrGladman = class {
  constructor(prf, iv) {
    this._prf = prf;
    this._initIv = iv;
    this._iv = iv;
  }
  reset() {
    this._iv = this._initIv;
  }
  /** Input some data to calculate.
   * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
   */
  update(data) {
    return this.calculate(this._prf, data, this._iv);
  }
  incWord(word) {
    if ((word >> 24 & 255) === 255) {
      let b1 = word >> 16 & 255;
      let b2 = word >> 8 & 255;
      let b3 = word & 255;
      if (b1 === 255) {
        b1 = 0;
        if (b2 === 255) {
          b2 = 0;
          if (b3 === 255) {
            b3 = 0;
          } else {
            ++b3;
          }
        } else {
          ++b2;
        }
      } else {
        ++b1;
      }
      word = 0;
      word += b1 << 16;
      word += b2 << 8;
      word += b3;
    } else {
      word += 1 << 24;
    }
    return word;
  }
  incCounter(counter) {
    if ((counter[0] = this.incWord(counter[0])) === 0) {
      counter[1] = this.incWord(counter[1]);
    }
  }
  calculate(prf, data, iv) {
    let l;
    if (!(l = data.length)) {
      return [];
    }
    const bl = bitArray.bitLength(data);
    for (let i = 0; i < l; i += 4) {
      this.incCounter(iv);
      const e = prf.encrypt(iv);
      data[i] ^= e[0];
      data[i + 1] ^= e[1];
      data[i + 2] ^= e[2];
      data[i + 3] ^= e[3];
    }
    return bitArray.clamp(data, bl);
  }
};
var misc = {
  importKey(password) {
    return new misc.hmacSha1(codec.bytes.toBits(password));
  },
  pbkdf2(prf, salt, count, length) {
    count = count || 1e4;
    if (length < 0 || count < 0) {
      throw new Error("invalid params to pbkdf2");
    }
    const byteLength = (length >> 5) + 1 << 2;
    let u, ui, i, j, k;
    const arrayBuffer = new ArrayBuffer(byteLength);
    const out = new DataView(arrayBuffer);
    let outLength = 0;
    const b = bitArray;
    salt = codec.bytes.toBits(salt);
    for (k = 1; outLength < (byteLength || 1); k++) {
      u = ui = prf.encrypt(b.concat(salt, [k]));
      for (i = 1; i < count; i++) {
        ui = prf.encrypt(ui);
        for (j = 0; j < ui.length; j++) {
          u[j] ^= ui[j];
        }
      }
      for (i = 0; outLength < (byteLength || 1) && i < u.length; i++) {
        out.setInt32(outLength, u[i]);
        outLength += 4;
      }
    }
    return arrayBuffer.slice(0, length / 8);
  }
};
misc.hmacSha1 = class {
  constructor(key) {
    const hmac = this;
    const Hash = hmac._hash = hash.sha1;
    const exKey = [[], []];
    hmac._baseHash = [new Hash(), new Hash()];
    const bs = hmac._baseHash[0].blockSize / 32;
    if (key.length > bs) {
      key = new Hash().update(key).finalize();
    }
    for (let i = 0; i < bs; i++) {
      exKey[0][i] = key[i] ^ 909522486;
      exKey[1][i] = key[i] ^ 1549556828;
    }
    hmac._baseHash[0].update(exKey[0]);
    hmac._baseHash[1].update(exKey[1]);
    hmac._resultHash = new Hash(hmac._baseHash[0]);
  }
  reset() {
    const hmac = this;
    hmac._resultHash = new hmac._hash(hmac._baseHash[0]);
    hmac._updated = false;
  }
  update(data) {
    const hmac = this;
    hmac._updated = true;
    hmac._resultHash.update(data);
  }
  digest() {
    const hmac = this;
    const w = hmac._resultHash.finalize();
    const result = new hmac._hash(hmac._baseHash[1]).update(w).finalize();
    hmac.reset();
    return result;
  }
  encrypt(data) {
    if (!this._updated) {
      this.update(data);
      return this.digest(data);
    } else {
      throw new Error("encrypt on already updated hmac called!");
    }
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/common-crypto.js
var GET_RANDOM_VALUES_SUPPORTED = typeof crypto != UNDEFINED_TYPE && typeof crypto.getRandomValues == FUNCTION_TYPE;
var ERR_INVALID_PASSWORD = "Invalid password";
var ERR_INVALID_SIGNATURE = "Invalid signature";
var ERR_ABORT_CHECK_PASSWORD = "zipjs-abort-check-password";
function getRandomValues(array) {
  if (GET_RANDOM_VALUES_SUPPORTED) {
    return crypto.getRandomValues(array);
  } else {
    return random.getRandomValues(array);
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/aes-crypto-stream.js
var BLOCK_LENGTH = 16;
var RAW_FORMAT = "raw";
var PBKDF2_ALGORITHM = { name: "PBKDF2" };
var HASH_ALGORITHM = { name: "HMAC" };
var HASH_FUNCTION = "SHA-1";
var BASE_KEY_ALGORITHM = Object.assign({ hash: HASH_ALGORITHM }, PBKDF2_ALGORITHM);
var DERIVED_BITS_ALGORITHM = Object.assign({ iterations: 1e3, hash: { name: HASH_FUNCTION } }, PBKDF2_ALGORITHM);
var DERIVED_BITS_USAGE = ["deriveBits"];
var SALT_LENGTH = [8, 12, 16];
var KEY_LENGTH = [16, 24, 32];
var SIGNATURE_LENGTH = 10;
var COUNTER_DEFAULT_VALUE = [0, 0, 0, 0];
var CRYPTO_API_SUPPORTED = typeof crypto != UNDEFINED_TYPE;
var subtle = CRYPTO_API_SUPPORTED && crypto.subtle;
var SUBTLE_API_SUPPORTED = CRYPTO_API_SUPPORTED && typeof subtle != UNDEFINED_TYPE;
var codecBytes = codec.bytes;
var Aes = cipher.aes;
var CtrGladman = mode.ctrGladman;
var HmacSha1 = misc.hmacSha1;
var IMPORT_KEY_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.importKey == FUNCTION_TYPE;
var DERIVE_BITS_SUPPORTED = CRYPTO_API_SUPPORTED && SUBTLE_API_SUPPORTED && typeof subtle.deriveBits == FUNCTION_TYPE;
var AESDecryptionStream = class extends TransformStream {
  constructor({ password, rawPassword, signed, encryptionStrength, checkPasswordOnly }) {
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((resolve) => this.resolveReady = resolve),
          password: encodePassword(password, rawPassword),
          signed,
          strength: encryptionStrength - 1,
          pending: new Uint8Array()
        });
      },
      async transform(chunk, controller) {
        const aesCrypto = this;
        const {
          password: password2,
          strength,
          resolveReady,
          ready
        } = aesCrypto;
        if (password2) {
          await createDecryptionKeys(aesCrypto, strength, password2, subarray(chunk, 0, SALT_LENGTH[strength] + 2));
          chunk = subarray(chunk, SALT_LENGTH[strength] + 2);
          if (checkPasswordOnly) {
            controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
          } else {
            resolveReady();
          }
        } else {
          await ready;
        }
        const output = new Uint8Array(chunk.length - SIGNATURE_LENGTH - (chunk.length - SIGNATURE_LENGTH) % BLOCK_LENGTH);
        controller.enqueue(append(aesCrypto, chunk, output, 0, SIGNATURE_LENGTH, true));
      },
      async flush(controller) {
        const {
          signed: signed2,
          ctr,
          hmac,
          pending,
          ready
        } = this;
        if (hmac && ctr) {
          await ready;
          const chunkToDecrypt = subarray(pending, 0, pending.length - SIGNATURE_LENGTH);
          const originalSignature = subarray(pending, pending.length - SIGNATURE_LENGTH);
          let decryptedChunkArray = new Uint8Array();
          if (chunkToDecrypt.length) {
            const encryptedChunk = toBits(codecBytes, chunkToDecrypt);
            hmac.update(encryptedChunk);
            const decryptedChunk = ctr.update(encryptedChunk);
            decryptedChunkArray = fromBits(codecBytes, decryptedChunk);
          }
          if (signed2) {
            const signature = subarray(fromBits(codecBytes, hmac.digest()), 0, SIGNATURE_LENGTH);
            for (let indexSignature = 0; indexSignature < SIGNATURE_LENGTH; indexSignature++) {
              if (signature[indexSignature] != originalSignature[indexSignature]) {
                throw new Error(ERR_INVALID_SIGNATURE);
              }
            }
          }
          controller.enqueue(decryptedChunkArray);
        }
      }
    });
  }
};
var AESEncryptionStream = class extends TransformStream {
  constructor({ password, rawPassword, encryptionStrength }) {
    let stream;
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((resolve) => this.resolveReady = resolve),
          password: encodePassword(password, rawPassword),
          strength: encryptionStrength - 1,
          pending: new Uint8Array()
        });
      },
      async transform(chunk, controller) {
        const aesCrypto = this;
        const {
          password: password2,
          strength,
          resolveReady,
          ready
        } = aesCrypto;
        let preamble = new Uint8Array();
        if (password2) {
          preamble = await createEncryptionKeys(aesCrypto, strength, password2);
          resolveReady();
        } else {
          await ready;
        }
        const output = new Uint8Array(preamble.length + chunk.length - chunk.length % BLOCK_LENGTH);
        output.set(preamble, 0);
        controller.enqueue(append(aesCrypto, chunk, output, preamble.length, 0));
      },
      async flush(controller) {
        const {
          ctr,
          hmac,
          pending,
          ready
        } = this;
        if (hmac && ctr) {
          await ready;
          let encryptedChunkArray = new Uint8Array();
          if (pending.length) {
            const encryptedChunk = ctr.update(toBits(codecBytes, pending));
            hmac.update(encryptedChunk);
            encryptedChunkArray = fromBits(codecBytes, encryptedChunk);
          }
          stream.signature = fromBits(codecBytes, hmac.digest()).slice(0, SIGNATURE_LENGTH);
          controller.enqueue(concat(encryptedChunkArray, stream.signature));
        }
      }
    });
    stream = this;
  }
};
function append(aesCrypto, input, output, paddingStart, paddingEnd, verifySignature) {
  const {
    ctr,
    hmac,
    pending
  } = aesCrypto;
  const inputLength = input.length - paddingEnd;
  if (pending.length) {
    input = concat(pending, input);
    output = expand(output, inputLength - inputLength % BLOCK_LENGTH);
  }
  let offset;
  for (offset = 0; offset <= inputLength - BLOCK_LENGTH; offset += BLOCK_LENGTH) {
    const inputChunk = toBits(codecBytes, subarray(input, offset, offset + BLOCK_LENGTH));
    if (verifySignature) {
      hmac.update(inputChunk);
    }
    const outputChunk = ctr.update(inputChunk);
    if (!verifySignature) {
      hmac.update(outputChunk);
    }
    output.set(fromBits(codecBytes, outputChunk), offset + paddingStart);
  }
  aesCrypto.pending = subarray(input, offset);
  return output;
}
async function createDecryptionKeys(decrypt2, strength, password, preamble) {
  const passwordVerificationKey = await createKeys(decrypt2, strength, password, subarray(preamble, 0, SALT_LENGTH[strength]));
  const passwordVerification = subarray(preamble, SALT_LENGTH[strength]);
  if (passwordVerificationKey[0] != passwordVerification[0] || passwordVerificationKey[1] != passwordVerification[1]) {
    throw new Error(ERR_INVALID_PASSWORD);
  }
}
async function createEncryptionKeys(encrypt2, strength, password) {
  const salt = getRandomValues(new Uint8Array(SALT_LENGTH[strength]));
  const passwordVerification = await createKeys(encrypt2, strength, password, salt);
  return concat(salt, passwordVerification);
}
async function createKeys(aesCrypto, strength, password, salt) {
  aesCrypto.password = null;
  const baseKey = await importKey(RAW_FORMAT, password, BASE_KEY_ALGORITHM, false, DERIVED_BITS_USAGE);
  const derivedBits = await deriveBits(Object.assign({ salt }, DERIVED_BITS_ALGORITHM), baseKey, 8 * (KEY_LENGTH[strength] * 2 + 2));
  const compositeKey = new Uint8Array(derivedBits);
  const key = toBits(codecBytes, subarray(compositeKey, 0, KEY_LENGTH[strength]));
  const authentication = toBits(codecBytes, subarray(compositeKey, KEY_LENGTH[strength], KEY_LENGTH[strength] * 2));
  const passwordVerification = subarray(compositeKey, KEY_LENGTH[strength] * 2);
  Object.assign(aesCrypto, {
    keys: {
      key,
      authentication,
      passwordVerification
    },
    ctr: new CtrGladman(new Aes(key), Array.from(COUNTER_DEFAULT_VALUE)),
    hmac: new HmacSha1(authentication)
  });
  return passwordVerification;
}
async function importKey(format, password, algorithm, extractable, keyUsages) {
  if (IMPORT_KEY_SUPPORTED) {
    try {
      return await subtle.importKey(format, password, algorithm, extractable, keyUsages);
    } catch {
      IMPORT_KEY_SUPPORTED = false;
      return misc.importKey(password);
    }
  } else {
    return misc.importKey(password);
  }
}
async function deriveBits(algorithm, baseKey, length) {
  if (DERIVE_BITS_SUPPORTED) {
    try {
      return await subtle.deriveBits(algorithm, baseKey, length);
    } catch {
      DERIVE_BITS_SUPPORTED = false;
      return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
    }
  } else {
    return misc.pbkdf2(baseKey, algorithm.salt, DERIVED_BITS_ALGORITHM.iterations, length);
  }
}
function encodePassword(password, rawPassword) {
  if (rawPassword === UNDEFINED_VALUE) {
    return encodeText(password);
  } else {
    return rawPassword;
  }
}
function concat(leftArray, rightArray) {
  let array = leftArray;
  if (leftArray.length + rightArray.length) {
    array = new Uint8Array(leftArray.length + rightArray.length);
    array.set(leftArray, 0);
    array.set(rightArray, leftArray.length);
  }
  return array;
}
function expand(inputArray, length) {
  if (length && length > inputArray.length) {
    const array = inputArray;
    inputArray = new Uint8Array(length);
    inputArray.set(array, 0);
  }
  return inputArray;
}
function subarray(array, begin, end) {
  return array.subarray(begin, end);
}
function fromBits(codecBytes2, chunk) {
  return codecBytes2.fromBits(chunk);
}
function toBits(codecBytes2, chunk) {
  return codecBytes2.toBits(chunk);
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zip-crypto-stream.js
var HEADER_LENGTH = 12;
var ZipCryptoDecryptionStream = class extends TransformStream {
  constructor({ password, passwordVerification, checkPasswordOnly }) {
    super({
      start() {
        Object.assign(this, {
          password,
          passwordVerification
        });
        createKeys2(this, password);
      },
      transform(chunk, controller) {
        const zipCrypto = this;
        if (zipCrypto.password) {
          const decryptedHeader = decrypt(zipCrypto, chunk.subarray(0, HEADER_LENGTH));
          zipCrypto.password = null;
          if (decryptedHeader.at(-1) != zipCrypto.passwordVerification) {
            throw new Error(ERR_INVALID_PASSWORD);
          }
          chunk = chunk.subarray(HEADER_LENGTH);
        }
        if (checkPasswordOnly) {
          controller.error(new Error(ERR_ABORT_CHECK_PASSWORD));
        } else {
          controller.enqueue(decrypt(zipCrypto, chunk));
        }
      }
    });
  }
};
var ZipCryptoEncryptionStream = class extends TransformStream {
  constructor({ password, passwordVerification }) {
    super({
      start() {
        Object.assign(this, {
          password,
          passwordVerification
        });
        createKeys2(this, password);
      },
      transform(chunk, controller) {
        const zipCrypto = this;
        let output;
        let offset;
        if (zipCrypto.password) {
          zipCrypto.password = null;
          const header = getRandomValues(new Uint8Array(HEADER_LENGTH));
          header[HEADER_LENGTH - 1] = zipCrypto.passwordVerification;
          output = new Uint8Array(chunk.length + header.length);
          output.set(encrypt(zipCrypto, header), 0);
          offset = HEADER_LENGTH;
        } else {
          output = new Uint8Array(chunk.length);
          offset = 0;
        }
        output.set(encrypt(zipCrypto, chunk), offset);
        controller.enqueue(output);
      }
    });
  }
};
function decrypt(target, input) {
  const output = new Uint8Array(input.length);
  for (let index = 0; index < input.length; index++) {
    output[index] = getByte(target) ^ input[index];
    updateKeys(target, output[index]);
  }
  return output;
}
function encrypt(target, input) {
  const output = new Uint8Array(input.length);
  for (let index = 0; index < input.length; index++) {
    output[index] = getByte(target) ^ input[index];
    updateKeys(target, input[index]);
  }
  return output;
}
function createKeys2(target, password) {
  const keys = [305419896, 591751049, 878082192];
  Object.assign(target, {
    keys,
    crcKey0: new Crc32(keys[0]),
    crcKey2: new Crc32(keys[2])
  });
  for (let index = 0; index < password.length; index++) {
    updateKeys(target, password.charCodeAt(index));
  }
}
function updateKeys(target, byte) {
  let [key0, key1, key2] = target.keys;
  target.crcKey0.append([byte]);
  key0 = ~target.crcKey0.get();
  key1 = getInt32(Math.imul(getInt32(key1 + getInt8(key0)), 134775813) + 1);
  target.crcKey2.append([key1 >>> 24]);
  key2 = ~target.crcKey2.get();
  target.keys = [key0, key1, key2];
}
function getByte(target) {
  const temp = target.keys[2] | 2;
  return getInt8(Math.imul(temp, temp ^ 1) >>> 8);
}
function getInt8(number) {
  return number & 255;
}
function getInt32(number) {
  return number & 4294967295;
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zip-entry-stream.js
var ERR_INVALID_UNCOMPRESSED_SIZE = "Invalid uncompressed size";
var FORMAT_DEFLATE_RAW = "deflate-raw";
var FORMAT_DEFLATE64_RAW = "deflate64-raw";
var DeflateStream = class extends TransformStream {
  constructor(options, { chunkSize, CompressionStreamZlib: CompressionStreamZlib2, CompressionStream: CompressionStream2 }) {
    super({});
    const { compressed, encrypted, useCompressionStream, zipCrypto, signed, level } = options;
    const stream = this;
    let crc32Stream, encryptionStream;
    let readable = super.readable;
    if ((!encrypted || zipCrypto) && signed) {
      crc32Stream = new Crc32Stream();
      readable = pipeThrough(readable, crc32Stream);
    }
    if (compressed) {
      readable = pipeThroughCommpressionStream(readable, useCompressionStream, { level, chunkSize }, CompressionStream2, CompressionStreamZlib2, CompressionStream2);
    }
    if (encrypted) {
      if (zipCrypto) {
        readable = pipeThrough(readable, new ZipCryptoEncryptionStream(options));
      } else {
        encryptionStream = new AESEncryptionStream(options);
        readable = pipeThrough(readable, encryptionStream);
      }
    }
    setReadable(stream, readable, () => {
      let signature;
      if (encrypted && !zipCrypto) {
        signature = encryptionStream.signature;
      }
      if ((!encrypted || zipCrypto) && signed) {
        signature = new DataView(crc32Stream.value.buffer).getUint32(0);
      }
      stream.signature = signature;
    });
  }
};
var InflateStream = class extends TransformStream {
  constructor(options, { chunkSize, DecompressionStreamZlib: DecompressionStreamZlib2, DecompressionStream: DecompressionStream2 }) {
    super({});
    const { zipCrypto, encrypted, signed, signature, compressed, useCompressionStream, deflate64 } = options;
    let crc32Stream, decryptionStream;
    let readable = super.readable;
    if (encrypted) {
      if (zipCrypto) {
        readable = pipeThrough(readable, new ZipCryptoDecryptionStream(options));
      } else {
        decryptionStream = new AESDecryptionStream(options);
        readable = pipeThrough(readable, decryptionStream);
      }
    }
    if (compressed) {
      readable = pipeThroughCommpressionStream(readable, useCompressionStream, { chunkSize, deflate64 }, DecompressionStream2, DecompressionStreamZlib2, DecompressionStream2);
    }
    if ((!encrypted || zipCrypto) && signed) {
      crc32Stream = new Crc32Stream();
      readable = pipeThrough(readable, crc32Stream);
    }
    setReadable(this, readable, () => {
      if ((!encrypted || zipCrypto) && signed) {
        const dataViewSignature = new DataView(crc32Stream.value.buffer);
        if (signature != dataViewSignature.getUint32(0, false)) {
          throw new Error(ERR_INVALID_SIGNATURE);
        }
      }
    });
  }
};
function setReadable(stream, readable, flush) {
  readable = pipeThrough(readable, new TransformStream({ flush }));
  Object.defineProperty(stream, "readable", {
    get() {
      return readable;
    }
  });
}
function pipeThroughCommpressionStream(readable, useCompressionStream, options, CompressionStreamNative, CompressionStreamZlib2, CompressionStream2) {
  const Stream2 = useCompressionStream && CompressionStreamNative ? CompressionStreamNative : CompressionStreamZlib2 || CompressionStream2;
  const format = options.deflate64 ? FORMAT_DEFLATE64_RAW : FORMAT_DEFLATE_RAW;
  try {
    readable = pipeThrough(readable, new Stream2(format, options));
  } catch (error) {
    if (useCompressionStream) {
      if (CompressionStreamZlib2) {
        readable = pipeThrough(readable, new CompressionStreamZlib2(format, options));
      } else if (CompressionStream2) {
        readable = pipeThrough(readable, new CompressionStream2(format, options));
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
  return readable;
}
function pipeThrough(readable, transformStream) {
  return readable.pipeThrough(transformStream);
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/codec-stream.js
var MESSAGE_EVENT_TYPE = "message";
var MESSAGE_START = "start";
var MESSAGE_PULL = "pull";
var MESSAGE_DATA = "data";
var MESSAGE_ACK_DATA = "ack";
var MESSAGE_CLOSE = "close";
var CODEC_DEFLATE = "deflate";
var CODEC_INFLATE = "inflate";
var CodecStream = class extends TransformStream {
  constructor(options, config2) {
    super({});
    const codec2 = this;
    const { codecType } = options;
    let Stream2;
    if (codecType.startsWith(CODEC_DEFLATE)) {
      Stream2 = DeflateStream;
    } else if (codecType.startsWith(CODEC_INFLATE)) {
      Stream2 = InflateStream;
    }
    codec2.outputSize = 0;
    let inputSize = 0;
    const stream = new Stream2(options, config2);
    const readable = super.readable;
    const inputSizeStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk && chunk.length) {
          inputSize += chunk.length;
          controller.enqueue(chunk);
        }
      },
      flush() {
        Object.assign(codec2, {
          inputSize
        });
      }
    });
    const outputSizeStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk && chunk.length) {
          controller.enqueue(chunk);
          codec2.outputSize += chunk.length;
          if (options.outputSize !== UNDEFINED_VALUE && codec2.outputSize > options.outputSize) {
            throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
          }
        }
      },
      flush() {
        const { signature } = stream;
        Object.assign(codec2, {
          signature,
          inputSize
        });
      }
    });
    Object.defineProperty(codec2, "readable", {
      get() {
        return readable.pipeThrough(inputSizeStream).pipeThrough(stream).pipeThrough(outputSizeStream);
      }
    });
  }
};
var ChunkStream = class extends TransformStream {
  constructor(chunkSize) {
    let pendingChunk;
    super({
      transform,
      flush(controller) {
        if (pendingChunk && pendingChunk.length) {
          controller.enqueue(pendingChunk);
        }
      }
    });
    function transform(chunk, controller) {
      if (pendingChunk) {
        const newChunk = new Uint8Array(pendingChunk.length + chunk.length);
        newChunk.set(pendingChunk);
        newChunk.set(chunk, pendingChunk.length);
        chunk = newChunk;
        pendingChunk = null;
      }
      if (chunk.length > chunkSize) {
        controller.enqueue(chunk.slice(0, chunkSize));
        transform(chunk.slice(chunkSize), controller);
      } else {
        pendingChunk = chunk;
      }
    }
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/codec-worker.js
var MODULE_WORKER_OPTIONS = { type: "module" };
var webWorkerSupported;
var webWorkerURI;
var webWorkerOptions;
var transferStreamsSupported = true;
try {
  transferStreamsSupported = typeof structuredClone == FUNCTION_TYPE && structuredClone(new DOMException("", "AbortError")).code !== UNDEFINED_VALUE;
} catch {
}
var initModule = () => {
};
function configureWorker({ initModule: initModuleFunction }) {
  initModule = initModuleFunction;
}
var CodecWorker = class {
  constructor(workerData, { readable, writable }, { options, config: config2, streamOptions, useWebWorkers, transferStreams, workerURI }, onTaskFinished) {
    const { signal } = streamOptions;
    Object.assign(workerData, {
      busy: true,
      readable: readable.pipeThrough(new ChunkStream(config2.chunkSize)).pipeThrough(new ProgressWatcherStream(streamOptions), { signal }),
      writable,
      options: Object.assign({}, options),
      workerURI,
      transferStreams,
      terminate() {
        return new Promise((resolve) => {
          const { worker, busy } = workerData;
          if (worker) {
            if (busy) {
              workerData.resolveTerminated = resolve;
            } else {
              worker.terminate();
              resolve();
            }
            workerData.interface = null;
          } else {
            resolve();
          }
        });
      },
      onTaskFinished() {
        const { resolveTerminated } = workerData;
        if (resolveTerminated) {
          workerData.resolveTerminated = null;
          workerData.terminated = true;
          workerData.worker.terminate();
          resolveTerminated();
        }
        workerData.busy = false;
        onTaskFinished(workerData);
      }
    });
    if (webWorkerSupported === UNDEFINED_VALUE) {
      webWorkerSupported = typeof Worker != UNDEFINED_TYPE;
    }
    return (useWebWorkers && webWorkerSupported ? createWebWorkerInterface : createWorkerInterface)(workerData, config2);
  }
};
var ProgressWatcherStream = class extends TransformStream {
  constructor({ onstart, onprogress, size, onend }) {
    let chunkOffset = 0;
    super({
      async start() {
        if (onstart) {
          await callHandler(onstart, size);
        }
      },
      async transform(chunk, controller) {
        chunkOffset += chunk.length;
        if (onprogress) {
          await callHandler(onprogress, chunkOffset, size);
        }
        controller.enqueue(chunk);
      },
      async flush() {
        if (onend) {
          await callHandler(onend, chunkOffset);
        }
      }
    });
  }
};
async function callHandler(handler, ...parameters) {
  try {
    await handler(...parameters);
  } catch {
  }
}
function createWorkerInterface(workerData, config2) {
  return {
    run: () => runWorker(workerData, config2)
  };
}
function createWebWorkerInterface(workerData, config2) {
  const { baseURI, chunkSize } = config2;
  let { wasmURI } = config2;
  if (!workerData.interface) {
    if (typeof wasmURI == FUNCTION_TYPE) {
      wasmURI = wasmURI();
    }
    let worker;
    try {
      worker = getWebWorker(workerData.workerURI, baseURI, workerData);
    } catch {
      webWorkerSupported = false;
      return createWorkerInterface(workerData, config2);
    }
    Object.assign(workerData, {
      worker,
      interface: {
        run: () => runWebWorker(workerData, { chunkSize, wasmURI, baseURI })
      }
    });
  }
  return workerData.interface;
}
async function runWorker({ options, readable, writable, onTaskFinished }, config2) {
  let codecStream;
  try {
    if (!options.useCompressionStream) {
      try {
        await initModule(config2);
      } catch {
        options.useCompressionStream = true;
      }
    }
    codecStream = new CodecStream(options, config2);
    await readable.pipeThrough(codecStream).pipeTo(writable, { preventClose: true, preventAbort: true });
    const {
      signature,
      inputSize,
      outputSize
    } = codecStream;
    return {
      signature,
      inputSize,
      outputSize
    };
  } catch (error) {
    if (codecStream) {
      error.outputSize = codecStream.outputSize;
    }
    throw error;
  } finally {
    onTaskFinished();
  }
}
async function runWebWorker(workerData, config2) {
  let resolveResult, rejectResult;
  const result = new Promise((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });
  Object.assign(workerData, {
    reader: null,
    writer: null,
    resolveResult,
    rejectResult,
    result
  });
  const { readable, options } = workerData;
  const { writable, closed } = watchClosedStream(workerData.writable);
  const streamsTransferred = sendMessage({
    type: MESSAGE_START,
    options,
    config: config2,
    readable,
    writable
  }, workerData);
  if (!streamsTransferred) {
    Object.assign(workerData, {
      reader: readable.getReader(),
      writer: writable.getWriter()
    });
  }
  const resultValue = await result;
  if (!streamsTransferred) {
    await writable.getWriter().close();
  }
  await closed;
  return resultValue;
}
function watchClosedStream(writableSource) {
  const { writable, readable } = new TransformStream();
  const closed = readable.pipeTo(writableSource, { preventClose: true });
  return { writable, closed };
}
function getWebWorker(url, baseURI, workerData, isModuleType, useBlobURI = true) {
  let worker, resolvedURI, resolvedOptions;
  if (webWorkerURI === UNDEFINED_VALUE) {
    const isFunctionURI = typeof url == FUNCTION_TYPE;
    if (isFunctionURI) {
      resolvedURI = url(useBlobURI);
    } else {
      resolvedURI = url;
    }
    const isDataURI = resolvedURI.startsWith("data:");
    const isBlobURI = resolvedURI.startsWith("blob:");
    if (isDataURI || isBlobURI) {
      if (isModuleType === UNDEFINED_VALUE) {
        isModuleType = false;
      }
      if (isModuleType) {
        resolvedOptions = MODULE_WORKER_OPTIONS;
      }
      try {
        worker = new Worker(resolvedURI, resolvedOptions);
      } catch (error) {
        if (isBlobURI) {
          try {
            URL.revokeObjectURL(resolvedURI);
          } catch {
          }
        }
        if (isFunctionURI && isBlobURI) {
          return getWebWorker(url, baseURI, workerData, isModuleType, false);
        } else if (!isModuleType) {
          return getWebWorker(url, baseURI, workerData, true, false);
        } else {
          throw error;
        }
      }
    } else {
      if (isModuleType === UNDEFINED_VALUE) {
        isModuleType = true;
      }
      if (isModuleType) {
        resolvedOptions = MODULE_WORKER_OPTIONS;
      }
      try {
        resolvedURI = new URL(resolvedURI, baseURI);
      } catch {
      }
      try {
        worker = new Worker(resolvedURI, resolvedOptions);
      } catch (error) {
        if (!isModuleType) {
          return getWebWorker(url, baseURI, workerData, false, useBlobURI);
        } else {
          throw error;
        }
      }
    }
    webWorkerURI = resolvedURI;
    webWorkerOptions = resolvedOptions;
  } else {
    worker = new Worker(webWorkerURI, webWorkerOptions);
  }
  worker.addEventListener(MESSAGE_EVENT_TYPE, (event) => onMessage(event, workerData));
  return worker;
}
function sendMessage(message, { worker, writer, onTaskFinished, transferStreams }) {
  try {
    const { value, readable, writable } = message;
    const transferables = [];
    if (value) {
      message.value = value;
      transferables.push(message.value.buffer);
    }
    if (transferStreams && transferStreamsSupported) {
      if (readable) {
        transferables.push(readable);
      }
      if (writable) {
        transferables.push(writable);
      }
    } else {
      message.readable = message.writable = null;
    }
    if (transferables.length) {
      try {
        worker.postMessage(message, transferables);
        return true;
      } catch {
        transferStreamsSupported = false;
        message.readable = message.writable = null;
        worker.postMessage(message);
      }
    } else {
      worker.postMessage(message);
    }
  } catch (error) {
    if (writer) {
      writer.releaseLock();
    }
    onTaskFinished();
    throw error;
  }
}
async function onMessage({ data }, workerData) {
  const { type, value, messageId, result, error } = data;
  const { reader, writer, resolveResult, rejectResult, onTaskFinished } = workerData;
  try {
    if (error) {
      const { message, stack, code, name, outputSize } = error;
      const responseError = new Error(message);
      Object.assign(responseError, { stack, code, name, outputSize });
      close(responseError);
    } else {
      if (type == MESSAGE_PULL) {
        const { value: value2, done } = await reader.read();
        sendMessage({ type: MESSAGE_DATA, value: value2, done, messageId }, workerData);
      }
      if (type == MESSAGE_DATA) {
        await writer.ready;
        await writer.write(new Uint8Array(value));
        sendMessage({ type: MESSAGE_ACK_DATA, messageId }, workerData);
      }
      if (type == MESSAGE_CLOSE) {
        close(null, result);
      }
    }
  } catch (error2) {
    sendMessage({ type: MESSAGE_CLOSE, messageId }, workerData);
    close(error2);
  }
  function close(error2, result2) {
    if (error2) {
      rejectResult(error2);
    } else {
      resolveResult(result2);
    }
    if (writer) {
      writer.releaseLock();
    }
    onTaskFinished();
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/codec-pool.js
var pool = [];
var pendingRequests = [];
var indexWorker = 0;
async function runWorker2(stream, workerOptions) {
  const { options, config: config2 } = workerOptions;
  const { transferStreams, useWebWorkers, useCompressionStream, compressed, signed, encrypted } = options;
  const { workerURI, maxWorkers: maxWorkers2 } = config2;
  workerOptions.transferStreams = transferStreams || transferStreams === UNDEFINED_VALUE;
  const streamCopy = !compressed && !signed && !encrypted && !workerOptions.transferStreams;
  workerOptions.useWebWorkers = !streamCopy && (useWebWorkers || useWebWorkers === UNDEFINED_VALUE && config2.useWebWorkers);
  workerOptions.workerURI = workerOptions.useWebWorkers && workerURI ? workerURI : UNDEFINED_VALUE;
  options.useCompressionStream = useCompressionStream || useCompressionStream === UNDEFINED_VALUE && config2.useCompressionStream;
  return (await getWorker()).run();
  async function getWorker() {
    const workerData = pool.find((workerData2) => !workerData2.busy);
    if (workerData) {
      clearTerminateTimeout(workerData);
      return new CodecWorker(workerData, stream, workerOptions, onTaskFinished);
    } else if (pool.length < maxWorkers2) {
      const workerData2 = { indexWorker };
      indexWorker++;
      pool.push(workerData2);
      return new CodecWorker(workerData2, stream, workerOptions, onTaskFinished);
    } else {
      return new Promise((resolve) => pendingRequests.push({ resolve, stream, workerOptions }));
    }
  }
  function onTaskFinished(workerData) {
    if (pendingRequests.length) {
      const [{ resolve, stream: stream2, workerOptions: workerOptions2 }] = pendingRequests.splice(0, 1);
      resolve(new CodecWorker(workerData, stream2, workerOptions2, onTaskFinished));
    } else if (workerData.worker) {
      clearTerminateTimeout(workerData);
      terminateWorker(workerData, workerOptions);
    } else {
      pool = pool.filter((data) => data != workerData);
    }
  }
}
function terminateWorker(workerData, workerOptions) {
  const { config: config2 } = workerOptions;
  const { terminateWorkerTimeout } = config2;
  if (Number.isFinite(terminateWorkerTimeout) && terminateWorkerTimeout >= 0) {
    if (workerData.terminated) {
      workerData.terminated = false;
    } else {
      workerData.terminateTimeout = setTimeout(async () => {
        pool = pool.filter((data) => data != workerData);
        try {
          await workerData.terminate();
        } catch {
        }
      }, terminateWorkerTimeout);
    }
  }
}
function clearTerminateTimeout(workerData) {
  const { terminateTimeout } = workerData;
  if (terminateTimeout) {
    clearTimeout(terminateTimeout);
    workerData.terminateTimeout = null;
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/io.js
var ERR_ITERATOR_COMPLETED_TOO_SOON = "Writer iterator completed too soon";
var HTTP_HEADER_CONTENT_TYPE = "Content-Type";
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var DEFAULT_BUFFER_SIZE = 256 * 1024;
var PROPERTY_NAME_WRITABLE = "writable";
var Stream = class {
  constructor() {
    this.size = 0;
  }
  init() {
    this.initialized = true;
  }
};
var Reader = class extends Stream {
  get readable() {
    const reader = this;
    const { chunkSize = DEFAULT_CHUNK_SIZE } = reader;
    const readable = new ReadableStream({
      start() {
        this.chunkOffset = 0;
      },
      async pull(controller) {
        const { offset = 0, size, diskNumberStart } = readable;
        const { chunkOffset } = this;
        const dataSize = size === UNDEFINED_VALUE ? chunkSize : Math.min(chunkSize, size - chunkOffset);
        const data = await readUint8Array(reader, offset + chunkOffset, dataSize, diskNumberStart);
        controller.enqueue(data);
        if (chunkOffset + chunkSize > size || size === UNDEFINED_VALUE && !data.length && dataSize) {
          controller.close();
        } else {
          this.chunkOffset += chunkSize;
        }
      }
    });
    return readable;
  }
};
var BlobReader = class extends Reader {
  constructor(blob) {
    super();
    Object.assign(this, {
      blob,
      size: blob.size
    });
  }
  async readUint8Array(offset, length) {
    const reader = this;
    const offsetEnd = offset + length;
    const blob = offset || offsetEnd < reader.size ? reader.blob.slice(offset, offsetEnd) : reader.blob;
    let arrayBuffer = await blob.arrayBuffer();
    if (arrayBuffer.byteLength > length) {
      arrayBuffer = arrayBuffer.slice(offset, offsetEnd);
    }
    return new Uint8Array(arrayBuffer);
  }
};
var BlobWriter = class extends Stream {
  constructor(contentType) {
    super();
    const writer = this;
    const transformStream = new TransformStream();
    const headers = [];
    if (contentType) {
      headers.push([HTTP_HEADER_CONTENT_TYPE, contentType]);
    }
    Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
      get() {
        return transformStream.writable;
      }
    });
    writer.blob = new Response(transformStream.readable, { headers }).blob();
  }
  getData() {
    return this.blob;
  }
};
var TextWriter = class extends BlobWriter {
  constructor(encoding) {
    super(encoding);
    Object.assign(this, {
      encoding,
      utf8: !encoding || encoding.toLowerCase() == "utf-8"
    });
  }
  async getData() {
    const {
      encoding,
      utf8
    } = this;
    const blob = await super.getData();
    if (blob.text && utf8) {
      return blob.text();
    } else {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        Object.assign(reader, {
          onload: ({ target }) => resolve(target.result),
          onerror: () => reject(reader.error)
        });
        reader.readAsText(blob, encoding);
      });
    }
  }
};
var SplitDataReader = class extends Reader {
  constructor(readers) {
    super();
    this.readers = readers;
  }
  async init() {
    const reader = this;
    const { readers } = reader;
    reader.lastDiskNumber = 0;
    reader.lastDiskOffset = 0;
    await Promise.all(readers.map(async (diskReader, indexDiskReader) => {
      await diskReader.init();
      if (indexDiskReader != readers.length - 1) {
        reader.lastDiskOffset += diskReader.size;
      }
      reader.size += diskReader.size;
    }));
    super.init();
  }
  async readUint8Array(offset, length, diskNumber = 0) {
    const reader = this;
    const { readers } = this;
    let result;
    let currentDiskNumber = diskNumber;
    if (currentDiskNumber == -1) {
      currentDiskNumber = readers.length - 1;
    }
    let currentReaderOffset = offset;
    while (readers[currentDiskNumber] && currentReaderOffset >= readers[currentDiskNumber].size) {
      currentReaderOffset -= readers[currentDiskNumber].size;
      currentDiskNumber++;
    }
    const currentReader = readers[currentDiskNumber];
    if (currentReader) {
      const currentReaderSize = currentReader.size;
      if (currentReaderOffset + length <= currentReaderSize) {
        result = await readUint8Array(currentReader, currentReaderOffset, length);
      } else {
        const chunkLength = currentReaderSize - currentReaderOffset;
        result = new Uint8Array(length);
        const firstPart = await readUint8Array(currentReader, currentReaderOffset, chunkLength);
        result.set(firstPart, 0);
        const secondPart = await reader.readUint8Array(offset + chunkLength, length - chunkLength, diskNumber);
        result.set(secondPart, chunkLength);
        if (firstPart.length + secondPart.length < length) {
          result = result.subarray(0, firstPart.length + secondPart.length);
        }
      }
    } else {
      result = new Uint8Array();
    }
    reader.lastDiskNumber = Math.max(currentDiskNumber, reader.lastDiskNumber);
    return result;
  }
};
var SplitDataWriter = class extends Stream {
  constructor(writerGenerator, maxSize = 4294967295) {
    super();
    const writer = this;
    Object.assign(writer, {
      diskNumber: 0,
      diskOffset: 0,
      size: 0,
      maxSize,
      availableSize: maxSize
    });
    let diskSourceWriter, diskWritable, diskWriter;
    const writable = new WritableStream({
      async write(chunk) {
        const { availableSize } = writer;
        if (!diskWriter) {
          const { value, done } = await writerGenerator.next();
          if (done && !value) {
            throw new Error(ERR_ITERATOR_COMPLETED_TOO_SOON);
          } else {
            diskSourceWriter = value;
            diskSourceWriter.size = 0;
            if (diskSourceWriter.maxSize) {
              writer.maxSize = diskSourceWriter.maxSize;
            }
            writer.availableSize = writer.maxSize;
            await initStream(diskSourceWriter);
            diskWritable = value.writable;
            diskWriter = diskWritable.getWriter();
          }
          await this.write(chunk);
        } else if (chunk.length >= availableSize) {
          await writeChunk(chunk.subarray(0, availableSize));
          await closeDisk();
          writer.diskOffset += diskSourceWriter.size;
          writer.diskNumber++;
          diskWriter = null;
          await this.write(chunk.subarray(availableSize));
        } else {
          await writeChunk(chunk);
        }
      },
      async close() {
        await diskWriter.ready;
        await closeDisk();
      }
    });
    Object.defineProperty(writer, PROPERTY_NAME_WRITABLE, {
      get() {
        return writable;
      }
    });
    async function writeChunk(chunk) {
      const chunkLength = chunk.length;
      if (chunkLength) {
        await diskWriter.ready;
        await diskWriter.write(chunk);
        diskSourceWriter.size += chunkLength;
        writer.size += chunkLength;
        writer.availableSize -= chunkLength;
      }
    }
    async function closeDisk() {
      await diskWriter.close();
    }
  }
};
var GenericReader = class {
  constructor(reader) {
    if (Array.isArray(reader)) {
      reader = new SplitDataReader(reader);
    }
    if (reader instanceof ReadableStream) {
      reader = {
        readable: reader
      };
    }
    return reader;
  }
};
var GenericWriter = class {
  constructor(writer) {
    if (writer.writable === UNDEFINED_VALUE && typeof writer.next == FUNCTION_TYPE) {
      writer = new SplitDataWriter(writer);
    }
    if (writer instanceof WritableStream) {
      writer = {
        writable: writer
      };
    }
    if (writer.size === UNDEFINED_VALUE) {
      writer.size = 0;
    }
    if (!(writer instanceof SplitDataWriter)) {
      Object.assign(writer, {
        diskNumber: 0,
        diskOffset: 0,
        availableSize: INFINITY_VALUE,
        maxSize: INFINITY_VALUE
      });
    }
    return writer;
  }
};
async function initStream(stream, initSize) {
  if (stream.init && !stream.initialized) {
    await stream.init(initSize);
  } else {
    return Promise.resolve();
  }
}
function readUint8Array(reader, offset, size, diskNumber) {
  return reader.readUint8Array(offset, size, diskNumber);
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/decode-cp437.js
var CP437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0 ".split("");
var VALID_CP437 = CP437.length == 256;
function decodeCP437(stringValue) {
  if (VALID_CP437) {
    let result = "";
    for (let indexCharacter = 0; indexCharacter < stringValue.length; indexCharacter++) {
      result += CP437[stringValue[indexCharacter]];
    }
    return result;
  } else {
    return new TextDecoder().decode(stringValue);
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/decode-text.js
function decodeText(value, encoding) {
  if (encoding && encoding.trim().toLowerCase() == "cp437") {
    return decodeCP437(value);
  } else {
    return new TextDecoder(encoding).decode(value);
  }
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-entry.js
var PROPERTY_NAME_FILENAME = "filename";
var PROPERTY_NAME_RAW_FILENAME = "rawFilename";
var PROPERTY_NAME_COMMENT = "comment";
var PROPERTY_NAME_RAW_COMMENT = "rawComment";
var PROPERTY_NAME_UNCOMPRESSED_SIZE = "uncompressedSize";
var PROPERTY_NAME_COMPRESSED_SIZE = "compressedSize";
var PROPERTY_NAME_OFFSET = "offset";
var PROPERTY_NAME_DISK_NUMBER_START = "diskNumberStart";
var PROPERTY_NAME_LAST_MODIFICATION_DATE = "lastModDate";
var PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE = "rawLastModDate";
var PROPERTY_NAME_LAST_ACCESS_DATE = "lastAccessDate";
var PROPERTY_NAME_RAW_LAST_ACCESS_DATE = "rawLastAccessDate";
var PROPERTY_NAME_CREATION_DATE = "creationDate";
var PROPERTY_NAME_RAW_CREATION_DATE = "rawCreationDate";
var PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES = "internalFileAttributes";
var PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES = "externalFileAttributes";
var PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW = "msdosAttributesRaw";
var PROPERTY_NAME_MSDOS_ATTRIBUTES = "msdosAttributes";
var PROPERTY_NAME_MS_DOS_COMPATIBLE = "msDosCompatible";
var PROPERTY_NAME_ZIP64 = "zip64";
var PROPERTY_NAME_ENCRYPTED = "encrypted";
var PROPERTY_NAME_VERSION = "version";
var PROPERTY_NAME_VERSION_MADE_BY = "versionMadeBy";
var PROPERTY_NAME_ZIPCRYPTO = "zipCrypto";
var PROPERTY_NAME_DIRECTORY = "directory";
var PROPERTY_NAME_EXECUTABLE = "executable";
var PROPERTY_NAME_COMPRESSION_METHOD = "compressionMethod";
var PROPERTY_NAME_SIGNATURE = "signature";
var PROPERTY_NAME_EXTRA_FIELD = "extraField";
var PROPERTY_NAME_EXTRA_FIELD_INFOZIP = "extraFieldInfoZip";
var PROPERTY_NAME_EXTRA_FIELD_UNIX = "extraFieldUnix";
var PROPERTY_NAME_UID = "uid";
var PROPERTY_NAME_GID = "gid";
var PROPERTY_NAME_UNIX_MODE = "unixMode";
var PROPERTY_NAME_SETUID = "setuid";
var PROPERTY_NAME_SETGID = "setgid";
var PROPERTY_NAME_STICKY = "sticky";
var PROPERTY_NAME_BITFLAG = "bitFlag";
var PROPERTY_NAME_FILENAME_UTF8 = "filenameUTF8";
var PROPERTY_NAME_COMMENT_UTF8 = "commentUTF8";
var PROPERTY_NAME_RAW_EXTRA_FIELD = "rawExtraField";
var PROPERTY_NAME_EXTRA_FIELD_ZIP64 = "extraFieldZip64";
var PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH = "extraFieldUnicodePath";
var PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT = "extraFieldUnicodeComment";
var PROPERTY_NAME_EXTRA_FIELD_AES = "extraFieldAES";
var PROPERTY_NAME_EXTRA_FIELD_NTFS = "extraFieldNTFS";
var PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP = "extraFieldExtendedTimestamp";
var PROPERTY_NAMES = [
  PROPERTY_NAME_FILENAME,
  PROPERTY_NAME_RAW_FILENAME,
  PROPERTY_NAME_UNCOMPRESSED_SIZE,
  PROPERTY_NAME_COMPRESSED_SIZE,
  PROPERTY_NAME_LAST_MODIFICATION_DATE,
  PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE,
  PROPERTY_NAME_COMMENT,
  PROPERTY_NAME_RAW_COMMENT,
  PROPERTY_NAME_LAST_ACCESS_DATE,
  PROPERTY_NAME_CREATION_DATE,
  PROPERTY_NAME_RAW_CREATION_DATE,
  PROPERTY_NAME_OFFSET,
  PROPERTY_NAME_DISK_NUMBER_START,
  PROPERTY_NAME_INTERNAL_FILE_ATTRIBUTES,
  PROPERTY_NAME_EXTERNAL_FILE_ATTRIBUTES,
  PROPERTY_NAME_MSDOS_ATTRIBUTES_RAW,
  PROPERTY_NAME_MSDOS_ATTRIBUTES,
  PROPERTY_NAME_MS_DOS_COMPATIBLE,
  PROPERTY_NAME_ZIP64,
  PROPERTY_NAME_ENCRYPTED,
  PROPERTY_NAME_VERSION,
  PROPERTY_NAME_VERSION_MADE_BY,
  PROPERTY_NAME_ZIPCRYPTO,
  PROPERTY_NAME_DIRECTORY,
  PROPERTY_NAME_EXECUTABLE,
  PROPERTY_NAME_COMPRESSION_METHOD,
  PROPERTY_NAME_SIGNATURE,
  PROPERTY_NAME_EXTRA_FIELD,
  PROPERTY_NAME_EXTRA_FIELD_UNIX,
  PROPERTY_NAME_EXTRA_FIELD_INFOZIP,
  PROPERTY_NAME_UID,
  PROPERTY_NAME_GID,
  PROPERTY_NAME_UNIX_MODE,
  PROPERTY_NAME_SETUID,
  PROPERTY_NAME_SETGID,
  PROPERTY_NAME_STICKY,
  PROPERTY_NAME_BITFLAG,
  PROPERTY_NAME_FILENAME_UTF8,
  PROPERTY_NAME_COMMENT_UTF8,
  PROPERTY_NAME_RAW_EXTRA_FIELD,
  PROPERTY_NAME_EXTRA_FIELD_ZIP64,
  PROPERTY_NAME_EXTRA_FIELD_UNICODE_PATH,
  PROPERTY_NAME_EXTRA_FIELD_UNICODE_COMMENT,
  PROPERTY_NAME_EXTRA_FIELD_AES,
  PROPERTY_NAME_EXTRA_FIELD_NTFS,
  PROPERTY_NAME_EXTRA_FIELD_EXTENDED_TIMESTAMP
];
var Entry = class {
  constructor(data) {
    PROPERTY_NAMES.forEach((name) => this[name] = data[name]);
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/options.js
var OPTION_FILENAME_ENCODING = "filenameEncoding";
var OPTION_COMMENT_ENCODING = "commentEncoding";
var OPTION_DECODE_TEXT = "decodeText";
var OPTION_EXTRACT_PREPENDED_DATA = "extractPrependedData";
var OPTION_EXTRACT_APPENDED_DATA = "extractAppendedData";
var OPTION_PASSWORD = "password";
var OPTION_RAW_PASSWORD = "rawPassword";
var OPTION_PASS_THROUGH = "passThrough";
var OPTION_SIGNAL = "signal";
var OPTION_CHECK_PASSWORD_ONLY = "checkPasswordOnly";
var OPTION_CHECK_OVERLAPPING_ENTRY_ONLY = "checkOverlappingEntryOnly";
var OPTION_CHECK_OVERLAPPING_ENTRY = "checkOverlappingEntry";
var OPTION_CHECK_SIGNATURE = "checkSignature";
var OPTION_USE_WEB_WORKERS = "useWebWorkers";
var OPTION_USE_COMPRESSION_STREAM = "useCompressionStream";
var OPTION_TRANSFER_STREAMS = "transferStreams";
var OPTION_PREVENT_CLOSE = "preventClose";

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-reader.js
var ERR_BAD_FORMAT = "File format is not recognized";
var ERR_EOCDR_NOT_FOUND = "End of central directory not found";
var ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = "End of Zip64 central directory locator not found";
var ERR_CENTRAL_DIRECTORY_NOT_FOUND = "Central directory header not found";
var ERR_LOCAL_FILE_HEADER_NOT_FOUND = "Local file header not found";
var ERR_EXTRAFIELD_ZIP64_NOT_FOUND = "Zip64 extra field not found";
var ERR_ENCRYPTED = "File contains encrypted entry";
var ERR_UNSUPPORTED_ENCRYPTION = "Encryption method not supported";
var ERR_UNSUPPORTED_COMPRESSION = "Compression method not supported";
var ERR_SPLIT_ZIP_FILE = "Split zip file";
var ERR_OVERLAPPING_ENTRY = "Overlapping entry found";
var CHARSET_UTF8 = "utf-8";
var PROPERTY_NAME_UTF8_SUFFIX = "UTF8";
var CHARSET_CP437 = "cp437";
var ZIP64_PROPERTIES = [
  [PROPERTY_NAME_UNCOMPRESSED_SIZE, MAX_32_BITS],
  [PROPERTY_NAME_COMPRESSED_SIZE, MAX_32_BITS],
  [PROPERTY_NAME_OFFSET, MAX_32_BITS],
  [PROPERTY_NAME_DISK_NUMBER_START, MAX_16_BITS]
];
var ZIP64_EXTRACTION = {
  [MAX_16_BITS]: {
    getValue: getUint32,
    bytes: 4
  },
  [MAX_32_BITS]: {
    getValue: getBigUint64,
    bytes: 8
  }
};
var ZipReader = class {
  constructor(reader, options = {}) {
    Object.assign(this, {
      reader: new GenericReader(reader),
      options,
      config: getConfiguration(),
      readRanges: []
    });
  }
  async *getEntriesGenerator(options = {}) {
    const zipReader = this;
    let { reader } = zipReader;
    const { config: config2 } = zipReader;
    await initStream(reader);
    if (reader.size === UNDEFINED_VALUE || !reader.readUint8Array) {
      reader = new BlobReader(await new Response(reader.readable).blob());
      await initStream(reader);
    }
    if (reader.size < END_OF_CENTRAL_DIR_LENGTH) {
      throw new Error(ERR_BAD_FORMAT);
    }
    reader.chunkSize = getChunkSize(config2);
    const endOfDirectoryInfo = await seekSignature(reader, END_OF_CENTRAL_DIR_SIGNATURE, reader.size, END_OF_CENTRAL_DIR_LENGTH, MAX_16_BITS * 16);
    if (!endOfDirectoryInfo) {
      const signatureArray = await readUint8Array(reader, 0, 4);
      const signatureView = getDataView(signatureArray);
      if (getUint32(signatureView) == SPLIT_ZIP_FILE_SIGNATURE) {
        throw new Error(ERR_SPLIT_ZIP_FILE);
      } else {
        throw new Error(ERR_EOCDR_NOT_FOUND);
      }
    }
    const endOfDirectoryView = getDataView(endOfDirectoryInfo);
    let directoryDataLength = getUint32(endOfDirectoryView, 12);
    let directoryDataOffset = getUint32(endOfDirectoryView, 16);
    const commentOffset = endOfDirectoryInfo.offset;
    const commentLength = getUint16(endOfDirectoryView, 20);
    const appendedDataOffset = commentOffset + END_OF_CENTRAL_DIR_LENGTH + commentLength;
    let lastDiskNumber = getUint16(endOfDirectoryView, 4);
    const expectedLastDiskNumber = reader.lastDiskNumber || 0;
    let diskNumber = getUint16(endOfDirectoryView, 6);
    let filesLength = getUint16(endOfDirectoryView, 8);
    let prependedDataLength = 0;
    let startOffset = 0;
    if (directoryDataOffset == MAX_32_BITS || directoryDataLength == MAX_32_BITS || filesLength == MAX_16_BITS || diskNumber == MAX_16_BITS) {
      const endOfDirectoryLocatorArray = await readUint8Array(reader, endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH, ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH);
      const endOfDirectoryLocatorView = getDataView(endOfDirectoryLocatorArray);
      if (getUint32(endOfDirectoryLocatorView, 0) == ZIP64_END_OF_CENTRAL_DIR_LOCATOR_SIGNATURE) {
        directoryDataOffset = getBigUint64(endOfDirectoryLocatorView, 8);
        let endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
        let endOfDirectoryView2 = getDataView(endOfDirectoryArray);
        const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - ZIP64_END_OF_CENTRAL_DIR_LOCATOR_LENGTH - ZIP64_END_OF_CENTRAL_DIR_LENGTH;
        if (getUint32(endOfDirectoryView2, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
          const originalDirectoryDataOffset = directoryDataOffset;
          directoryDataOffset = expectedDirectoryDataOffset;
          if (directoryDataOffset > originalDirectoryDataOffset) {
            prependedDataLength = directoryDataOffset - originalDirectoryDataOffset;
          }
          endOfDirectoryArray = await readUint8Array(reader, directoryDataOffset, ZIP64_END_OF_CENTRAL_DIR_LENGTH, -1);
          endOfDirectoryView2 = getDataView(endOfDirectoryArray);
        }
        if (getUint32(endOfDirectoryView2, 0) != ZIP64_END_OF_CENTRAL_DIR_SIGNATURE) {
          throw new Error(ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND);
        }
        if (lastDiskNumber == MAX_16_BITS) {
          lastDiskNumber = getUint32(endOfDirectoryView2, 16);
        }
        if (diskNumber == MAX_16_BITS) {
          diskNumber = getUint32(endOfDirectoryView2, 20);
        }
        if (filesLength == MAX_16_BITS) {
          filesLength = getBigUint64(endOfDirectoryView2, 32);
        }
        if (directoryDataLength == MAX_32_BITS) {
          directoryDataLength = getBigUint64(endOfDirectoryView2, 40);
        }
        directoryDataOffset -= directoryDataLength;
      }
    }
    if (directoryDataOffset >= reader.size) {
      prependedDataLength = reader.size - directoryDataOffset - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
      directoryDataOffset = reader.size - directoryDataLength - END_OF_CENTRAL_DIR_LENGTH;
    }
    if (expectedLastDiskNumber != lastDiskNumber) {
      throw new Error(ERR_SPLIT_ZIP_FILE);
    }
    if (directoryDataOffset < 0) {
      throw new Error(ERR_BAD_FORMAT);
    }
    let offset = 0;
    let directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
    let directoryView = getDataView(directoryArray);
    if (directoryDataLength) {
      const expectedDirectoryDataOffset = endOfDirectoryInfo.offset - directoryDataLength;
      if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE && directoryDataOffset != expectedDirectoryDataOffset) {
        const originalDirectoryDataOffset = directoryDataOffset;
        directoryDataOffset = expectedDirectoryDataOffset;
        if (directoryDataOffset > originalDirectoryDataOffset) {
          prependedDataLength += directoryDataOffset - originalDirectoryDataOffset;
        }
        directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
        directoryView = getDataView(directoryArray);
      }
    }
    const expectedDirectoryDataLength = endOfDirectoryInfo.offset - directoryDataOffset - (reader.lastDiskOffset || 0);
    if (directoryDataLength != expectedDirectoryDataLength && expectedDirectoryDataLength >= 0) {
      directoryDataLength = expectedDirectoryDataLength;
      directoryArray = await readUint8Array(reader, directoryDataOffset, directoryDataLength, diskNumber);
      directoryView = getDataView(directoryArray);
    }
    if (directoryDataOffset < 0 || directoryDataOffset >= reader.size) {
      throw new Error(ERR_BAD_FORMAT);
    }
    const filenameEncoding = getOptionValue(zipReader, options, OPTION_FILENAME_ENCODING);
    const commentEncoding = getOptionValue(zipReader, options, OPTION_COMMENT_ENCODING);
    for (let indexFile = 0; indexFile < filesLength; indexFile++) {
      const fileEntry = new ZipEntry(reader, config2, zipReader.options);
      if (getUint32(directoryView, offset) != CENTRAL_FILE_HEADER_SIGNATURE) {
        throw new Error(ERR_CENTRAL_DIRECTORY_NOT_FOUND);
      }
      readCommonHeader(fileEntry, directoryView, offset + 6);
      const languageEncodingFlag = Boolean(fileEntry.bitFlag.languageEncodingFlag);
      const filenameOffset = offset + 46;
      const extraFieldOffset = filenameOffset + fileEntry.filenameLength;
      const commentOffset2 = extraFieldOffset + fileEntry.extraFieldLength;
      const versionMadeBy = getUint16(directoryView, offset + 4);
      const msDosCompatible = versionMadeBy >> 8 == 0;
      const unixCompatible = versionMadeBy >> 8 == 3;
      const rawFilename = directoryArray.subarray(filenameOffset, extraFieldOffset);
      const commentLength2 = getUint16(directoryView, offset + 32);
      const endOffset = commentOffset2 + commentLength2;
      const rawComment = directoryArray.subarray(commentOffset2, endOffset);
      const filenameUTF8 = languageEncodingFlag;
      const commentUTF8 = languageEncodingFlag;
      const externalFileAttributes = getUint32(directoryView, offset + 38);
      const msdosAttributesRaw = externalFileAttributes & MAX_8_BITS;
      const msdosAttributes = {
        readOnly: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_READONLY_MASK),
        hidden: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_HIDDEN_MASK),
        system: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_SYSTEM_MASK),
        directory: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_DIR_MASK),
        archive: Boolean(msdosAttributesRaw & FILE_ATTR_MSDOS_ARCHIVE_MASK)
      };
      const offsetFileEntry = getUint32(directoryView, offset + 42) + prependedDataLength;
      const decode = getOptionValue(zipReader, options, OPTION_DECODE_TEXT) || decodeText;
      const rawFilenameEncoding = filenameUTF8 ? CHARSET_UTF8 : filenameEncoding || CHARSET_CP437;
      const rawCommentEncoding = commentUTF8 ? CHARSET_UTF8 : commentEncoding || CHARSET_CP437;
      let filename = decode(rawFilename, rawFilenameEncoding);
      if (filename === UNDEFINED_VALUE) {
        filename = decodeText(rawFilename, rawFilenameEncoding);
      }
      let comment = decode(rawComment, rawCommentEncoding);
      if (comment === UNDEFINED_VALUE) {
        comment = decodeText(rawComment, rawCommentEncoding);
      }
      Object.assign(fileEntry, {
        versionMadeBy,
        msDosCompatible,
        compressedSize: 0,
        uncompressedSize: 0,
        commentLength: commentLength2,
        offset: offsetFileEntry,
        diskNumberStart: getUint16(directoryView, offset + 34),
        internalFileAttributes: getUint16(directoryView, offset + 36),
        externalFileAttributes,
        msdosAttributesRaw,
        msdosAttributes,
        rawFilename,
        filenameUTF8,
        commentUTF8,
        rawExtraField: directoryArray.subarray(extraFieldOffset, commentOffset2),
        rawComment,
        filename,
        comment
      });
      startOffset = Math.max(offsetFileEntry, startOffset);
      readCommonFooter(fileEntry, fileEntry, directoryView, offset + 6);
      const unixExternalUpper = fileEntry.externalFileAttributes >> 16 & MAX_16_BITS;
      if (fileEntry.unixMode === UNDEFINED_VALUE && (unixExternalUpper & (FILE_ATTR_UNIX_DEFAULT_MASK | FILE_ATTR_UNIX_EXECUTABLE_MASK | FILE_ATTR_UNIX_TYPE_DIR)) != 0) {
        fileEntry.unixMode = unixExternalUpper;
      }
      const setuid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETUID_MASK);
      const setgid = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_SETGID_MASK);
      const sticky = Boolean(fileEntry.unixMode & FILE_ATTR_UNIX_STICKY_MASK);
      const executable = fileEntry.unixMode !== UNDEFINED_VALUE ? (fileEntry.unixMode & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0 : unixCompatible && (unixExternalUpper & FILE_ATTR_UNIX_EXECUTABLE_MASK) != 0;
      const modeIsDir = fileEntry.unixMode !== UNDEFINED_VALUE && (fileEntry.unixMode & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR;
      const upperIsDir = (unixExternalUpper & FILE_ATTR_UNIX_TYPE_MASK) == FILE_ATTR_UNIX_TYPE_DIR;
      Object.assign(fileEntry, {
        setuid,
        setgid,
        sticky,
        unixExternalUpper,
        internalFileAttribute: fileEntry.internalFileAttributes,
        externalFileAttribute: fileEntry.externalFileAttributes,
        executable,
        directory: modeIsDir || upperIsDir || msDosCompatible && msdosAttributes.directory || filename.endsWith(DIRECTORY_SIGNATURE) && !fileEntry.uncompressedSize,
        zipCrypto: fileEntry.encrypted && !fileEntry.extraFieldAES
      });
      const entry = new Entry(fileEntry);
      entry.getData = (writer, options2) => fileEntry.getData(writer, entry, zipReader.readRanges, options2);
      entry.arrayBuffer = async (options2) => {
        const writer = new TransformStream();
        const [arrayBuffer] = await Promise.all([
          new Response(writer.readable).arrayBuffer(),
          fileEntry.getData(writer, entry, zipReader.readRanges, options2)
        ]);
        return arrayBuffer;
      };
      offset = endOffset;
      const { onprogress } = options;
      if (onprogress) {
        try {
          await onprogress(indexFile + 1, filesLength, new Entry(fileEntry));
        } catch {
        }
      }
      yield entry;
    }
    const extractPrependedData = getOptionValue(zipReader, options, OPTION_EXTRACT_PREPENDED_DATA);
    const extractAppendedData = getOptionValue(zipReader, options, OPTION_EXTRACT_APPENDED_DATA);
    if (extractPrependedData) {
      zipReader.prependedData = startOffset > 0 ? await readUint8Array(reader, 0, startOffset) : new Uint8Array();
    }
    zipReader.comment = commentLength ? await readUint8Array(reader, commentOffset + END_OF_CENTRAL_DIR_LENGTH, commentLength) : new Uint8Array();
    if (extractAppendedData) {
      zipReader.appendedData = appendedDataOffset < reader.size ? await readUint8Array(reader, appendedDataOffset, reader.size - appendedDataOffset) : new Uint8Array();
    }
    return true;
  }
  async getEntries(options = {}) {
    const entries = [];
    for await (const entry of this.getEntriesGenerator(options)) {
      entries.push(entry);
    }
    return entries;
  }
  async close() {
  }
};
var ZipEntry = class {
  constructor(reader, config2, options) {
    Object.assign(this, {
      reader,
      config: config2,
      options
    });
  }
  async getData(writer, fileEntry, readRanges, options = {}) {
    const zipEntry = this;
    const {
      reader,
      offset,
      diskNumberStart,
      extraFieldAES,
      extraFieldZip64,
      compressionMethod,
      config: config2,
      bitFlag,
      signature,
      rawLastModDate,
      uncompressedSize,
      compressedSize
    } = zipEntry;
    const {
      dataDescriptor
    } = bitFlag;
    const localDirectory = fileEntry.localDirectory = {};
    const dataArray = await readUint8Array(reader, offset, HEADER_SIZE, diskNumberStart);
    const dataView = getDataView(dataArray);
    let password = getOptionValue(zipEntry, options, OPTION_PASSWORD);
    let rawPassword = getOptionValue(zipEntry, options, OPTION_RAW_PASSWORD);
    const passThrough = getOptionValue(zipEntry, options, OPTION_PASS_THROUGH);
    password = password && password.length && password;
    rawPassword = rawPassword && rawPassword.length && rawPassword;
    if (extraFieldAES) {
      if (extraFieldAES.originalCompressionMethod != COMPRESSION_METHOD_AES) {
        throw new Error(ERR_UNSUPPORTED_COMPRESSION);
      }
    }
    if (compressionMethod != COMPRESSION_METHOD_STORE && compressionMethod != COMPRESSION_METHOD_DEFLATE && compressionMethod != COMPRESSION_METHOD_DEFLATE_64 && !passThrough) {
      throw new Error(ERR_UNSUPPORTED_COMPRESSION);
    }
    if (getUint32(dataView, 0) != LOCAL_FILE_HEADER_SIGNATURE) {
      throw new Error(ERR_LOCAL_FILE_HEADER_NOT_FOUND);
    }
    readCommonHeader(localDirectory, dataView, 4);
    const {
      extraFieldLength,
      filenameLength,
      lastAccessDate,
      creationDate
    } = localDirectory;
    localDirectory.rawExtraField = extraFieldLength ? await readUint8Array(reader, offset + HEADER_SIZE + filenameLength, extraFieldLength, diskNumberStart) : new Uint8Array();
    readCommonFooter(zipEntry, localDirectory, dataView, 4, true);
    Object.assign(fileEntry, { lastAccessDate, creationDate });
    const encrypted = zipEntry.encrypted && localDirectory.encrypted && !passThrough;
    const zipCrypto = encrypted && !extraFieldAES;
    if (!passThrough) {
      fileEntry.zipCrypto = zipCrypto;
    }
    if (encrypted) {
      if (!zipCrypto && extraFieldAES.strength === UNDEFINED_VALUE) {
        throw new Error(ERR_UNSUPPORTED_ENCRYPTION);
      } else if (!password && !rawPassword) {
        throw new Error(ERR_ENCRYPTED);
      }
    }
    const dataOffset = offset + HEADER_SIZE + filenameLength + extraFieldLength;
    const size = compressedSize;
    const readable = reader.readable;
    Object.assign(readable, {
      diskNumberStart,
      offset: dataOffset,
      size
    });
    const signal = getOptionValue(zipEntry, options, OPTION_SIGNAL);
    const checkPasswordOnly = getOptionValue(zipEntry, options, OPTION_CHECK_PASSWORD_ONLY);
    let checkOverlappingEntry = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY);
    const checkOverlappingEntryOnly = getOptionValue(zipEntry, options, OPTION_CHECK_OVERLAPPING_ENTRY_ONLY);
    if (checkOverlappingEntryOnly) {
      checkOverlappingEntry = true;
    }
    const { onstart, onprogress, onend } = options;
    const deflate64 = compressionMethod == COMPRESSION_METHOD_DEFLATE_64;
    let useCompressionStream = getOptionValue(zipEntry, options, OPTION_USE_COMPRESSION_STREAM);
    if (deflate64) {
      useCompressionStream = false;
    }
    const workerOptions = {
      options: {
        codecType: CODEC_INFLATE,
        password,
        rawPassword,
        zipCrypto,
        encryptionStrength: extraFieldAES && extraFieldAES.strength,
        signed: getOptionValue(zipEntry, options, OPTION_CHECK_SIGNATURE) && !passThrough,
        passwordVerification: zipCrypto && (dataDescriptor ? rawLastModDate >>> 8 & MAX_8_BITS : signature >>> 24 & MAX_8_BITS),
        outputSize: passThrough ? compressedSize : uncompressedSize,
        signature,
        compressed: compressionMethod != 0 && !passThrough,
        encrypted: zipEntry.encrypted && !passThrough,
        useWebWorkers: getOptionValue(zipEntry, options, OPTION_USE_WEB_WORKERS),
        useCompressionStream,
        transferStreams: getOptionValue(zipEntry, options, OPTION_TRANSFER_STREAMS),
        deflate64,
        checkPasswordOnly
      },
      config: config2,
      streamOptions: { signal, size, onstart, onprogress, onend }
    };
    if (checkOverlappingEntry) {
      await detectOverlappingEntry({
        reader,
        fileEntry,
        offset,
        diskNumberStart,
        signature,
        compressedSize,
        uncompressedSize,
        dataOffset,
        dataDescriptor: dataDescriptor || localDirectory.bitFlag.dataDescriptor,
        extraFieldZip64: extraFieldZip64 || localDirectory.extraFieldZip64,
        readRanges
      });
    }
    let writable;
    try {
      if (!checkOverlappingEntryOnly) {
        if (checkPasswordOnly) {
          writer = new WritableStream();
        }
        writer = new GenericWriter(writer);
        await initStream(writer, passThrough ? compressedSize : uncompressedSize);
        ({ writable } = writer);
        const { outputSize } = await runWorker2({ readable, writable }, workerOptions);
        writer.size += outputSize;
        if (outputSize != (passThrough ? compressedSize : uncompressedSize)) {
          throw new Error(ERR_INVALID_UNCOMPRESSED_SIZE);
        }
      }
    } catch (error) {
      if (error.outputSize !== UNDEFINED_VALUE) {
        writer.size += error.outputSize;
      }
      if (!checkPasswordOnly || error.message != ERR_ABORT_CHECK_PASSWORD) {
        throw error;
      }
    } finally {
      const preventClose = getOptionValue(zipEntry, options, OPTION_PREVENT_CLOSE);
      if (!preventClose && writable && !writable.locked) {
        await writable.getWriter().close();
      }
    }
    return checkPasswordOnly || checkOverlappingEntryOnly ? UNDEFINED_VALUE : writer.getData ? writer.getData() : writable;
  }
};
function readCommonHeader(directory, dataView, offset) {
  const rawBitFlag = directory.rawBitFlag = getUint16(dataView, offset + 2);
  const encrypted = (rawBitFlag & BITFLAG_ENCRYPTED) == BITFLAG_ENCRYPTED;
  const rawLastModDate = getUint32(dataView, offset + 6);
  Object.assign(directory, {
    encrypted,
    version: getUint16(dataView, offset),
    bitFlag: {
      level: (rawBitFlag & BITFLAG_LEVEL) >> 1,
      dataDescriptor: (rawBitFlag & BITFLAG_DATA_DESCRIPTOR) == BITFLAG_DATA_DESCRIPTOR,
      languageEncodingFlag: (rawBitFlag & BITFLAG_LANG_ENCODING_FLAG) == BITFLAG_LANG_ENCODING_FLAG
    },
    rawLastModDate,
    lastModDate: getDate(rawLastModDate),
    filenameLength: getUint16(dataView, offset + 22),
    extraFieldLength: getUint16(dataView, offset + 24)
  });
}
function readCommonFooter(fileEntry, directory, dataView, offset, localDirectory) {
  const { rawExtraField } = directory;
  const extraField = directory.extraField = /* @__PURE__ */ new Map();
  const rawExtraFieldView = getDataView(new Uint8Array(rawExtraField));
  let offsetExtraField = 0;
  try {
    while (offsetExtraField < rawExtraField.length) {
      const type = getUint16(rawExtraFieldView, offsetExtraField);
      const size = getUint16(rawExtraFieldView, offsetExtraField + 2);
      extraField.set(type, {
        type,
        data: rawExtraField.slice(offsetExtraField + 4, offsetExtraField + 4 + size)
      });
      offsetExtraField += 4 + size;
    }
  } catch {
  }
  const compressionMethod = getUint16(dataView, offset + 4);
  Object.assign(directory, {
    signature: getUint32(dataView, offset + HEADER_OFFSET_SIGNATURE),
    compressedSize: getUint32(dataView, offset + HEADER_OFFSET_COMPRESSED_SIZE),
    uncompressedSize: getUint32(dataView, offset + HEADER_OFFSET_UNCOMPRESSED_SIZE)
  });
  const extraFieldZip64 = extraField.get(EXTRAFIELD_TYPE_ZIP64);
  if (extraFieldZip64) {
    readExtraFieldZip64(extraFieldZip64, directory);
    directory.extraFieldZip64 = extraFieldZip64;
  }
  const extraFieldUnicodePath = extraField.get(EXTRAFIELD_TYPE_UNICODE_PATH);
  if (extraFieldUnicodePath) {
    readExtraFieldUnicode(extraFieldUnicodePath, PROPERTY_NAME_FILENAME, PROPERTY_NAME_RAW_FILENAME, directory, fileEntry);
    directory.extraFieldUnicodePath = extraFieldUnicodePath;
  }
  const extraFieldUnicodeComment = extraField.get(EXTRAFIELD_TYPE_UNICODE_COMMENT);
  if (extraFieldUnicodeComment) {
    readExtraFieldUnicode(extraFieldUnicodeComment, PROPERTY_NAME_COMMENT, PROPERTY_NAME_RAW_COMMENT, directory, fileEntry);
    directory.extraFieldUnicodeComment = extraFieldUnicodeComment;
  }
  const extraFieldAES = extraField.get(EXTRAFIELD_TYPE_AES);
  if (extraFieldAES) {
    readExtraFieldAES(extraFieldAES, directory, compressionMethod);
    directory.extraFieldAES = extraFieldAES;
  } else {
    directory.compressionMethod = compressionMethod;
  }
  const extraFieldNTFS = extraField.get(EXTRAFIELD_TYPE_NTFS);
  if (extraFieldNTFS) {
    readExtraFieldNTFS(extraFieldNTFS, directory);
    directory.extraFieldNTFS = extraFieldNTFS;
  }
  const extraFieldUnix = extraField.get(EXTRAFIELD_TYPE_UNIX);
  if (extraFieldUnix) {
    readExtraFieldUnix(extraFieldUnix, directory, false);
    directory.extraFieldUnix = extraFieldUnix;
  } else {
    const extraFieldInfoZip = extraField.get(EXTRAFIELD_TYPE_INFOZIP);
    if (extraFieldInfoZip) {
      readExtraFieldUnix(extraFieldInfoZip, directory, true);
      directory.extraFieldInfoZip = extraFieldInfoZip;
    }
  }
  const extraFieldExtendedTimestamp = extraField.get(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
  if (extraFieldExtendedTimestamp) {
    readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory);
    directory.extraFieldExtendedTimestamp = extraFieldExtendedTimestamp;
  }
  const extraFieldUSDZ = extraField.get(EXTRAFIELD_TYPE_USDZ);
  if (extraFieldUSDZ) {
    directory.extraFieldUSDZ = extraFieldUSDZ;
  }
}
function readExtraFieldZip64(extraFieldZip64, directory) {
  directory.zip64 = true;
  const extraFieldView = getDataView(extraFieldZip64.data);
  const missingProperties = ZIP64_PROPERTIES.filter(([propertyName, max]) => directory[propertyName] == max);
  for (let indexMissingProperty = 0, offset = 0; indexMissingProperty < missingProperties.length; indexMissingProperty++) {
    const [propertyName, max] = missingProperties[indexMissingProperty];
    if (directory[propertyName] == max) {
      const extraction = ZIP64_EXTRACTION[max];
      directory[propertyName] = extraFieldZip64[propertyName] = extraction.getValue(extraFieldView, offset);
      offset += extraction.bytes;
    } else if (extraFieldZip64[propertyName]) {
      throw new Error(ERR_EXTRAFIELD_ZIP64_NOT_FOUND);
    }
  }
}
function readExtraFieldUnicode(extraFieldUnicode, propertyName, rawPropertyName, directory, fileEntry) {
  const extraFieldView = getDataView(extraFieldUnicode.data);
  const crc32 = new Crc32();
  crc32.append(fileEntry[rawPropertyName]);
  const dataViewSignature = getDataView(new Uint8Array(4));
  dataViewSignature.setUint32(0, crc32.get(), true);
  const signature = getUint32(extraFieldView, 1);
  Object.assign(extraFieldUnicode, {
    version: getUint8(extraFieldView, 0),
    [propertyName]: decodeText(extraFieldUnicode.data.subarray(5)),
    valid: !fileEntry.bitFlag.languageEncodingFlag && signature == getUint32(dataViewSignature, 0)
  });
  if (extraFieldUnicode.valid) {
    directory[propertyName] = extraFieldUnicode[propertyName];
    directory[propertyName + PROPERTY_NAME_UTF8_SUFFIX] = true;
  }
}
function readExtraFieldAES(extraFieldAES, directory, compressionMethod) {
  const extraFieldView = getDataView(extraFieldAES.data);
  const strength = getUint8(extraFieldView, 4);
  Object.assign(extraFieldAES, {
    vendorVersion: getUint8(extraFieldView, 0),
    vendorId: getUint8(extraFieldView, 2),
    strength,
    originalCompressionMethod: compressionMethod,
    compressionMethod: getUint16(extraFieldView, 5)
  });
  directory.compressionMethod = extraFieldAES.compressionMethod;
}
function readExtraFieldNTFS(extraFieldNTFS, directory) {
  const extraFieldView = getDataView(extraFieldNTFS.data);
  let offsetExtraField = 4;
  let tag1Data;
  try {
    while (offsetExtraField < extraFieldNTFS.data.length && !tag1Data) {
      const tagValue = getUint16(extraFieldView, offsetExtraField);
      const attributeSize = getUint16(extraFieldView, offsetExtraField + 2);
      if (tagValue == EXTRAFIELD_TYPE_NTFS_TAG1) {
        tag1Data = extraFieldNTFS.data.slice(offsetExtraField + 4, offsetExtraField + 4 + attributeSize);
      }
      offsetExtraField += 4 + attributeSize;
    }
  } catch {
  }
  try {
    if (tag1Data && tag1Data.length == 24) {
      const tag1View = getDataView(tag1Data);
      const rawLastModDate = tag1View.getBigUint64(0, true);
      const rawLastAccessDate = tag1View.getBigUint64(8, true);
      const rawCreationDate = tag1View.getBigUint64(16, true);
      Object.assign(extraFieldNTFS, {
        rawLastModDate,
        rawLastAccessDate,
        rawCreationDate
      });
      const lastModDate = getDateNTFS(rawLastModDate);
      const lastAccessDate = getDateNTFS(rawLastAccessDate);
      const creationDate = getDateNTFS(rawCreationDate);
      const extraFieldData = { lastModDate, lastAccessDate, creationDate };
      Object.assign(extraFieldNTFS, extraFieldData);
      Object.assign(directory, extraFieldData);
    }
  } catch {
  }
}
function readExtraFieldUnix(extraField, directory, isInfoZip) {
  try {
    const view = getDataView(new Uint8Array(extraField.data));
    let offset = 0;
    const version = getUint8(view, offset++);
    const uidSize = getUint8(view, offset++);
    const uidBytes = extraField.data.subarray(offset, offset + uidSize);
    offset += uidSize;
    const uid = unpackUnixId(uidBytes);
    const gidSize = getUint8(view, offset++);
    const gidBytes = extraField.data.subarray(offset, offset + gidSize);
    offset += gidSize;
    const gid = unpackUnixId(gidBytes);
    let unixMode = UNDEFINED_VALUE;
    if (!isInfoZip && offset + 2 <= extraField.data.length) {
      const base = extraField.data;
      const modeView = new DataView(base.buffer, base.byteOffset + offset, 2);
      unixMode = modeView.getUint16(0, true);
    }
    Object.assign(extraField, { version, uid, gid, unixMode });
    if (uid !== UNDEFINED_VALUE) {
      directory.uid = uid;
    }
    if (gid !== UNDEFINED_VALUE) {
      directory.gid = gid;
    }
    if (unixMode !== UNDEFINED_VALUE) {
      directory.unixMode = unixMode;
    }
  } catch {
  }
}
function unpackUnixId(bytes) {
  const buffer = new Uint8Array(4);
  buffer.set(bytes, 0);
  const view = new DataView(buffer.buffer, buffer.byteOffset, 4);
  return view.getUint32(0, true);
}
function readExtraFieldExtendedTimestamp(extraFieldExtendedTimestamp, directory, localDirectory) {
  const extraFieldView = getDataView(extraFieldExtendedTimestamp.data);
  const flags = getUint8(extraFieldView, 0);
  const timeProperties = [];
  const timeRawProperties = [];
  if (localDirectory) {
    if ((flags & 1) == 1) {
      timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
      timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
    }
    if ((flags & 2) == 2) {
      timeProperties.push(PROPERTY_NAME_LAST_ACCESS_DATE);
      timeRawProperties.push(PROPERTY_NAME_RAW_LAST_ACCESS_DATE);
    }
    if ((flags & 4) == 4) {
      timeProperties.push(PROPERTY_NAME_CREATION_DATE);
      timeRawProperties.push(PROPERTY_NAME_RAW_CREATION_DATE);
    }
  } else if (extraFieldExtendedTimestamp.data.length >= 5) {
    timeProperties.push(PROPERTY_NAME_LAST_MODIFICATION_DATE);
    timeRawProperties.push(PROPERTY_NAME_RAW_LAST_MODIFICATION_DATE);
  }
  let offset = 1;
  timeProperties.forEach((propertyName, indexProperty) => {
    if (extraFieldExtendedTimestamp.data.length >= offset + 4) {
      const time = getUint32(extraFieldView, offset);
      directory[propertyName] = extraFieldExtendedTimestamp[propertyName] = new Date(time * 1e3);
      const rawPropertyName = timeRawProperties[indexProperty];
      extraFieldExtendedTimestamp[rawPropertyName] = time;
    }
    offset += 4;
  });
}
async function detectOverlappingEntry({
  reader,
  fileEntry,
  offset,
  diskNumberStart,
  signature,
  compressedSize,
  uncompressedSize,
  dataOffset,
  dataDescriptor,
  extraFieldZip64,
  readRanges
}) {
  let diskOffset = 0;
  if (diskNumberStart) {
    for (let indexReader = 0; indexReader < diskNumberStart; indexReader++) {
      const diskReader = reader.readers[indexReader];
      diskOffset += diskReader.size;
    }
  }
  let dataDescriptorLength = 0;
  if (dataDescriptor) {
    if (extraFieldZip64) {
      dataDescriptorLength = DATA_DESCRIPTOR_RECORD_ZIP_64_LENGTH;
    } else {
      dataDescriptorLength = DATA_DESCRIPTOR_RECORD_LENGTH;
    }
  }
  if (dataDescriptorLength) {
    const dataDescriptorArray = await readUint8Array(reader, dataOffset + compressedSize, dataDescriptorLength + DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH, diskNumberStart);
    const dataDescriptorSignature = getUint32(getDataView(dataDescriptorArray), 0) == DATA_DESCRIPTOR_RECORD_SIGNATURE;
    if (dataDescriptorSignature) {
      const readSignature = getUint32(getDataView(dataDescriptorArray), 4);
      let readCompressedSize;
      let readUncompressedSize;
      if (extraFieldZip64) {
        readCompressedSize = getBigUint64(getDataView(dataDescriptorArray), 8);
        readUncompressedSize = getBigUint64(getDataView(dataDescriptorArray), 16);
      } else {
        readCompressedSize = getUint32(getDataView(dataDescriptorArray), 8);
        readUncompressedSize = getUint32(getDataView(dataDescriptorArray), 12);
      }
      const matchSignature = fileEntry.encrypted && !fileEntry.zipCrypto || readSignature == signature;
      if (matchSignature && readCompressedSize == compressedSize && readUncompressedSize == uncompressedSize) {
        dataDescriptorLength += DATA_DESCRIPTOR_RECORD_SIGNATURE_LENGTH;
      }
    }
  }
  const range = {
    start: diskOffset + offset,
    end: diskOffset + dataOffset + compressedSize + dataDescriptorLength,
    fileEntry
  };
  for (const otherRange of readRanges) {
    if (otherRange.fileEntry != fileEntry && range.start >= otherRange.start && range.start < otherRange.end) {
      const error = new Error(ERR_OVERLAPPING_ENTRY);
      error.overlappingEntry = otherRange.fileEntry;
      throw error;
    }
  }
  readRanges.push(range);
}
async function seekSignature(reader, signature, startOffset, minimumBytes, maximumLength) {
  const signatureArray = new Uint8Array(4);
  const signatureView = getDataView(signatureArray);
  setUint32(signatureView, 0, signature);
  const maximumBytes = minimumBytes + maximumLength;
  return await seek(minimumBytes) || await seek(Math.min(maximumBytes, startOffset));
  async function seek(length) {
    const offset = startOffset - length;
    const bytes = await readUint8Array(reader, offset, length);
    for (let indexByte = bytes.length - minimumBytes; indexByte >= 0; indexByte--) {
      if (bytes[indexByte] == signatureArray[0] && bytes[indexByte + 1] == signatureArray[1] && bytes[indexByte + 2] == signatureArray[2] && bytes[indexByte + 3] == signatureArray[3]) {
        return {
          offset: offset + indexByte,
          buffer: bytes.slice(indexByte, indexByte + minimumBytes).buffer
        };
      }
    }
  }
}
function getOptionValue(zipReader, options, name) {
  return options[name] === UNDEFINED_VALUE ? zipReader.options[name] : options[name];
}
function getDate(timeRaw) {
  const date = (timeRaw & 4294901760) >> 16, time = timeRaw & MAX_16_BITS;
  try {
    return new Date(1980 + ((date & 65024) >> 9), ((date & 480) >> 5) - 1, date & 31, (time & 63488) >> 11, (time & 2016) >> 5, (time & 31) * 2, 0);
  } catch {
  }
}
function getDateNTFS(timeRaw) {
  return new Date(Number(timeRaw / BigInt(1e4) - BigInt(116444736e5)));
}
function getUint8(view, offset) {
  return view.getUint8(offset);
}
function getUint16(view, offset) {
  return view.getUint16(offset, true);
}
function getUint32(view, offset) {
  return view.getUint32(offset, true);
}
function getBigUint64(view, offset) {
  return Number(view.getBigUint64(offset, true));
}
function setUint32(view, offset, value) {
  view.setUint32(offset, value, true);
}
function getDataView(array) {
  return new DataView(array.buffer);
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zip-writer.js
var EXTRAFIELD_DATA_AES = new Uint8Array([7, 0, 2, 0, 65, 69, 3, 0, 0]);

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-core-base.js
var import_meta = {};
try {
  configure({ baseURI: import_meta.url });
} catch {
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/zlib-streams-inline.js
var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function g(g2) {
  let B;
  g2({ wasmURI: () => (B || (B = "data:application/wasm;base64," + ((g3) => {
    g3 = ((g4) => {
      const B3 = (g4 = (g4 + "").replace(/[^A-Za-z0-9+/=]/g, "")).length, E2 = [];
      for (let I2 = 0; B3 > I2; I2 += 4) {
        const B4 = A.indexOf(g4[I2]) << 18 | A.indexOf(g4[I2 + 1]) << 12 | (63 & A.indexOf(g4[I2 + 2])) << 6 | 63 & A.indexOf(g4[I2 + 3]);
        E2.push(B4 >> 16 & 255), "=" !== g4[I2 + 2] && E2.push(B4 >> 8 & 255), "=" !== g4[I2 + 3] && E2.push(255 & B4);
      }
      return new Uint8Array(E2);
    })(g3);
    let B2 = new Uint8Array(1024), E = 0;
    for (let A2 = 0; A2 < g3.length; ) {
      const C = g3[A2++];
      if (128 & C) {
        const Q = 3 + (127 & C), D = g3[A2++] << 8 | g3[A2++], o = E - D;
        I(E + Q);
        for (let A3 = 0; Q > A3; A3++) B2[E++] = B2[o + A3];
      } else {
        const Q = C;
        I(E + Q);
        for (let I2 = 0; Q > I2 && A2 < g3.length; I2++) B2[E++] = g3[A2++];
      }
    }
    return ((g4) => {
      let B3 = "";
      const E2 = g4.length;
      let I2 = 0;
      for (; E2 > I2 + 2; I2 += 3) {
        const E3 = g4[I2] << 16 | g4[I2 + 1] << 8 | g4[I2 + 2];
        B3 += A[E3 >> 18 & 63] + A[E3 >> 12 & 63] + A[E3 >> 6 & 63] + A[63 & E3];
      }
      const C = E2 - I2;
      if (1 === C) {
        const E3 = g4[I2] << 16;
        B3 += A[E3 >> 18 & 63] + A[E3 >> 12 & 63] + "==";
      } else if (2 === C) {
        const E3 = g4[I2] << 16 | g4[I2 + 1] << 8;
        B3 += A[E3 >> 18 & 63] + A[E3 >> 12 & 63] + A[E3 >> 6 & 63] + "=";
      }
      return B3;
    })(new Uint8Array(B2.buffer.slice(0, E)));
    function I(A2) {
      if (B2.length < A2) {
        let g4 = 2 * B2.length;
        for (; A2 > g4; ) g4 *= 2;
        const I2 = new Uint8Array(g4);
        I2.set(B2.subarray(0, E)), B2 = I2;
      }
    }
  })("FQBhc20BAAAAAUULYAF/AX9gAn9/AIEABYAACwIDf4IABwEBgAARAQaAAAuDAA6BABUDAGAAgAADgAANAQSBABUDAGAHgwAegAAfEgNCQQcABAEABAgIAAIABQIKAIAAB4EAAwEFgQAHAgICgQAHEAEDAAUGAAMDBQQJBAQJAQaAAAEeAAIEAwIEAgIBBAcDAwQFAXABDQ0FBgEBggKCAgYIgACYIkHQ1QQLB4oEHAZtZW1vcnkCAAxpbmZsYXRlOV9uZXcABw2GAA8HaW5pdAAIEYoAEAdfcmF3AAoQhgAUCXByb2Nlc3MAC4cARgZlbmQADhaGAA8QbGFzdF9jb25zdW1lZAARC4QAGYMAbYUANoMAbAEShQBYhwBrARSFAH+DABMHZ3ppcAAVD4UAFIUAfgEWhgBWgQB9AhgVhQAOjQB8AmRliQB8hQAOggB8AhoQiQAPggB8AhsRigATggB8AhwPhQAUhQB8AR2GAFaBAHwJHwRmcmVlAAIVhQAVjACDCgZtYWxsb2MAAQuCAFUKaWFsaXplAAAZX4AADxZkaXJlY3RfZnVuY3Rpb25fdGFibGUBgAAcG2Vtc2NyaXB0ZW5fc3RhY2tfcmVzdG9yZQAFHI4AGwJnZYAAbw51cnJlbnQABiJfX2N4YYAAWwRjcmVtgAASBl9leGNlcIIAXQZyZWZjb3WAACUtPQkSAQBBAQsMACEiDA8XGR4+NTg7CqHlAkECAAu/JwELfyMAQRBrIgokAAJAjwACEiAAQfQBTQRAQaQnKAIAIgNBEIAAEgYLakH4A3GBAAkQSRsiBkEDdiIAdiIBQQNxBIEAMgYBQX9zQQGAAB8GaiICQQN0gAAZDMwnaiIAIAEoAtQnIoAABgQIIgVGggBSCSADQX4gAndxNoACphEBCyAFIAA2AgwgACAFNgIIC4AASAMIaiGAADcBIIIARoAABQRyNgIEgQAPA2oiAYEATQMEQQGBABIHDAsLIAZBrIIAnwMITQ2AABuBAIYEQQIgAIEANQUAIAJrcoAANQQAdHFogQCjA3QiAIIAj4AAH4IAj4AABosAjwUBd3EiA4YAkQECgQCRAQKEAJEBAIAAaIMAhYAACgJqIoAAjIIA3wUgBmsiBYMAjIAAGQIBaoEALgoAIAgEQCAIQXhxgQBuBCEBQbiBAKAEIQICf4AAZQEBgAAZBwN2dCIHcUWEAHgCIAeAAD6AADyBAHWBASEDCyEDgQDpgAB2gAAchACEAQGDAAeAAJyBAIuCARyAAFYCIASAADmAAP6CAHWAAQsCQaiCAQkCC0WAAQkFC2hBAnSAAOYDKSICgQEuAnhxgACqByEEIAIhAQOCAagFKAIQIgCAAIOBAAoBFIAACgENgAB+gAEQhAAqgADZgQFuBQRJIgEbgAA2gAFJASCAAAmAATgBIYEApwILIIAAVAMYIQmAABaAAAkEDCIAR4AASIAACgEIgAA3hAHGgACxAwgMCoIAKQUUIgEEf4AByAIUaoABU4EAdwMBRQ2AANkOQRBqCyEFA0AgBSEHIAGAAZoDFGohgAIFggAwAg0AgADlARCEABCAADEGDQALIAdBgABbCAAMCQtBfyEGgAAfA79/S4IAJwELgAISgAC1AiEGhAD+CAdFDQBBHyEIgAH+ggDygALEA///B4ACxoABwQEmgQJYBnZnIgBrdoICpQpBAXRrQT5qIQgLhALxAQiFATUBAYEBngIAIYECCoEAB4AAPAEZgAAdAwF2a4AAVwgIQR9HG3QhAoUBSYUBNAQDIARPgACTAQGAALcDAyIEgACGAQCAAH8BAYAARAEDgQI/ggFoAQOAAdOBAtQGHXZBBHFqggDcAkYbgAAdAgMbgABkAQKAAI+AAWSBAO6BADECBXKDAIQBBYACzwEIgQK7gADugALPAgdxgQGuAwMgAIUB4QEhgAEdggHAgAFMiAHCAQKAAb4BIYAAbIEByYMBxAEFgQAJhQFTgAGTAQGDAW8DCyIAggByAQWAATkCIASDA02AAEGBAMsBBYEB5wEIgAA5gAAJhAHngAAKjQHngAKTgAAWgwHnAQWCAeeAAA+EAecBBYIB54ABK4ACeoAA+4MB54IDgIgB54IAEIQB5wEDgwHnAQeHA9gBBYEEgoMDQ4AEpoAAjYECnwNBEE+AAI2CA4uAATKGA4ECBWqBAJOAAFeFA66BA1WAABeGA7sBBYsEQIABX4AEJwEhgAHlgANGgQA6gQNWgAN0gQCZgQNlgAJvgABKAbCCAIgCAkmAAIgBsIAAH4IAgYEALAK8J4AAA4EAG4MAiIEAN4kAjYYEMYUAS4QCSgEvgAQ/BQJ/QfwqgAA7gABTAoQrgAAIgQJoBYgrQn83gABXBoArQoCggIAAAQEEgQAOEfwqIApBDGpBcHFB2KrVqgVzgQB6ApArggEnA0HgKoMACAaAIAsiAWqABaKAAZMBa4AEXIEEmQVNDQhB3IEAZAIiBYAAZgHUggAKAQiABKMFIgkgCE2AAUcFCUlyDQmAAvmAAEUDLQAAgAKQgAJvhQX6hADYgQA5BOQqIQCDAlqBAD+BAY2AADwBCIICagNqSQ2BAtuBAhKCAkMEQQAQBIAFdwJ/RoAB+QMBIQOAAMmCAR0BQYAAk4AD+4AGIYEC/AFrgQVTAWqCAs0DcWohgABAAQOBAKsBA4QAq4EBEYMAq4ADRQNqIgeAAHGAAUoBB4AAqwEEgAAqgABfgAFjBUcNAQwFgQA4gABMgADrgQAWggJCgABTgQCVAUaABP4BAoIDFYEAioABCQVBMGogA4EAuIAB7QMMBAuDAXGBAyADIANrgQCJBwJrcSICEASDAC6ABWWAAJaCACuAAJyAAM0ERw0CC4EBaAHggQCWAkEEgQWsgAWohADpggDygQBoAXKBBSQDTXINgANTgABQgAPoCAZBKGpNDQULgADOgwDRgQDPggGsAdiCAA4BAIECTgLYKoEDSQEAgQGFgwFxAQSHAXGDANOBA2uAANUCIgWAANeCABKDAWuBAMcBtIMCe4EBSoAAewEbgQQtAbSDAr2CAmkDQegqgQYwAQCAAFCCABUFQcQnQX+BAAgCyCeDAnuBAAwB8IMCQIEB4IMGz4MHsIAGUAHUgAMQgQZYAtgngQUngAC7A0EgR4AAeYEDAQQDQShrgAAQAXiAAOkBQYECa4AB3oMDDoQHoIIGzoADdIUDCAQCakEogQNsBMAnQYyBAXuBA+CAAc6AAYEBTYEGZAJLcoMA2gQMQQhxgQAKgAHZAgVqgQAwgABRgATNAiAEggBmgAhRggN0ArAngwOPgQFPgAAtgACJgwBvgAClggBvgABWkABvAQOCARMCDAaDAAeFAT0DIAJLiAE1gwH7AQWCAYACAkCBBpmEAYKBBPeEAXoDAQwCgQWcAi0AgQCtgATgAQuEAa6BCSyDAa4BBIECaYEHPIICjAMiBUmEB1kBCIIGTJQBQAEHkAFAAQeZAUCAAGICBUGAB/iBAEEDakEvgABPgAAoAQSABUyACZQDAUEbggksCUHsKikCADcCEIAACwHkgwALAQiAABSCCVuBAHCNAiCEAgyAACABGIAEr4ICE4AAmIMEv4AABQEEgQmQgADPgQL+AyAERoEG6YMFSQF+gAnDAQSDCC+ABnaEALaCCMEBAIAI8gMCQf+BCkOAAAiECQ+AABWEClCABSqBCd+ACQ0BAoUJDYAAEYIJDYIJgoEBNgELgAbDgADagQkNgABggAZ1AkEMgAWyAQiBBS8BH4IHMwH/hAfdAQKAB92AABmQB92AALGAAMUGNgIcIARCggEPAQCABzkDQdQpgAmaggTrgwg3gAKvgQo1AQOCAIoBqIEJlwEFgwmXggllgQCPAQKACAOAAFWCCAOACGKBCAOCB9aAB6KBAi2BCt2CB3wBAoIDqoAH44EHbIEH04MDDoAH8AIiA4EG5wEFggbngQBXARCBAJqAAe8DGEEIgAcEAgQigAgsAkEMhQoHgAHTgQDwgwCBAQiDAMOACNWAACMBGIABAgEMgAA7hAbsgQLygwRHhAapgAZkAU2ACH6AAmqBB8ixBquAAyEEoCdBMIEAOYEDMIIIwIMHFoIC14ADKIIDa4UCwwFqgAYZhQBCgAmMgAaDggAVgAUFAiAIgAbsA2shB4UE4QIgA4ELboED2YoDzAEHgwUbgQDlhAvYgAHgggfzgwAxhwrrhAifjgAxgQIlgwEGgQFAgAFogQWXBANxQQGAAD+AACSACiABCYEAFoACPYIM14MClIAAEYEIzAECgwwCgwKWgAwGgAA5AXaDDJgBAoEC7IcLg4ECd4EANQMYIQaAAEaABC+BBBqCAEWCAR+BACaBAaWAACaAAB+AABiAC1iACRMBA4IJE4IB+4EJp4AAEIEJE4ALh4IKKoAGiYEJE4IEMIAAMIADV4ELGoEJuYIAMYECLAEFgwkTggqKgACSAQaACaiDAGABHIAA5AECgAW2gQoGggEpgAF+gALYgwGrAwINAYACyIMC3oEA1YUA0oEAOwIgBoAAXYEAMAEGgQAsARCBANeCAAoBFIAC5oIMCoAI5IACl4QAtYEDXoEA2YADOoEAJQEYggEEggw0gQJFgAAZARSGABkEByAJaoALzwEDgAAHgQLtAQSBA32AB02GBCSFBNWAAAoCaiCBBPaAABKDAYwBB5MEIAEHrQQggwMpgQAHhAGxgAQoAQKBAGaEBCgBB4AEKAEHkgQogAFbgALUiAQogA8mgwQogg8dhAQoggS1A3QiBYUEKIAD24MAkoYEKAEHgAQogAUHggQoAQKEDCuCBh6DAfSBDnaCBCgBB4EEKIEMC4EB7YML+4EFfYEEKIMLQIIB/IYEKIAA1gEYgAAHhADkgQDyhQEEgQZ2gwuPgwQqgQIvgQAriAEIAQuADLWCA9qCAgABCIMCQoAAZgEcgADQgADOgAJsgAJCgQ8KgACKgQJCggNdgAbvgQDiAQeEDxmBAa+DAECACgCEAkCACgiEAkCCAAqAAkCEDkoCIAiBAISDAMiCC6mAAIaABomCAMaFDC+BAkCCABkBFIUAGYAAXAMEQQ+DCmMBBIEEqYADi4cLuYMEfYYEIYEMCoQAH4AACoEEb4QAHIEFXQFqggGPgAASgwJegQFxkAJeAQSiAl6BD3aAAByAAAcBDIECzYMAB4cCXoIAZoQCXgEEgAJeAQSVBoaCADwDHCADkQaGgQMaghC1hQJYgAK0hAaAgQelgwBxARiBAJgBBJYGh4MCX4UP74AHo4QGh4IJHYEAJoEF8oECXwEHhw9VgQBeARCDEGiBA9iFAOWBAPOCBvSDBN2CABaDEH+DDaGABBuDBPKCANSBDgGDAl+CBPoBCYMCX4AAPIQCX4AB74ACX4EFZ4AAKI0CXwELgwJfhgJdAwIgCYQCXQEJhgJdggAKiAJdAQmBAIKDEEyPAl2DEHOZAl2BC/uKAl2ACXaNAl2ABQKEAB+AAAqAA5KGAl2AAm6EAl2KEeaBDjqCAYWAAmGGEeQBIIMIT4gR5ogCW4ABO4ICRoMB3IEH6YICW4IB8QEIgQb/ghHXgQ6ZgQBugQiAgQFjAQuADg4DEGokgABKBgveCwEIf4EGz4IA7AJBCIEMd4AJqAFrgwLeAXiBCzQCIQWCE5QCAXGBCa8BQYACXYEGgIEFv4AAIoAAL4MLB4AKo4ISvIME6IAE6oQHeoQG3oAHNIAAPIQJxoMG7wEEgA0ViQcygBMMhAcygQ2YggchigcfiwdFgQ3KhRAwiAcdghAwgwcdAQSAAsoBBIISF4IHHYABhIUQMIIHHYIAEIsSF4AIo4ACZoAJQ4EH9QIDR4AOUIABOIICZ4AQ9oQGf4EBHoMBxIIUbQIAD4QF8YEAmYIFUIAN6Y4HYoICwQEEhwdiAQSWB2KJAsWrB2KBAsWCARyBAsWIB2KCAsWCABmBAsWFA6MBBYQRmoEA7QEBgAHShhW7gwHigglggQHAghTZgAlrggvlhglrgA1IggEXhwENAQODAfACRw2BEXGDEE8BuIMACAEPhAmFgQ/4hAmHggBNhgmHjwBNgQ2YhQFdgQKEgAAjgQw3iwJGghJEgAF7jAl4igJGiwGagAIzghKMgQJXAQWIEoeJAleDAgOREoeAADS0AleAAg2RAkCGAOaDDlmHAjOHB1ODAjOCB1OjAjOABsSjAjOGB1WMAjOHB1WOAjOOALiAABQBCIAPz4UDJYABrYULFIELLIMWt4YHKoAE+oILFIAUhIUEz4AG9I0WtYQGq4AICIUGRYIE1oMGIYACSoEJh4AAZYQHKQEAgAcpgASzgAcpAQGDBymAAsyGCYeCBlyGBymGCYeAEzWAAucBf4sJiYMXSIIJiYMFYoABqIECpIENJYMJIpEJj4ABnoAVnYECD4YNtwEAhgmPgQzagxWKgAG7hgcwgBXRhQcwgQBdgAu9gAfpgQD3AgMihgEGgALVggD8gwEKgAAngADjgRRhAQuAAnWBEF6DBjiEARqCAY2CD/qAEZoBxIICEoAFlIASTQIgAIAPwYATTwSMCwEHgAANgQWagAXHgxBjgRJ3ggXOgAEWggXOghB3gACOhAhIgQAmgRKBhAaPhBC7AQyABm2FD4mAAZGRBcOBD4mGA32AACKBA2yEBgSCADCCB/6BAc+BGJmBA5CCDLABBIADbIEV04QWVgEEghaZiBXzAQeAAWGBBeOAATCCBNKAAUWCBeODABCFAVWLBcOAAIqHBcOCDuKAFD2EA4OBBsaFBcOBABuCBcOEAJmHBcOAAEqEA5CAAJYBHIAAUYYDkAEAhwOQgwlXiwOQhBqPggOQgA8VhgOQgQH1gwOQgAAKgAOQAQOCA5CABeWBA5CCAPoBAoIBWoEDuIMJKIADd4IBIYADuoEB8YEDx4UAGYYFr4QA7pEFtIIFhoYFtIATf4QW1oYPsqkFtIIAH4YFtJAATYEauIQBToERp4ICTYMFtIcCN4QFtIIPj5UCN4sBi4cFtIAGtIYFtIsCSIUFtIECSIgFtIACSIUFtK8CSIIFtI8CMYYA5oMFtIcCJIIFtIgCJIgFtJ0CJIkFtJoCJIIA1pACJIIA/ZACJJEAuIENVYQFtIQBrYUHUIEHaYIFtIAcY4YdrIEVzIEFtIAII4UM3oEK0IAEHoUL2YEM3oMQsoUKfIQQx4MKmIIFtIAErIYFtAEBhhtAAQKDBbSBBSeCBbSCEiGAALkDHCAAgwW0AQOFBbSAEW+GDzuBBkiAFmWGBbKAEAWDAJGEDBCCBq+CBUuABbOAAMGCBbMBA4MFs4ABH4EFs4ICDoEBqIIFswEBgQWzAQOBBbOBAAeABbOAAnqAAJWGBbMBAoMFs4QQu4AClYIBWYQA6oMGl4EGCoYa0IMTZIADXYIM4oQTgIMBDQMLC0mBBxEBkIMGe4EVGwFqgQtiAQKCCzWAAHSCA1CCF4UDIAA/gAUCAXSAHo2HE0UBf4ABTAGQhAqQAwELBoAALQYkAAsEACOAE7MCAQGABtUEQcQAEIAQGYMLyAIEa4EZj4AMOoIADoAGHgMA/AuBGM6CBWuAASMBJIEHjQU2AiAgAIASGQMLCxGAACaBAVEBfoIHxQsQEAkL2QIBA39BeoAHMARAQZQIgQBNATGBAjgBfoEcBYQAVYQEuAEggwJ8gAAKASSEAAgKKEEBQdg3IAIRA4AGVoEAVwF8gQBXgweQgADmAzYCOIUBrwQCQb/+gAAJgABlBCAAECODFg8GQR91IgNzgBlXgQKAgBQFgBYugwLSASiDDnwCdkGCGfoEAUEAToAeWYEfa4ABYIIAPYIAXAM0IAKBAj8BLIkAFIAA54EAB4ABloEAG4AI1YIN8YAAX4ADhgEwgALIgQAWATyDACsBJIAAB4AbNYIOHAFCgRtAAXCCCD8BQoAAqAE3gQ3IAkKBgwAUAcyAAOCAACsCtAqCCr4BcIMA0QFUgwAHAlBBggkNgAEJgxmBAyQRAYQBMQEcgAIsjAFtAXCAAW0BEoIB+oEA5oIXlAgEEA0L/SQBIoQhWQIUJIEBeAEZhgEkgQeMAiIShAFsAwQhE4QbV4ECNwETgARnAwAhE4IAfYEEkAHcgAs6AR+AAKcF9AVqIRWAAAgB2IAAEAEbgAAIAfCAAAgBGoMAvwIhFoEAIIAAEAMRQZyBGBkEIRxBmIIACAQdQZQrgAH4AiEegQM2A0AhCoEABwE8gQr5AUGAGDIIAkkhIEF9IQ2AAA4GBkchISATgQIYgQMvAxchEIEY+JEiCpIAAoEJjpEiNoEQgoAiGoABdxdrDhMEBQYHCAkDAgwNARkAGw8iIhQhIoIEfwVMIQYMGYYACoAW0IAACgFsgR5MgQAIASKAC9YDKAJggh8wAwxJG4AAIQQGCyAggR/agABWgAZSBA4hDQyAAZGBBMYCDQ+ADxICCHKAFeABCIEEAIIXjQMKQQKCBrQDRQ0OgRqIAWuBH5KAARADIAp0gBR4gRSggBrSgAAtAwkhCoMgzoERfoACUAMIQcGAAF6AAtKGAMuAABgBdoIWRwZrDgMAAQKABOgBHoENdIIfmAUIA0BBkIAKBoAP7QGQghokARGBICIFdGpBCDuAAjSAAAuAIFiBAF+AACcCgAKAH0YBBIAAB4MAJ4AFCYAAJwEJgQAngAALgArZhAAnApgCggBOAZiEACeDAE4BB40AToAANAGgigBJggBwhwBJgSB3gAIIA0GgK4EEewKgPIMACQMgFEGAETYBDIAFgwERgAA/gAAXgAARBwxqIBUQJBqCAFMBIIkAUgEFjABSAZyAAE4BPIECqgEcgwBKgBCZAQyAIJYDEUEgigBJgAJ2A0EBOoAEcASgKyEdgQFXAR2AA1GAA3gBiYADeAHQgAOEAViAABOAAEKAA2sCQceCBDwCQQGAAqMBIYAKNAQKQQNrgAKngRXuAiEHgQAdgQg2gSB6gAERgQHsBB8LQcSBAZuDC9ECwguBGTQB0YEAEYIcR4AASoERF4gAQ4UAPQIMGoEAGYAX/gEFgAYIAQqAGJaAAByBGa0CQR+CE66CB+mAAh+AAXaBAh8BBYQCH4MBboMS1AMFDAKABWeAAVKBAhsBBoAAVAEKggCRAR2ABZOBCHID//8DgB6CgAAJgCT3AhB2ggsuAkHdgxKfgQChggqqgAJmBBoLQcKCAEABAoEACIMSVoAE/gFEgABagAi2gABUgQOMgAQWgQBbgACzAwJBw4IAJoIC4gNEIgOCCDmCFNiAG+ACAyCBE7EBEIEACoECiYAAKoQDEYAAOQESgBWIAwMQJYMjmQFEgAWJgABkgAAtBBJqIRKBADYCayGBADuAANaBGlCAAA4CBAyBEzCEBckCDBeACNOCAz0CDUuADFmNAR2FAzyEAR2AA3QBaoMDP4IBHoEBnoMAhoEAUoABEAEfgAEXA0GBAoAaKQFkggAQAgV2gAATgAA7AzYCaIIAEAUKdkEPcYAcVQEigAkgAWCAAE4BDoMBvQEOggG9AkEegiHeAkGhigFKgAChgAAMAcWDAjoCACGABCOBBZgBbIADE4ADqgMGIAyBCpsBE4AACQcGQRNNGyEJgADLAwYgCYIN1oAAE4EhHoAALYAC44AADAV0LwGwDoIC6gEAgQLqAQOABGABAIEHZJgESQEKowRJgANhgBrygwBpgAAMhgBpgADbAgdxgQBsiwKnAQSAAMaFAquDAEEBFoMGi4AAB4AGmYEdgYEDNYAADoAGmYADcAUTIBogG4EDbAIiDoIBIQG/ghdnhgEhARaBASEBxoQCYYIBHYABKAEOgQ6AggJKA2QiD4EABwRoaiEMgADcAQuABVqAATKAHaMEKAJYdIACwQEhghVUA1AhIoABAQEJgACbgAOXggEFASKAAzwCGHGACdIHaiIjLQABIoADBoAfOIEK4YEWDoABFYABAYkDPwEJgQEVAQmFAz+AANeAAZ8GIy8BAiIIhRV/gAj3hgEmgAAMgAEfggTEgSPbgQEcAiAGgwEcAQuBFlABf4UGaIACegQQaw4CgAWHgSOUgAl6gg/AhgCMgBAwoQCMigBlAwUgC4IJsgJBh4sDswEJgAGTAQOAAvmAJpuBBmeAAgaBADOAJYmBAJiAJE2ADqCBJp2BALsDIBFqgAAeAi8Bgg7AgBYzjQCXARuoAJeEAhuAAJqACyyDAiCAAjaAAFSCDFiACnOMAFwBGqkAXAEHiABcAQeDAFwD/wBxgCc/gCeGgQIiAwQgDIAAKQILaoACFJYBEYAD3YEFPoIGKoMBuAEEgQG4gQHPgAJigwMhhALIgAWjAWyAF7mEADiCABQELwH0BIMBbwKUCooCtwEVgQK3gABxhQLrhAMAgQasAiAPjALyAaOLAvKCADuABEMBXIME8wFwgAM+gQaZggLuggChgQLwgABDAR+IAEMB8Y0AQ4QGcYYGloADNIQFkYAACwENgwBkAciFBZGBA1cC0DeJAzeCA1UBUIADyosDNwEMgAFugATjgQM3AQuLAzeBJuahAbgBC4ADNQIhD4AC+oAAQIAp14ELUwX/AXFBDoEARwMGIQyAAJ0BBoECGgMMIA+BAGYCIRiAAJUBBoABwoIAlYIBqQIgGIAAhAELgCgPAXaCAIcBD4EAhwEMgBjPgQHkgACIgAR8pwMzgQdCggOYgABGAQCAAe4BD4IAnYEB6wEPgQZlgAVkAiAMgAXeAtA3gAAvAQyDAmwBDIEALwELgQC0gA/SgQP5AkHNgwFzARGBGscBIIEmEYUGfYAACYAknQLQN4MAGwLAAIEAHAMAQdWBB+mHAaqAABwDAkHJhQdAgBnNAXGBBj4BTIUCZoIP0oAGoYoBhoAAvIQA7oAIUqIA7oICSYAAxwEGgwDOhAdLgAfiAiAGgQFagA5dAQyBAPGLBK2FAumAKDABEIMKHwEQgQDthAcUARKBB5qBAEeACR2GAkwCIBCBAI8DECASgQCCAhIMgh3lggebAQqBHJiAAdABCoIHWoAFz4QARoYAIoIAGIAHCIQAGIITBYUAGIIAEgEOlABMgAE8hAA0AQ2AAk6AAAeBC3cCQdCDAI+GCSGDCTIBCoQrvwJEIYIik5IAUIAAyYQAUIAA+AMCQcqFAZuAASEC1DeAK6mBAEABXIMCj4EACwFUkgMkAQuDAySCAp2HAySAB2miAa6CAoeBBmKBApcCIg+DKhiCAcGCB5SAAGIBC4gDHQEPgwMdAQ+GAx0BD4YDHYIDpIgDHaUCL4sDHYUCO4ACGoEDtYAEHIIDxYAAiAEhgAzCgQMlAQqFAyWJAj8BD4YC8wHxigLzhgJYgCsQAwJBy4UBYAEPhgL7ggVpAUiHAwKIAV8DIAYEgybGhQMBgRnrtQMBAUiJAwGBAHKSAv+BAKUBzIQFKYYDB4AAEYQCJQEGgAfOggBNgArEAhcggA8fAQmAAe2CGy4BCYEcvIAAGgEwgCS5gQAIAsw3gxCpAfyLBikBB4QAQQE0gCrEAQOBANaAAAyAEJEBKIAQM4MARAFrggcrggAWgAAiAWuBBtyBE1qBC0WBFIcDBkkbgQAgARKBCvyCLo2AABeBHYmBAZiHC1cBCYILNgMJIQOAAT4DEiAFgAEtgQO3gwOngQblgQf7gQFKAiIDgRJgARCAAHmAA8aBAE2AAWKFA92BFP6SAzOAAcSEAQ6BDLSFABuJA9mAA0aEACKACFKIB0GIBA6BABaEDIqBEZ4BEIMS4QEShiIFgRQ2gAblgRF9gAFBgQlygApJATyHD58BLIABXQQQIBdGgAhVgAP9gCmBgRG8gBgSgSYJgAARgCsIhBCHgBVdATiDBbyCGDeAEh6BFXACKHSBGhKAEj+BEiaAAG8COCCBFbGCHLUDLCIFggAugRGXATCCMO+CADCBKiICLAuDAfWAALuBA6QBBIEBXANrIAWADK6CIFMBNIMemQEsgBHXgwRwgAANgAHoAWqBDNSAACeBAd+AASWBASkGSSIJGyIEgAA4AQmBAGqBAeyBDPeAKH0DBGsggQAXghaAjABPggANATSAIhiACoWAARyDAKsCCUeAGWmAACmAAniAAJYBCYEdWIENZ4EpH4ASW4IRpAIIIIIRpAEEgABcgAAWgRrdAReDES2AEuSCLQUBFIAAF4EVt4ABVgEgggA6gBKxghF2gAPSgRpygABDBBtqQYCAEdyDERiCEMIBRoEAE4ASrYIUOIEOEoEwBYEIfoAAGYABKQcgDUF7IA0bginVAQ2AAJMBF4AAHwENgACZAROAAAiAAagERhshGYMokQHSgwiwAnwhgBFJARSDIBcGGQuUCQEMgBQrhhKngAEhgAjQgAAHgBMngAM0gANCAQ6CB40BEIIatwMCQUCAAY6HJ++CC3OAM+kBAoEz6YEozoEz6IAEwAEOgSBggCGaAQSABWSABh4BDYEFcoEUpYAASgELgADJgSBEAQuADc8CIA2BC+IBCYAEEwQNIAtrgy1rgAmIAU2BLUWCF5sDCSANgAx/gQjUgwArgQAngAGUARCBAEEBCYAAFQEPgBFgAnJBgSOIgAT9gAjNgCFFgCFNggAPAwwgDIYho4AEeQMIEAOBI4GDGTmCDf2DGS4DDWoigABVgABykwBQAQiDAHOEJoqBKSaFK36BAzKBAFKDIP+CAFKDGTOAAFIFCCALSQ2BKDyAAAmBAD2CBmeSAGABDYYm5YACU4EAOYIm5wEIgSUzhCssgyLSgQA5AiAIhQA7ggAsAgcggBa3hzCagRAagAeogBnCAQ2EIgmCJYOBBtWBAYiAMqwBcYABNYEigoEAooALkoEBRIAABwFrgASngAAiAwwhCoINNYMYJIAAEQEIgABhAQqMGcCBIqmGKOyAAB+BBEOABdaEI/+AADUBGIEUFYAAEwEMgRDchQBFigAmgAAfgAAYAxQiB4AWoQEMghnEgAAPARCBM4gBAYAAEIEZxAENgAVJAQ2ABLMDByIKgRnEgAEiggAwgANvgSLMgAAQAQqCADGBBU6AA56EAYaAERaBBkWCGaOAAFEBHIEA8IAYPYIZo4EBnIABZ4EZo4AAjIAAR4sZowEIiBmjAwwgEIQZowEQgQAsghmjggAKgBmjAQqCGaMBCoEFQAEYhAC1gAAoggDZARCDAQ2AEM2DANyBBo+CABkBFIYAGQESgw7OhAHKARGHAgUBEYsByoMB75ICigEShALajgA0gAIQAhIQggX/gAf5AgcLggCYgCi2gQbegQRJgBgtgSVlAxpBfIArbgEOhCPzgBBTAnEbgilIgQBMgRD2AwdLG4IAOgYJIA4gB/yAOmaAA8cBEIADFwILIoEEAocX2wE8gAAHAQ6ABceABA6AAC6ADPwCIAKDAC6CBk2BBluDF6qBACyBBluBBFODGbKACAYBEYEk9YEAHIIFKIAHO4EF24EFI4AMrYAaOYEf2gUYdHILCIEE6gUFEBALS4AZSIEXDgQEf0F+gh43gCExgQZmgQB7jRd4gAAdgDOcgwAXggZyiBePgRj8AR2JF48DIAERgAengQCcgADkBQAQAgsQhAAehBfSAUCMF74FDxATC9KBGSuHJUObGRiBCQyhGRgBtIcZGAEmgQ5DgC0QgAEFgApqgAYFA0giBIATuANBD0uCGwwDQYH+gAVDAXKIGSaCGR6CGSgBIIEAKYMZIYAARo4ZIYYAFI4ZIYAZXZ0ZJIEbaYsZJIAAtIoZJAHEtBkkAkF+jAFmAXGAAWaLABIBH4AAEowZNgEGgBk2BIBEASOEGTYBEIIZNgEXhQFCgxk2AQyEAYqEGS+BAm2GCKeCB1oBA4IHWoIOVAHAgwcYgAAHgRybgRj2AiEdgAAXgRlTgBkTghlTgAe0khlTgRlrghlTgxk7gBAWgxk7gggFARyFGSsDDiESiRjzgRSCgBlTgiGmpRknwwACgAHmgAG7A2sOH4IZZxszNDU2CgsMDQ4PEBEDAhQVASQAJhcYBD4/QEGEGWoDCwwkhgAKgSRZgBlsgw5aghl2ghopgxl2AQqBB/aBDkmAABIBDIAMGQEygwAKghZ0hgFiAgwzgRBnAQaDBQmACgQBN4oWMgEGixYyAQaBDGKBELGBEP+AIPWABKsEn5YCR4E45oEAWwEogwBZgBBNASiBBf2ABMKAHPyAAAICECeBAwcBHIAPLoAALgI7AYEpLwEQgABKBEECECeCIJ8BtYgXUIAEFYAAYgEzggCrASSBNr6AAlyAEFeAAwSABT0DdEGAgANugi39BWpBH3BFggMhggjBAwBBuYsMaIAAQgEHgRafAQiDF9EBh4AO0I0AHgIEdoEDxwNxIgmCDTiADUYCB02CAMYCIgqABwcBCoAMXYEpvgIoIIAhFgQFT3ENgBaXgAWmgjq4Aa6LDeEBA4AUYwEyiwFGATakAUaCC9aABpCCEhWTAKuAAbYEB0GAwIE9nYAAHQHYixL5gwHTASSEGF+BARiCBDKBNo+BADaAOBGBBGSBNOyDAAuAAXcDOgAIgAc+gQArAjoAhDv/gQGagwGPgh0kAwJBtoUTRYEIwAEGgwDbgxlvA0UNNaUA24gAmIEOToEMtwMtABWCJPSLAJSCCIaKAIoBBIYAigG3kACKhQFlgAwMrgCKgAD3gyK8ggFzgSAWmQCYgQKskwEiAbiLAJiBACSAPBsDQYAIgQGnAQeCERmFAKmBAASLAKiABLyAL4CKAKiDGqKCFq4BNoIamIICfYATlIEAvIENJYAP34EI8YIDV4AAaIEAo4AFvIUArgEogACugBvykQCuAgwohQECgQAngg2oARCAABSKAdQBMqcCr4AICoECWoADh4ADj4A8y4ECc4QDlQQYdnJygwPpgghuATCAAScBvo8BJ4EQVYMIrYEIloAC7I8O8YARF4UO8QRBAiEXgAEShgRKASiMAGGDFHsDCyAdgB8UAg0vhB5PgRohjBoGgBhuhBoGAQ+KGgaFAOyGGgaHAOmkHk+BHkeABjsCpDyAAE+BDG+BHWWCD+7/HlyXHlwFqDxBsDyCJqEBzYAABIEACoACM4keXYAAGIAAEoAeFQMUECmgHl4BrIAAUAHNggfagikfARCJHl+KAEuAASiCHmCBAdIBqIEBK48eX4AAQoceX4MXxYE7jIAR8AEGjR4bATKfHlSTADkBKoEAGYQeVIAZlrceVIAATgMGDDCpHkoBBoEAfZMeRAEGhBizAgwtnh5AAQ6AAAoBDoIeQAINLIANIZIeMwEMgA+mgQApAWuAEDyLHjOBBBOFHjMBJ4MEC4IPyoAECwErqAQLkh4hgTmHjx4jgAGbAWCAAD+AHiOBAYyCHiMEBUEeSYEl+wFNhQfBix4qASeKHiqACNeIHiqAFZqDHiqAGWGCHiqDGCcBC4MeKoIcm4QeKoEa440eKoBFTIEeKpgEJIAbR6EEJAEKgQBpgAS0gQBpgAAMjx4qiwJ9AQiAAMaLHioBFYMLkYAAB4geKoAADoALnwIhDYgeLoADOgIiFoIBJYweLgEmkR4ugR5DiR4qgQHhgBGrgT0piBrzARODGvMBGIYWcAEGggEFgRdSARODF88BGYEXT4AdNIQXz4AAvaQeKgEZgR4qhjOpAQ2IASaAAAyFHHIDBSAKggEcAiAKgwEcAQ2LHiqAPQqFHiqAHbyAAn2CAeIBCIQXCIEUcaMX2ocAZQMFIA2eHiqAFOGAAgaBADOMHioBBIIAu4oeKoAgB40AlwEkqACXhAIbgACagBEXgwIghx4qgBnHjQBcASOpAFyAHiqGAFyCHiqAEkSEHiqAA04BC4AA8oEVnwENmx4qggglgQUNhQG4ggZKgQHPgBHwgwQmhALIgBLdph4qASWIHiqBAuuEAwCIHiqHAu6MHiqCADugHioBHogAQ4weKoIAQ4YeJAEWhx4kAwUMK4keJAQEQQZJgBGXA4ICSYIM3aYIsIAFjAIOaoAFFAFrgBo3gQV9AhJrgSgDgRaRgQ7CghaJAxwiDYEXF4ADkoEWwQQgaiEhgAOXgAAMgxtmASKDAA2DA6QBI4EACwFUgAOkgAAHA1AhGYEABwFAgQLIgQ7QAQOBAAeBFheAAAcDMCEkgga/AQ6BA3KFBrSAMJuAAAuBPrgCCGqAGKGCRckBcoIKeYEDTwILIIAroQIgI4ID6oE9DIRBLwEGgQP0gAzngRl0AgR2gQQWgRuUggHKgBtZAy0AAoEZSIEjIoAcU4ADBIADpoEK8QEGgRshAQmAEhWCHdGCAC6CBO2CA9OBEB+CAJiBIYCBAt2CBk0BCogAqIIAnAIIaoAAT4IAeYABAgEEghqmgTyKgBoEgACJgTF+hADfAQqGAv+BAAuGAN+BHPOAANiBIeOBAOYBC4IEyQEihADfhwDbAQiDG+kBCIEDFIIA24AWuIFK9wF/gACWgQC7hEUegRt/ggOIiQNsgQXvghDsgD8SAQOAGuYBGoMAgQEDhAAfgS7tgQA4gACHgQNhgAC3gwBsgwFHgAEighuAgwDaAWqABVgDDCAfgBjwgxs/gBo+gRkcASSBGzyAAdABxIEbPIAbOoAGaoEdGYEXa4EBVAMOICCAACiDB4KAAIkBC4EFmQMOICGDABSBABGAAESBIhaBGQiBLWeCAbKCGvqDAbKCJUSCBpCBQrGBFawBDoEaioEAfIAUzgIiB4AXcaIANoAWOoEEYIAANANrIQmBFnYBDoEET4EAhYAAB4AUuYEZh6sASYABKwEJgQRuAwlBA4EXlogAOoIBtwE6gAFnhQJ/gBT9gQU7AQmAAFWAAjqBAFWAAAeDB5KAFVGAIMKGADwCCUGAQciAFsuDAq6AAJyCAG+BI4ABDIAcS4AAqYQAKIAADIQAZIIACoIAZIIAVoAuT4MF/IEAcoAQJwECgEqvggBmgAJNgQAqgAA+gAWPAUGCC26AEB2EAGaAAOEFLQAEOgCAOqGAFASAABSAAo0BCIMeHYAeG4EBAIId3QMIDB+BHsCBAhmBAqWCAh2AEOGAAh2DArSAANKCCKeCIUuBAf4BGYcALIcDI4YALAELgQnQgiGTAw0cGoAhdoAAFQEbgQDyhgE/gQMegCAsgBsOAU+AJNKAInGBRAiDKKqABPMByJEjD4ADpIoIHIEeLIQjDwENgQNNgAZtqwgcAiANhSMPgABAAgAigAZLiCMPAQuCHV+BJjGAAGmDIw8BE4AAlYAANYMf8oEYgwEFgBvMgBqYA3EgC4gjD4AKDoUf8qUAiIAKLIMDnQELhiMPAQ2PIw+BAFmBARuMCKwBDYIjD4IUw4YjD4Ao2AEIkSMPAsg3gwAblCMPgikPhiMPggSDgAAhiCMPgE4JgQqjiQGGgAC8hADuggqTpSAOgADHhADOiCMPAQuFBI6DIw+AARWBAOaCARWFB86AAjQBDoEPNoItz4si/oAK7YEMXIQDYYABqoIUX4EePoIHUQEKixBlASSkDFqAHwYCIA6CPQmMHZuBRLMBIIJFh4AZO4EHXAFGggecgBHOgSDHgRD4giJGgRGLgQJPgAG/AQODFGGCAJaAADeABK2AAl2DABkBKIEWV4MUcoQQToID2oARQoERQIAZyZwQ6YIAZwIbRoAAMQMAQeeKCOKABVUBEoEs7oMmkIAAEoEWqAGAgAS3AXSDACaTEMkCvf6CHleCE+wCAHGBR/+BDhUCDB6GIISABHKCIGkBBoEBaYMAFIAAZo8AHpEAMoAtyo4AFIISxwHOhSQ4hA8Fgw8WAQaCLAKBJDgBCoM3joMOnYAA2IEANAHPgwK7gRZ7hyQvgAECAcyLJC+CAZIBVIADV4sCvoAcOgIgCogkL4cERKQqioMDp4EdGIwkLwLIN4MHGYAcjIgEPYokL4EEPYAZxYQEPYEHvoEeaIUEPaUAgYsEPYUDW4ABIYEILoAFPAEKggChgB0vggN7gSfPhARFiQNfniQvggFgiyQvggQbgQ53gRBpkiQ0gAFkAiALhCQ0hQQmqic1jAQmgyQ0hAQmgyQ0iQDFgQ03gACEiSQ0AQ6BNTWAKX6AAMCHJCqCA9GBAeiCJCoBBYwkKoII7o8kKgEShiQqgAoUjSQqgQBEiCQqgAAiiiQqgSIugCD1gyY+hyQqAQuDJCqBAB6FEUGJJCqAD/eLCLGOJCoBDoEkKgEOggBNgAUThiQqhie/iANggSkGjQAUhyghhwAUgAA8hQHzggT9gThtgQEDgSvPgA1nggFVhgx4gRJ+AgN2gCFugx28gAWWAWuBEYEBIoQMngETgCNogAh0gROFgQA9AQWBTJyAE4qBA3aBCDMBBYIByIEMposbGYAABwEEgQR9AUeBBP+EBraAQr+BEt+DJKcBBoFUmoMVwQJBuYcSlwEUgAkUgxbyggFegUXxgSzagBKWggHqghZ2gB+hgB93gRtxAQ2EAAoBGIABnoAABwEUgQHEAQWBAgOADNGADKuAAZaAJEyBGriAHTkDC0sbgRLQgAAmgAoYgUSQkBjMhBbrgRL7hBeWhRL/gQD0AUSEEuyEEvqAAF2AUSqAAL8BuogRLQFEhhf9gQDFgQa0gQaohA93AWqBA80BA4UAx4EfrIFE1gEcgVWbggK2AUSACHiAABEBIIEkc4MSC4EAdYEIMwIgA4IU4YFRyoECQYEBGAJJG4ACPpYYaoYAygEFhADKgQB/ghOugA40gADCgCDkgimehBfGgR4Ygh2qgADGAbuSAM+BDNOFAM+CFNmVAM8BJI0AzwEo5ADPgzYliQDPgRzVAkG8iQJdAQWBAfWCBM2HGfSBLvSgCEWDAJyFAJGAAuIDLwEcgU7wAwBBmosJgYIXwIcYnYQaKAFBgDowgCb7gADwAQmDG1GAEhiMHMyMGIKBBGqAFDmCBGgBFIAACIoI+oJGeqAI+oEIpIEjc4IDkgEggVLLAwBB0IoFFYIApYAF6YQXyYIAuYMHo4AAGwEWgRaWgQCpgywOgSwfgUAJpRC7hBN5gQVhgTTHgAlfgVNMgySngShjhyhiAQiBCvaAABCJKGKCCw+WKGKAAG4BOIFKtIUoYoMokI0oYoAAmwEsgQG7ggYvgAbRgQfZAQiABZaFKBWQKGSCKAcENCIGaoAAJwEJgAAngU8ugCWJgSWNAUmBIagBCIAAOIESw4IoZIAAI4AFIYAQBIAmeYEoZIAAlpMoZIFO84AC74IowYsoZIIPXIsoZIAE3IMnnQEEgQGFhChzgEyChShuggDOlShphQKmhwrPgSEqgACmgwq4ARyBWaKDBweBCtSBEQ0DCBAngySPgQALAigLgQFbgQKOgAAHgijxgQXauSi4AQWAKLgBBYMouAEFggCVARuCS8kBHIYouAEXgwJkgyi4AQuAKLmADMQBEIMouQEXgyQjAQeHJCMBJsEkIwEKg0DqAw8QP4UACwFxhwALAR+AAAuMIosBCIAiiwLXJIApQoEhuoFPOAIQNIEiQYArJAIAGoIC44EBY4QiiwEcg03ZgFWegwCZg0qfgQDqgwE0BQRBmgVHgCtdgRpgAYeBA4uFKZGAJteCAx6ADEiAAHmABDCAAXiHA0KBAa0DABA2ggApgwcfgAIdgwE5gAdfASiFRpUBBIBWdYFFNgJBd4MkNQJLG4EP3IQAEAcDQQRKG2pKgAC2gBBCmCI/AwRBKoEQgYIAqoNEToAEcwELgTCxgAB3ARiDDqYB8YIEpIMwDgMwQQyAIUgB8IEY4IEEOIMAsQGIgACHAUqDBgoChAGAGdYCAkiAEoEBwIEIAgEDgBUKgAAMgAJHAcCBUPkBBoACA4MbX4BPNoAAKQIgcoMJdAFsgSUUAh9wgEChBEEfcxCCCGIBbIIX/wQALwEygQAQgQAJAzAQPIEBSYQNAoMFQIIAm4IBLYEBOIQEc4EAYwMEQTmDUfqEBXiCAC+DBhqBGYqBA0uCAHqAFVsBH4IOl5MAHAGLgRxvlQAdgCEOhkzogyMXkwAoggoV7AAcgB77gkjPggGQAQmAAeMBQYBGy4MDzIIBroE2lwICSIQBjpEARgEggBKFlgBigQfVjgF+ggLUgwKigALmgATxASSBCv6BAyaADEWBHtiAC/OABRKBCq+BBPaBAvqECgeCAF2CALKABLGCAH2ABpwCR0GBBGYDCBtyggC4AQOAAAiCXdOAAAgBEIEITQIbcoIAhIAAX4IG1IUATYMcQIAKH4QASYMAqp4AJoIi0YMAKQMvAQagAE8CLQCBE4mcACa9AX2CALeCRYWcAI6CVlmBTU6BCvShAQyZACaIAQyAAcABC4ABs4IYxIAEG4ADQ4EGn4EAN4IDUoIdZYcKQwEgglsygwOBggRbAcWAJpkGBQIJCQkDghSLAduAMFmBUaUB54EMLIJaAoICLoIoTocAxoAHbwIvAYAG6YAG54EOLYEAbYEEaIFD+YImgIJPvAFPgwPrgAoXghm4gADSgjGCASCAAL+BFpGGHtCAEbuCBzaCACMCLEWBBHgBT4QZlIcA0IAARIAGpgFrhQDTggBJhBIwhgLcgRWlgQwTAQaBBPaDDvKDAuuDQLmQAIkBBoUAhAEUglKdigCHgAClAU2RAIeBAL2GAVqBAVKCE+KGCbyAAD0BHIMGEQEUgiBzgQAThAEjgU1PgADvgkaLhADqAQePAGOAGPeAABiFAGOGBTeCAfuAAEqEChWBIPmBC4SDAQqEAiGAEzyDDAaBBb6EAjOGALeBAjCBDuOEBQ6BAIGDBg+BYPKAGBqBB2OKAIaAABaPAOkB24IA6YYARIIre+MA7IArFq4A7LEA6gHniQHLgQNXgQDIhADUgBdjgh1RhQCpgRPDg0tnATCXAImGAB6aA8uJBwaBAIeNBbiBKUeCAs2CNmaCAAqCD66CAAqADAaEAAqDAI6CK3aAADgBdIFF84FJqIED8oAIP4E0NYQIV4IKc4EE/YMHFQMBEDWCMCeFCOCABQQBAoUfnwMCQZSBESaDRHaFAFcDAhA5iABihBUJArQtgwxCgQmrgAAdAVyBYO0BToFkWYELnQIDaoE8xIEADAFsgAOmBEEBEC6DACYBbIId8IAGfQMQNkGABXSCAAuAA6MBG4MA1oAAVgFggwBAgQArhgHzgAANAqAtgUiugAFNAqAtgUhTBCgCmC2JB3SwAB+DAbCBEg+BFD6ADCuAIAmAACSBHxWCADSADPGAEk0BdIQAt4EPK4I/IIIAToEABgKkLZsA+4EQsYAB448A+IUA9IJhNYIBIwKgLYIObJ4BRpkAToACNYMBRIEBv4IjWIMhfYIAy4BF/QKDAoIVWYYBYwFsgyVogQHaAgFFhwAlAklxgA+VgDioiwAqgSFHgQ4ygQCVgBbHggInhgICgi3iwAICgQLsgwEMhCrJuAEMAQeEEWKAAK6AD7OCET+CAO+BWueAMvQBAYFJ0oANxoEV44IPA4Id/IYACoBi0YEzCgGCgRtkgAkGgBFoiQACgAT8gBvygBE6gR4vAQiDWXWAAAyAADWAGfSBAAqBTyuDAAqAAx6BMjqAAAqAC82BY6WAAAqAIKKAXYaBAAoCB0eBPR2BGMCBHoSAE+mBFdOBE7YFA0H6AUmBHreCEVuCP8iAFd6BBAOAIsiBAAqBLMWBHMwBCYJN1IEcrAEJgk26gRyigh3DgC/CgQAKgRDHgSJ8gQENgAnLgBRfgADUgl4Hgjl7gQcFggHjgAMggQMJAQOANLCAL3eCAHCCAyyCAyqBZB2HC3aBACuFAB+CBNeOA2qOAB+BAFqACAOCBaiBG20ELQCQIYADdYASjQJBhIEffYoDe4Au74IuRoMCfoER6wKIE4IAHAGIgCTjggKogicSgQOYgwyqgwOYggKUgQB/gRYUgQHmgQQ8gQNUgwnJhgDMAQOMAK2GAB+CAE2OAMyOAB8CIAWBAB+CAYmoBDaEAJyFBDeEACy0BDeAHeiBAO2BTj8GQQxsQZgggGi3AQCAM/UBC4AATwF+gBmMgzFyAZqACWiBV9gCQX2ANpSBNKSCADwBBoExVoYJ5IAA3oAExIUGCYALCYAKHgUAAQEBAoJU3IABewK4LYMDoQG8gAEKBXRyIgY7gAASghDCAwNBDoEy1JQLLQEGlwyqgREjArktgwyugFXkhQBdAmt2hABdBANBDWuCEbuAAt+AANEBNoAAHoQAcQEKvwBxgCgygQDAgQBzAkEJhABnAgdqgBRDgQBlAhAtggUQhAeaASuBT62CAaqAMZuBD8SCZkSAAA2AFxmFKHuBIluBDQqCTg6BAfyFNAKABRiCAAiAAbuDKOeGED6CACKCB7yDEJiBJK6CBVcBGIECDARMDQMagwhCgQHcgWdXlQDVggOQhAAqlQAjhQhsgA+ymAAmggAjAy0AM50AI4AAC7sAI4cAjwEKnwCPg1EKlgAjghUlgh/cgGp4AXaLEJCDAyoBGIFniAFKgwbIgGaVhlyIAkULgjTzAfqBJyQEQXsLHIBP7og1CwEQgAxhhzavArsBgDaMgRJwixL3gQ63glZcmBL+gAAgAUScACABQJwAILATXgF9ghJoAfGAE/0BC4FQ1AEBgADEAQmCE0sCbBCBcHOAACcBbYET6gcQQAu6CQEVgTXcAUCAJWSCBtICBkGBOZODDdYCIAeBEoICCkGADTSCZvYCdGqCBOWABPCAScuHBPCAABqAFvmCDXuCV76AF9cCIQmAbgwBDoEj+oFA3YIAQoAQTYIAQIEKeoAADIEkY4EAMoEkJ4AABIFOSoAW2YEZpYAlu4EsBgEQgB8JgiomgAA8gi8UgAA8gjtVgi8UgSNEgCG/gQAdgUo2hAOKgySKhABYgRuOBAhLGyGAOd6ADFEBAYImL4A8H4EA04EAzIE67YIAuYIAQYIeXwIgaoEAZQFrgAkAAgBOhGhRgAALgAIXgQCxAkdygBkegjGogCLQATuAI7KDAFKAAO2AAK6HAS6HASkBIoEJPgEKgwCfhAExgABagwEzgWEhgixSgAANgS5jhQFBAkETgUDJgE+KARWEBYwDAA4CgAuPgT3IDCESQe4IIRVBrgghFIE6bQF/gAARAvANgAARA7ANIYAyQQEBgBatBA9BCUuBaXuAZVyBYOABAoAU7QFxgGnDgARZAw90IoAHPQNrIReDEfCAKZOCDWSABIOBCiOBY84DdCEYgAosAX+BEcECIBaFAMKARQOAFDEBGoAyhgISTIRCNAHggjznARSBRSOACimBACaAQWMDBiAVgQdoAwshGoEk7oAIXwIiDoEBYIApw4BGaoMkzAIgGIIOLYEeZIA9EwEHgyyKAiAQgAFJgCUCAQ6BJMsDGSAagQP1gSZCgl+oAwFrdIMBYoE+EgF2glxhAQeAWWCJAhOGAoiAAbSEAoqAbMWAIcyBUswBB4FxF4AAy4FRjQEGgh9cgijBgEx5gwGwghzNAQyDChSCRUkDAiAXgCBFgRpQgwElgQAYBSAPIgkhgDdshwDLgQRQgQC2gBlMgQC2gRVPgRPWgD8kiACygWIHglmngD4JgmzwgwCYAQCCbV6AAJiCAqODX+8CIBOBAFaDWyCAJKGBAmMBDoEJ4oApA4YBiYQAB4Ifk4AApYEg3gFGgADKAQ+AbNeBPZqDGRkBS4Il/wQgDBsigEflAQeAALIBGIIBegERgQFNgQGTBAZ0IRCCL2eBA3EBDIAvvIEhoYA9cYEBToJKM4IC/IAFUAFKgW2bgDzfggJUgQJNggIgAyATaoACRAPTBkuEAlsFE0HRBEuAAl+CFEqAAtqAJUCCRa0CIA+BAReAAtWDCSCAM7WAUtkBdoEBMoAhOoED0oEAbIECNIMDrIEDyQEAgwMPgT5vg04QgwMdhwOTgAAYAQ2BAAiBAzyFJ0EDDgsrgAFfggHLgATbhB/hgQSTgVzwgQAHgmW8gGr4gW8AgwT1A2BB1IIE9QLEA4JxZYQ8goFV5QHVgRgkgRcbAdWABnSCAAeDUS8BAYEdcoMAHoMlpYAQVIEmy4ADNIEOkoFRBYAcz4EoKoEMDYM364AOYYAIxQdBoIbi7X5zgiASAgFxgXHngzBohBwSgAoagAoQAcCAb+6BABaCIaqBAGiBHKKDbyABc4Agu4FrpIAuKAF/gwKuggDlAyADc4InW4FyYYAAPoEQSIAAKokA8YUCXYAAQ4AYjJQAM4ACoQIIdoEAHoACwYkAHocAGYAC4ZMAGYAcDZMAGYAQuJMAGYAHMpMAGYADIZMAGYA71YoAGYIA4oAdUIEA4oAbRIIA4gMLvQWCB5aCA9qAACGAPKCEXiGBCviAADGAAPuBA60E8f8Da4ER+wRB8P8DgCDEgWqOgXKlgXaGA4CAPIAKF4AAW4IAGwMgAHKBWbqCdRKBHpiEAXaDAVSGAFGBZsKBdD2CAXGDBvSBAGMBcIAAUoEHc4EAbYFjLIIAUoAAUIACKQLbAoEMgANBsCuBD3iAbEmCDjeBAmeDAE2DAA2BMtuEAAuBDZmEAAuAb0qFAAuAALaFAAuADiGFAAuBFMCEAAuADtCFAAuBDUyEAAuBae6EAAuADqqFAAuAQOOFAAuABAmFAAuABZiFAAsBDocACwEPgQALgnWugC0IgiAsgCGJgQR3gwD4ggLZggAJgQGkArArgwGlArArhQKIAQKAAr+BAVIBEIcCyKQBUoYAWoEj/4QBzoJsS4ICuIAADYQAC4FmI4QAC4FxyYQAC4ABMIUAC4FooYQAC4FmXIQAC4FsqYQAC4ABMIUAC4ABMIUAC4E/YYQAC4ABMIUAC4ABMIUAC4ABMIUAC4ABMIUAC4UBMIACZIMBDAEQhAELgRezgS9aAnRygAFEAwsLkYkJeoARooMInocJfAEGiAl8ggUQhQl8gCjFhwl8iAjyhwl8ggBCgTpeigl5gUV3hwl4hGZsgXA+giR1BEHAAjaBDMySABeCTJKBFZGPCa2CB0+BJFCjCa2CCR2DCa2ICjeHCa2ALDyCAFyAbpiECo2CdCiABh2BCYyFLmiAEDOICa+ACMoBToEINYBbzAEggENVgWGnhAmyAg0CgFXfgSjkhgmzgQiEgD5BjAFnhwFihURoiAFqgQh/hAm1ggAXASCBCGuFAI6CBbkBFIAGzwUFIhMhFIwJtQKBAoAJMQmgDyEUQeAOIROBCbWBCUICoBCBABEBD4BaUYAHWAENkgmzAgQagQAbAnQigEraAWuAMiCECbQBDYIXHIEJtIBUJYAAIYAH0QEWhAm0gACAAiAVhQDDgCvAAWqALtMBGoAf6IADdoEGqgEOhAm3AROBABOAE4OFCboBDoABdgEUiQm6BA9rIheBAWuBCO8BD4MJugEHgCKBggs7gijzgAbZgQfmAxggDoEH0gMYIBeBB+0BGIMJugEGiQm6ggFpgQfJgilNAiAGjQm6hQLGgAG/hALIggkiAQaBCSIBBoEJuoAAz4FB9IM5f4UJuoF2v4gA64oJGAEZgClKgEaAgAAoAQ2NCRgBD4AITAQPGyIPgRq3ARGACVaHCRiAAPGACvuADKqCCRiAKcCAUESDMYCCAKyBVimDAmWAUdSBCRgBB4AkUoJldYIJFoAj9AISaoABpgHUhgkWAxJB0IIJFgEHgFQCgkX7g07lgE6/AQ2EMO6DMP8BEYAYfYQJFwELgAp+gAM8gQBrgAGRhAMWggkXgAM1ggyqgSzbgQAYgQKKgAKAhwL8giXJhwkYgQVugTXXgjBOhwqoggGkhAqohgp2ARKECnaCNjGCCncDCwuqgBHygQdSgRY6gTIzAwFBnoISRQQAQYgTgAASgAJJgmzJAkEegwAVAfyBYfaGABUBE4J8a4AACYAAWIMD4YgF0oABMAM7AZSAbC2BDqACsC2DRRIBqIAACIEAEAKgLYEToJIAOZYAGQMLrwKCAKyBD++BEi6BDwKAEkABBIASnYA8xYAAEoF04gEEgxKdgg8ugRnIgxBAgkQpgBBAghPBlAAcgAb4gxIsgmLNhABdgBKdihKbgTJGgxI0AgAQgEX5gwBKhxCmgwBKgjValQAchRELlQAfgAL7AXODFTCUAKiGHhODECKEJI+BD+oBEIA3E4MANYBtRIFAYwGngBPQgkdRggDMAwFBCYgBG4EBWIRtkIUA/wG4hAD/lQAgggEfgxK9gBKvmQAqggBKgiIggwGZgQCAgm76gAH7gQE8ghRwgTkkgQA6BMAtC6aFAKmBAeCEAK2CSie8AK2FAIKCTUqBClABSIJtXp4AVIEAP4cAuoAKgIIB9AQLC/wKgGgFgwarhQX4gRtcgxJugQwyASKAKw8BLIETvoEKnYEDVAcJQf+A/59/gjSsAQaDP3qBDB2BB0CBGVmDBzaCIyOABTaBGWyGBmKABxWCAuoBAYFwOgMvAbyEAAgByIAACAJBIINYfIAMh4E9KIAcroAMW4EAOoAhtIIRcIUWKIEYFIQpGoAOX4ANaoIpAIEBFwWYFmoQL4IACgGkhgAKgACwgQDFBJwWEDCCABCABAKBABABqIUAEAGwgwAqAkH+gYAdAkESgQYjgAECgDVggQZyAQKDL7OCN50B8IBBxIMA2oMF5oYyD4EATgEtgQAygBe6AwVBEYABgIEEEQYoAqwtQQqAIsmAWQ6ACm2AJteAAAqCLFCAABuAHKCBeOCCEYaADXyBHpKBGrSBTt6Aeq2DHmiCJjECECuBAICCBByDdcGAAnOAGA2EACGAFVOABCeANWsCciKARriSBC2NAhGJA8eXAmGBOC2FArSEBC0BAY8ELQJBoIBBjAMaEDGCAoeBJhCEAI2CdwKGAIeEAJq5AI+EAz0BDYEqpIEAmoAAlIIKi4Q3AIRMRoEAk4EB6YEt9gH+gls+ggHogUlaggEXAQyEAJCBIYuHATK4AJgBBYIH04kBKoJuggELggEohABngWwKgAKxgH88gwChgACKAQGHAIqAYzDCAIqDCF2WAIqCAGeCABKHAIoEBkH9/4MBJYIAkwENhwEdwwCTkQEfASKAPaKCAksBDIIAmYcAb4UAGAEEgACfgwHKggQ0AQqGA5iAA+uCE3UBCoJCtoEcbooDk4F/a4YAR58DBYEnV6AAwYEZz48AvIgDB4kArIYEDoEEcoAAkAMJEDKFBHCAZ84BB4IADoEgqQExgReWgH0YgiGJBywLC5YLARKBDT8EIGsiD4AqpIJ1Z4BhrYIXj4INCYEX5oElogEAgk1NAtDHgAhxAdCCRymBAAQBSoKDbwNB2CiDDtoC3BaBVeMBf4MVFIIMF4Fqa4ESWoBXbwEogW3ZgBT/ggDagQCkgFd8ASiAAUuFOeCBLzyBFG+AJjmBVP+CcE6BQtiAH0mAgh2ACPiBAMGAfvuDEqGDBPeCHB2ABO+BNG8CCRuBFoSCbjKDBP+CE5+ANG2AACMBrIEajAELgXQrgwBSgB4bgAG3hQGiAdCALZSAChWEAJCCFVSEcM2GAHCAa6GCLFeCCgyBBgWBCduCAXOAAV2DJiCABmyCAPSAB8iDBrkC0CiCABGCAO+AAISAAF2AABUB4IAMBoICQoIAh4JF4gLgFoAAEYAfRAIQM4MAjwHUgACPgjGlAdSFADKCHwiCAJeABm2EAP2JACaFAB6EATSCIYKGAOoBBYMK4YMMcYEA94INhYN4QoAMKIEfuYEWFAEEggAKgBokgR7JgADfhCHNgQr7gC1NgwsCgBw/iACthEPxhgHcgCshhAaQgwCcgACOggCcgwHhggDKgw8MAbyAAieARc2BGfqAcEqBAmYBCYYCcgEQg3wZAQiDW1ABBINOpoJD74I0hIAKRoI8T4IsCIUcOIYUEYIx1YEMrYMAhIMBYYUK94AxP4IJ7wHUgACtgACUBrwETBshEoIHboIBzoEjGIAv1IAx+IEvNoQAPIEktYAX84A0QoAB6IBSZYQ8YoFDwYEANYEHJQVMIgIbIoIXgIGD9oEqEYEFdAIgDIIV/oIX34se14IU8YA+jYEEIIBIMIFWRIMAbINsZIMHzoAAaYAAfIABpQMQamyDB9GANB+HAtmAQN2AFkeAAIaAAcOBACCDAt+AAMqChuKBRyiAAHaCRNkBAYICg4AB4IEK84KAvYE8noIO3oEI0YAASIE6poIOOoNIvIEBHIEArAECggImgl+igQ5egg+4A0ECSoEABYAtGoAAO4EAXYEAlIQAboEOP4IC/4ID8IM4LIEtKYQBR4EBEIE+HYIJWIAfxIEBQoAFfIMFT4MA9IAAFIEIVQIFa4QA8oAR+4UDbIUTBYEK4oAMuIIWuAMAQbqAAkeBAU+BEJCEAhyBGvEBf4I6nwIASIECxYIEioINWIQbhIMNBoMAgIEFBAEPgwJJgS/RggXIhgGkgoIfgQB8AXGABdiBDj2CAmgBS4QD6IQ4NIITv4JD+IIAnIUNpgEPgA5XASSAFa+DAF2AhreBHHGAbuWBA3yBABGABt6JAraBhVKAA62AA1KHAOsFC7YCAQmABxmBOSyCgmyCAsaABtECOwGAP0sBQYACQoAE7gRBB0GKgGbHARuALHGDDkaBHC4BCoE6ZoEEhoMBAYJ1voEK2ICGroADHoNCyIIaBYAZooF5K4IW7oGMzIQC2IAv24EET4EFjgFLgRBtgAbOgAVegSe5gAQHggE9gxotgALtggDHgh/2ghYqggcdhQAlgHDohgLzggLYgAtugRCLATuAAAeDQvqBCuYBCYJ1KoEAHQHAgwAdAsAVgweagAASAcSDABIBxIBivoARWAIKQYA7hIEEtgRGIgMbhQD3gCTwgAMlARuEAQ+CATgC0AiAATiDDESAJPqBAF6CCr2CCY2ACr2BAHqDBpCAIryAEYeBQNGCekOCB7YBL4EFDIEANYFDOIIikIMBgIIAkIEOsoIcfIQHlYEhwYIPJIAHp4AzgwIDSIcH8Y0OgokPI40AHIgH8YATp4UAXIAH8YMPgIEFqIAU+4EMeoEAC4MK7IAk7AKQIYFBcgJ0IoEWpAQvAYYIiwCmAoQIgDawgwBLAQeAAKeAAjaDCJmDAKsBB4gAq4EHeIEAj4JUAIUtQ58Aq4BY14UAYIAAq4MAYIEkJoEAq4QmF4UInwYJQRxrQWyBF7WCf1YCkB6BOnCDAIyAAA8BoIA0hYA0mYMAkoAaCoIJSYBJAocJ/40AhoIuOoQAHJYQcIwJ/QEEgAqSgzSVhAChhABqhAAVhQCrgACCgQB6gQq0gQ1jgCbRgUgggA4SgR8eBIECSRuAAXgBI4MBeIAW94AC4YANoYMAt4ECGYBEpokRN4AAfQEGhgDakgCupBE6hwFsgADHhABggQe6hgFsAQaGI9oDCUEEgVsjgAjFgAFpAR+ADLCAADuAAAsDoBwigACLhAKigTSwgQK8hAIVgwB/hytZqgIHgYAYiwFnjwCghwByhQLShgCwgRzFgBhsgiF/AqAtgUNygALeAy8BgoGGLYJ82AMvAYCBcryBAD2EAhSDXbubA2+iAiKBETCFALiAgMuEAQ2AiIqDALaBeM2DEKEFswsBCn+DBWuBBY8BIoAfEIEw7YAs9wEbghsvhAV5iwV1gI/CghzcgA6LgQcVgALygU2VgTgkg00Xgj+EgmoygIMmgStDggWEgwVxgQs4gj3SgBVJghVjgABmggTFggDEgATFgR1CggSagQJ9gAFbgQJ9gD2OjAElgAHyAQWIASWNAeKJASWNAByIASWAXOCEASUBBYAB3YMAYIGCjYQBJ4EACwELgQqGgSXyhR4ngRXehxA4hBRUgXrdgRA6gQX4gAD0gRTlgh2whQDmASKCSSaDix6DIeSCA0+CAqaAHluCAfWZA02iArKCI/mBBWCBAMCCEhuBbjSABByDAfOBG0GGD86CfFeBBraDAIqBKraBAQwELwG+FYB2H4YEs4kDRsAAlIEEeo0AlIAF/IAAJ4IBZAEFhQ83gB1chFsFgSoXjQ8zgQ4TgQBtggasjA8zgQJrgi9njwHtjAU2gHcFgyfhgVCZgA/HgQaFhgBxhAAagCs/gQAagkrKgDwQhHuAgQfQjQE3AcL6ATcB/oUBN4QPmeIBN4APrJABM4NOxIIBJgHEjgEmAcb6ASYB9oUBJoIqHeQBJoMqOo0BJoAIQYN+WYIj/4IDkYIKA4At4gFGgA1zgQWPAQiBBYqBCgOAAA+ALiGBBY8BCIQKBwL/AYCX+4MQmoEJsYEQmoGRooUMkIBNOoAMC4FKnYMNKIMOBYCNHYEAnYAOzgEEgAyugkONAQSAHRKCGyuAAWKABV+FAECCBLKBBKWBelmEMPOBABiALt6DABgBDYM9nQENgSpzgATvgQ9cghCPgAAIgj4agAuPgw1cgBraigBCggBjggBagXhbgQDtgQy3gQA/hA+tgXl3gQEpgg9Vg39uhA0ehQAVgCmLAwALg4EahIANGYKMDoQ7zoF2X4EACIVf84ApfoEACoEPggEggS+3gRYHgz0KAduAG6oEAUEWTYAru4AGs4BfxgSggAJxgCe4gQBNgzb1AQGAm8aCC9oDQSpGgUA4AgVGgV/lAwBBOYEtAYEG+YACXwML3AmCAYaBkPqAQs6CAhQBLIEr9oAG34Byv4EAD4AAA4BUXoIruoMpOYMXo4J74YJ64YMCLgJBKoAWwAJ1IoB5b4EBtYACSIEAFwFsgwg5AVyAJaiAAYiBi42BmLaABI6BAGuAAtyBYhyDFJsBT4ASTwFLgRbjgBwAAUWAZfIFIARHcnKBZFuCLJyEPNCADFuAanOALKmBArqCAs6AW2qAHU2EFgOFABOAIpmGGnCHABaBk/WAJCqEGmWHABiAHY6GNKSDLnaAHKKEgHOBARiBAAgBOIIAxoFD5IEAt4AfvoI33oIBBIBEMoEAJYE3q4KLFIE3fYEvroALx4EADYAD8YIDboIAXQFcggANgVH9gDfGgQF/hRk/ghyqgDWFAhA3gi0NhwARggBWggANgQdeg4kngTlhhBrqgn4/ggFjgBCcghjugQMTgn/Tg35DgQGEggJ8gRB6gYGUggSbAiwigjMagnvKgRyjgi+MgQJjgQEkgQDZhAAlgi3XggPbAWyDAEOAABeAY6iBAdiAAWQBBIKY/IAAkYEuKIE0KIEASIEDw4FFAIQBIAGwgARGAUGDg9SCCUGBAHCCALCAAEKBAAcCtC2BQI2CErcBtIMAGYEwFoQBe4ADUYNBOIIAkAFsgSTPgQCLgglSgQChgwBBgWkGgQq/AgVJgDrTgABhggBIgQC0AVyBBT+AACMCxC2BHueCABMCxC2CDtUBBIM0JwEBgAMkgZ9RhAFCgTZXgSIAgQL+gQGtgBpkhgD0gi8LhAAlggCygQLVggmMgEILgCo5gQBfgpJ7gwCggTnLgQHphAESgomvggFZmAESgEgVhBOsAWyDA1SFARyCAYeCBo6CAnCCP+yBBYqBMs2BG1iDATaADQEBA4ICP4MBLIGUmoMAjIIAOIUBLIAAo4QAPIABToMAWJABJIQBAYAMkoAKeIQDy4IDCIUD54EBDoAy2IIDt4QCUoFG+IAD0IMhhoAQtAFFhQO0AQaAYV6ElV6CAWODgx6DAKgBOIAFMYIMfINHdoGAO4ID7IAE6gEagzHAgwGWARqCOzWAGJmBA/yDA0qBAwGCAWGBA7KBEucBQYBa0AEDgorSAUGAQkuAHV6AJIUBi4Muz4JjnwEQgAqkgy9fghfJgGs+gRqTgZSshAVsgjkFgBo7hQJxgBT5ggN/gi+VgAAYgAANgUSGgQQ2ggANhAPVgRptg4FPggBdgWVqgwAcgjVdggAWgACQBBALC4SBHe6BADKAZCeCBEiBJ6WCBAOCA0SCXCyCANGBAiuHHWiAOaYBGIEyp4M4rIIAcwEwgh73gUB/hBGLhQAThDpohABGgACkhAf2gAS4gAANgSI8BQuECQEPgQd3gSDogRk+gR2ugiSDhwByA3RBhYJaSAEAgTcpggARgAKzAoYCgjy1gzCEgzmvgTU8hABuAVSDAriDAoyABwSCAe8BSIEABQNYdHOAgKOBS3qAAA2EAq4BNIAfAoMWcIBQpYMU04EHUIAJTIIDR4IStYQBlQEsgAB5gUUWAgNrgQdtggQrAhA6gjXFggD7gjU7ggT1g1N4ggA0gDTFgwNagTR/gQARgTTFggMWgAAFAXCABQSGCQ6SACqBjzybACKCNd2CBnaBhJqGNd2AEVyBNd2EFZ+DJUqBb16BUiSBXVmBDn+EEKyBRMCAF8QCkCOBCDCCDVyKADaCAHsBdIIA34EE34ABP4IADQKkLYEUSIEAlYFFVoABgIMD3QKAAYUeEoIV04AN6wFgggGIgRz7ggEkAUiDB7EBbIMEXwE0gBfTgQGMgCyFgQGCg0X7AVSATfeBAa6BLTmBAEmCAPaEBdeBFIqECR8DEHRzgE6AgXH3AUiCbhYBDIMByoAlXoIBx4EWIYJfWYELGIMKUoUAkYIpSYI1A4QAV4AksIA4K4ILfoM2+ocEuoQAd4IEIYAAD4FUqYQCQ4MCbIFU7oMBjoECXoEAGYIATYILMoIANYEASYQ7S5YBxogaprAAH4ML3IFSwJQBvYQ3FYMA1YcBTII3FIIBy4Kb1IFEoIQGToALSoE3GYIAwAECgzcZgQQXgjcZgwBGiATxgQAHgztQgpoMgaJtgwY4gAFgAU+AR+2HOqeEAF6CaZKEAF4BAYQ6V4GXJIE6pI0AXoI6pIQAYgEbg0YtAqAtgzpRnQBPmQCtgUaZgAdfgSH2Awu+BYARsoID4IALqYAD4oMKa4Kg0IEACYI03oIEUQFqgRSLggAdASyAA5qCBJaBB1SBEaaBlb6AGIyFBa8BcIAKVoFeh4QCR4AKY4I8vYQGL4EAHAFcgwR+ArQtgj7kgQuahAh0AUSBAAUBTIEd6YMRy4FEIoEAioABCIIG6oMQ7IAADIJD/gQgCE8bhCWjgAuDhAmAgwyeghqkghjOpQA7gBe5gA3PhAhogIXWgkb8gQJEgwV5gwFiAgRqgAcmAhA3ggASggfYAXSDADCBB9GBExCABYmEAneBCG6CAP+BQoGAHleCHDuHAzqBDQ2BAzyCBA8BWIAxKIAFnIAf7YBRFoEQJoEStYAAfoKUb4NAfoEqL4AD8gEIhAAmggDogAAFgEpLiAXCggE3ASKAUjSCA/uAHNyDAwWCGs6CAWSFHIeCHayCWIOBGjMBhYEACoQCHIE/0IUJbIMJaQHEgB9TgiMLgyUbggEJgCM+gAJlgWAGAYKCOwqBpCIBAYAADIAIhYEjHICKGIVKgIEDQoEISoI4p4Gc0YIPTII8CoAAQoGlpIECroGKCIEAB4QM74AHjIAUI4UAQQEBgp+Wg4b2gQCPgA0CgABDgRRxgAkhAwurBIAflIEAGQF8gRlHgCjfgQAMAXiDAX0CjAGFDTuECuUCLGuAAuOBGcCBBUoBA4Bh7YIFgAGQgJACggDbgAGVgAxUgAA0ggWQATiAHMmBoHWBURaABZQBB4I9k4Eq9YEu9oEE04NYIoEACoIAmgE0gB2AgQGYgx0pgQrWgF3AgQv/gwAvgBnzgk6gggAyAiALggiTgQAKgVo7hAANgANKgz4KgT34gxIwiGYwhj3/gACAggAtgQV9gT3QgAANgAHRgj4FgAv0gTEugAANgDpAgAKSgTEigAANgAnHgABQgTEWgAANgD4OgASegTEKgAANgD4RgAGDgTD+gAANghRqgQVKgQc8gBAMgg9KgC6rgT4XgAeMgSC4gz4egACfhD4egRB8g4WQgF9PgQAKgkAHgB3cAQaDRdOAETUBBoOhO4JbW4Ico4AA14IU84IeS4Ja5oBt5oMCFIAC7oMn2YAC5oBKAQEggiLrAQODTo2BAPmDAXeALCiCAAqAABSBTpcBDIBNGIBf84IDCYED5gEBgQuugS53AiIJgQLOgRlLgQAEBUkbC6ALgRwpgwlzgSoZhAlzhQl1ggIFiQlzAUWDAheBCXSAQJyAAV2AQuKCBX2RCXOCAmKaCXODB/WTCXOCCWyAApWFHAOCCHEDNgJ4hAVTgGUYgAIVgSJAgABPAWCBToiFAFABgIIA74EC3YIJoYQEdIUJpAEEgAmkgwf2gEy2hibRgh5MgAulgAH9AUGAAUODADWBAGeAVAMBIIEA2YgAbIIC3AF4gqObgwjoAQWFYMiAABiJB5GCBjeBA0KAAAmFCeiDCogBZIAP7oACT5sHx4BQvccJ7YEo3LQJ7QF4gR3fggkrhAF8gD9QgAeegACMgCjkgRsVglojgQDdgwahAaSCAPoCoC2OCa6AHeWEHbKEAiOBBQyCNMyJAh6ABZiVBc+DIGSLCcqCGiOECcsBeIQJy4MCE4IJvAFohQnZgQ5zgZHUhgl5AVyBUIeGCCoBBIUIKoCjT5oI14Kk+IAACgFohQWOggX+hAT38gnUhwm4iAlVkAmzggLUlAm2hANigQoOhgiahgoohgD6AQSCobKDAVWUAC6ABJiCqZ//ASGHASGCAgjoCouGAmG4CouBBF6AjxYDAAs/gg+agQAejxcghj/GlAAfgAAcglI2AgRAgAGUAQOAAA0CgweBN1qFP2KAENOAIiWBLjyATW2Al8aCULCOdeuFDu+BFfgBQYAjsIAAMAF/gFCoAQaCpL0CAEiAP46BE52BFj+CMuiAVRiCesqCBTGBNXiBF4mCBtyAF3qCkRUCCEmBIbwCS3KAFfOAUuKCBRCBdj8ByIAJjYFUz4MAcINePYNXjIEFY4KaDQJBKoEQioABX4IWuQRC//+BgmzZAVSAAAwDgICCgFF3ATeAW8SATlOBAWaACXmCVmiCFoOBAAyBWtqBCt2DVJiBAHWBI8+CAOSAAHeBVUSEABaBT4aJABmCAseCABcBTIcAF4JCFIAAHQHEgR6TgABegFkbgDjKgAAJAZyEMQgBKIEAD4AYXoQAMIEEgIFkuIAARgGcgSwPAQKAXrGAe+eDFRQBOIJXqYAE84QACAFEgks1gpMgg0Q6gAGRAYCCZ2yAQRSAeNaCB/2BAH4BiIEjhIALRQGEgQCOgCoZgGkkggpUATaCRV2BQzUBbIAFngE2gAQbg5DfAhA0ggHdgACMgBN2incXgACngY9Wg19ShRIZg0G7gAUngRpRgQokgWVJg0G9BEE5QSqBJY+AAdSCp0+CK4mBAv6DS0qCNWeDUoqACpeAS++BAGaAE6ODCCuEQ/oGQYgRNgK4gI+lgAALgB8IgBRvgo+xgHpvAayDABWACJaAALyBABUB4IAAFQGggwAVgAijgADfgQAVAX6CeBOAKpCDAL2BAK4BLIAGIoRbhIVEKIIoEgFEgDgahDK+ghZehQuBhkQhgiqgAiA3gQbcgQCrgG1ihQAShEQ3AUiDAReAMFsCDGyAGOQClCCBCVoBNoALK4EDbwJBkIQADwGMgwAPAZKEAA8BgIMADwGWhAAPAXyBDmACC0ODGVyBWjCXGVyCDWuBOE2CGVyBAAqAATmAeSgBSYIEGgMLC+OAjWKAAhQEC6EEaYCzYAVmZmljaYCy5QEgg7TZEwAxLjMuMS4xLW1vdGxleQBpbnaAs20VZCBsaXRlcmFsL2xlbmd0aHMgc2V0hgAcBWNvZGUgiQAZD3Vua25vd24gaGVhZGVyIICz0wFniwAyAmRpgLN3AW6AtAmKABYDYml0hABHECByZXBlYXQAdG9vIG1hbnmFABcHc3ltYm9sc44AGAJvcoYAU4YAJIUAVoKz9IAAXYC0QAFrhQCmAgBigAD4gACaDGVycm9yAHN0cmVhbYQADYoA1QstLSBtaXNzaW5nIIC0pwQtb2YtggBHgAAlAmNvgLQtAmN0hQDjA2NoZYoAF4QAmI0AFwRkYXRhhgAViwELASCBANQFZmFyIGKAtJABAIUAVwJyY4EAgQVtYXRjaIYAMgF3gLT0BG93IHOBtQOGATuCAN4DdHlwhwATiwGyggDQjwB1ggAWhQGvBGNvbXCAtSQBc4C06YACDgR0aG9kgDInEwwLpQIDAAQABQAGAAcACAAJAAqAKQcNDQAPABEAEwAXABsAH4CVbhYrADMAOwBDAFMAYwBzAIMAowDDAOMAgAY4ggABAYCMAAIBgYQAAgGChAACAYOEAAIBhIQAAgGFhAACBZAASQDIghjMgK1JggCEAQeAAIABDYAAegEZgCkpATGAA4wBYYAARgHBgEjqAYGBSOyAQBYEAQYBCIApDAMQARiABbwJMAFAAWABgAHAiQB4hQBwhQBoAYaAAAIBh4AAAgGIgAACAYmAAAIBioAAAgGLgAACAYyAAAIBjYAAAgGOgAACARCAAHIBEoAAiAEIggCAAQaAAQIBBYABBAMEAAyAAJaAHJwCAA6AAKIBD4CwMwQOC7cMtQEsgBzVggABARCMAAIBEYQAAgEShAACAROEAAIBFIQAAgEVhAACARDAASyJAICFAHSFAGyBAGQBFoAAAgEXgAACARiAAAIBGYAAAgEagAACARuAAAIBHIAAAgEdgAACAUCAAAIGoAgAAKANgACIgADQAR6AAAQBD4AAVAEggAAQAiAOgwDgAR6AAASBABSBAAEBoIQAFAETgAAEAQeEABQBDIABOAGMgAAEAUyAAAQBzIAABAEsgAAEAayAAAQBbIAABAHsgAAEARyAAAQBnIAABAFcgAAEAdyAAAQBPIAABAG8gAAEAXyAAAQB/IAABAECgAAEAYKAAAQBQoAABAHCgAAEASKAAAQBooAABAFigAAEAeKAAAQBEoAABAGSgAAEAVKAAAQB0oAABAEygAAEAbKAAAQBcoAABAHygAAEAQqAAAQBioAABAFKgAAEAcqAAAQBKoAABAGqgAAEAWqAAAQB6oAABAEagAAEAZqAAAQBWoAABAHagAAEgHm4AgC6gAAEAXqAAAQB+oAABAEGgAAEAYaAAAQBRoAABAHGgAAEASaAAAQBpoAABAFmgAAEAeaAAAQBFoAABAGWgAAEAVaAAAQB1oAABAE2gAAEAbaAAAQBdoAABAH2gAAEAQ6AAAQBjoAABAFOgAAEAc6AAAQBLoAABAGugAAEAW6AAAQB7oAABAEegAAEAZ6AAAQBXoAABAHegAAEAT6AAAQBvoAABAF+gAAEAf6AAAQBAYAABAGBgAAEAUGAAAQBwYAABAEhgAAEAaGAAAQBYYAABAHhgAAEARGAAAQBkYAABAFRgAAEAdGAAAQBMYAABAGxgAAEAXGAAAQB8YAABAEJgAAEAYmAAAQBSYAABAHJgAAEASmAAAQBqYAABAFpgAAEAemAAAQBGYAABAGZgAAEAVmAAAQB2YAABAE5gAAEAbmAAAQBeYAABAH5gAAEAQWAAAQBhYAABAFFgAAEAcWAAAQBJYAABAGlgAAEAWWAAAQB5YAABAEVgAAEAZWAAAQBVYAABAHVgAAEATWAAAQBtYAABAF1gAAEAfWAAAQBDYAABAGNgAAEAU2AAAQBzYAABIARMwIArYAABAFtgAAEAe2AAAQBHYAABAGdgAAEAV2AAAQB3YAABAE9gAAEAb2AAAQBfYAABAH9gAAEAROAAMIFEwEJAJOAAAgBk4AACAFTgAAIAVOAAAgB04AACAHTgAAIATOAAAgBM4AACAGzgAAIAbOAAAgBc4AACAFzgAAIAfOAAAgB84AACAELgAAIgBDagAQCgAAEgAAIAUuAAAgBS4AACAHLgAAIAcuAAAgBK4AACAErgAAIAauAAAgBq4AACAFrgAAIAWuAAAgB64AACAHrgAAIARuAAAgBG4AACAGbgAAIAZuAAAgBW4AACAFbgAAIAduAAAgB24AACAE7gAAIATuAAAgBu4AACAG7gAAIAXuAAAgBe4AACAH7gAAIAfuAAAiBA7YBB4AACAGHgAAIAYeAAAgBR4AACAFHgAAIAceAAAgBx4AACAEngAAIASeAAAgBp4AACAGngAAIAWeAAAgBZ4AACAHngAAIAeeAAAgBF4AACAEXgAAIAZeAAAgBl4AACAFXgAAIAVeAAAgB14AACAHXgAAIATeAAAgBN4AACAG3gAAIAbeAAAgBd4AACAF3gAAIAfeAAAgB94AACAEPgAAIAQ+AAAgBj4AACAGPgAAIAU+AAAgBT4AACAHPgAAIAc+AAAgBL4AACAEvgAAIAa+AAAgBr4AACAFvgAAIAW+AAAgB74AACAHvgAAIAR+AAAgBH4AACAGfgAAIAZ+AAAgBX4AACAFfgAAIAd+AAAgB34AACAE/gAAIAT+AAAgBv4AACAG/gAAIAX+AAAgBf4AACAH/gAAIAf+AAAiBBAoBQIAABAEggAAEAWCAAAQBEIAABAFQgAAEATCAAAQBcIIFVgMHAEiAAAQBKIAABAFogAAEARiAAAQBWIAABAE4gAAEAXiAAAQBBIAABAFEgAAEASSAAAQBZIAABAEUgAAEAVSAAAQBNIAABAF0gAAEAQOAAEIBg4AABAFDgAAEAcOAAAQBI4AABAGjgAAEAWOAAAQB44AABIC+K4AAdIECxgEFgABcAQWCBUoBFIAABAEMgAAEARyAAASAvlaABEQBBYIGBAEaggXqAQWAA9QBBYADuAEFgAOcgE92gAAEARGAAAQBCYAABAEZgAAEgQACARWAAAQBDYAABAEdgAAEgL59gAKkgQZAAQWAAiyBBaYBBYABtAEFgD3fAxsLTYMfuYcABIC+rooABIEHUYkABAEEjAAEAQWKAAQEQbAcC4C9CosAS40AO4UALwEGhAAEgQWIgQAEgQEKgQAEgQGSgQAEgIS2ggAEAQuEAAQBDIQABIAF24FHeQTgHQsjhQBfhQXLAhARgAVtBgcJBgoFC4A6uAQNAg4BgAclBJQeC2mFAJCFAIiFAICFAHiBAGiBAFyBBh8BEIAABAEUgAAEARiAAAQBHIAABAEggAAEASiAAAQBMIAABAE4gAAEAUCAAAQBUIAABIEGvQFwgAAEAYCAAAQBoIAABAHAgAAEAeCAAG8DHwtyjQBvgQBrgQBngQBjgQBfgQBbgQBXgQBTgQBPgQBLgQBHgQBDgQE8AYCvAEGAUc0CC22BAMcBBIAAAgEIgAAEgQEzgQJLARCAAA6DAAyBnqyAqmuEACSBB3OBAE8BCIAACIEAGIUADIEIt4MADAEggQCUgDKEgQBrAYCBCC8BBIMADIA/SAoBABAMAEGRIQv/gCUfgMDAgIKxBQgJCQoKgEk3gAABAQ2AAAEBDoAAAQEPgAABARCEAAEBEYQAAQEShAABAROEAAEBFIwAAQEVjAABARaMAAEBF4wAAQEYnAABARmcAAEBGpwAAQEbmwABARyBffsEBAQFBYHB1QEHgAABAQiEAAGAXSqCAAEBCowAAYAnsooAAYEBMJkAAYEBTJkAAYEBaLkAAYEBpLkAAYIDdYABzoUBvI0BqJ0BkLwBgAIbHLwAAQEdvAABgA9PgH05A9AqAQ==")), B) });
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams.js
var wasm;
var malloc;
var free;
var memory;
function setWasmExports(wasmAPI) {
  wasm = wasmAPI;
  ({ malloc, free, memory } = wasm);
  if (typeof malloc !== "function" || typeof free !== "function" || !memory) {
    wasm = malloc = free = memory = null;
    throw new Error("Invalid WASM module");
  }
}
function _make(isCompress, type, options = {}) {
  const level = typeof options.level === "number" ? options.level : -1;
  const outBufferSize = typeof options.outBuffer === "number" ? options.outBuffer : 64 * 1024;
  const inBufferSize = typeof options.inBufferSize === "number" ? options.inBufferSize : 64 * 1024;
  return new TransformStream({
    start() {
      let result;
      this.out = malloc(outBufferSize);
      this.in = malloc(inBufferSize);
      this.inBufferSize = inBufferSize;
      this._scratch = new Uint8Array(outBufferSize);
      if (isCompress) {
        this._process = wasm.deflate_process;
        this._last_consumed = wasm.deflate_last_consumed;
        this._end = wasm.deflate_end;
        this.streamHandle = wasm.deflate_new();
        if (type === "gzip") {
          result = wasm.deflate_init_gzip(this.streamHandle, level);
        } else if (type === "deflate-raw") {
          result = wasm.deflate_init_raw(this.streamHandle, level);
        } else {
          result = wasm.deflate_init(this.streamHandle, level);
        }
      } else {
        if (type === "deflate64-raw") {
          this._process = wasm.inflate9_process;
          this._last_consumed = wasm.inflate9_last_consumed;
          this._end = wasm.inflate9_end;
          this.streamHandle = wasm.inflate9_new();
          result = wasm.inflate9_init_raw(this.streamHandle);
        } else {
          this._process = wasm.inflate_process;
          this._last_consumed = wasm.inflate_last_consumed;
          this._end = wasm.inflate_end;
          this.streamHandle = wasm.inflate_new();
          if (type === "deflate-raw") {
            result = wasm.inflate_init_raw(this.streamHandle);
          } else if (type === "gzip") {
            result = wasm.inflate_init_gzip(this.streamHandle);
          } else {
            result = wasm.inflate_init(this.streamHandle);
          }
        }
      }
      if (result !== 0) {
        throw new Error("init failed:" + result);
      }
    },
    transform(chunk, controller) {
      try {
        const buffer = chunk;
        const heap = new Uint8Array(memory.buffer);
        const process = this._process;
        const last_consumed = this._last_consumed;
        const out = this.out;
        const scratch = this._scratch;
        let offset = 0;
        while (offset < buffer.length) {
          const toRead = Math.min(buffer.length - offset, 32 * 1024);
          if (!this.in || this.inBufferSize < toRead) {
            if (this.in && free) {
              free(this.in);
            }
            this.in = malloc(toRead);
            this.inBufferSize = toRead;
          }
          heap.set(buffer.subarray(offset, offset + toRead), this.in);
          const result = process(this.streamHandle, this.in, toRead, out, outBufferSize, 0);
          const prod = result & 16777215;
          if (prod) {
            scratch.set(heap.subarray(out, out + prod), 0);
            controller.enqueue(scratch.slice(0, prod));
          }
          if (!isCompress) {
            const code = result >> 24 & 255;
            const signedCode = code & 128 ? code - 256 : code;
            if (signedCode < 0) {
              throw new Error("process error:" + signedCode);
            }
          }
          const consumed = last_consumed(this.streamHandle);
          if (consumed === 0) {
            break;
          }
          offset += consumed;
        }
      } catch (error) {
        if (this._end && this.streamHandle) {
          this._end(this.streamHandle);
        }
        if (this.in && free) {
          free(this.in);
        }
        if (this.out && free) {
          free(this.out);
        }
        controller.error(error);
      }
    },
    flush(controller) {
      try {
        const heap = new Uint8Array(memory.buffer);
        const process = this._process;
        const out = this.out;
        const scratch = this._scratch;
        while (true) {
          const result = process(this.streamHandle, 0, 0, out, outBufferSize, 4);
          const produced = result & 16777215;
          const code = result >> 24 & 255;
          if (!isCompress) {
            const signedCode = code & 128 ? code - 256 : code;
            if (signedCode < 0) {
              throw new Error("process error:" + signedCode);
            }
          }
          if (produced) {
            scratch.set(heap.subarray(out, out + produced), 0);
            controller.enqueue(scratch.slice(0, produced));
          }
          if (code === 1 || produced === 0) {
            break;
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        if (this._end && this.streamHandle) {
          const result = this._end(this.streamHandle);
          if (result !== 0) {
            controller.error(new Error("end error:" + result));
          }
        }
        if (this.in && free) {
          free(this.in);
        }
        if (this.out && free) {
          free(this.out);
        }
      }
    }
  });
}
var CompressionStreamZlib = class {
  constructor(type = "deflate", options) {
    return _make(true, type, options);
  }
};
var DecompressionStreamZlib = class {
  constructor(type = "deflate", options) {
    return _make(false, type, options);
  }
};

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/streams/zlib-wasm/zlib-streams-loader.js
var initializedModule = false;
async function initModule2(wasmURI, { baseURI }) {
  if (!initializedModule) {
    let arrayBuffer, uri;
    try {
      try {
        uri = new URL(wasmURI, baseURI);
      } catch {
      }
      const response = await fetch(uri);
      arrayBuffer = await response.arrayBuffer();
    } catch (error) {
      if (wasmURI.startsWith("data:application/wasm;base64,")) {
        arrayBuffer = arrayBufferFromDataURI(wasmURI);
      } else {
        throw error;
      }
    }
    const wasmInstance = await WebAssembly.instantiate(arrayBuffer);
    setWasmExports(wasmInstance.instance.exports);
    initializedModule = true;
  }
}
function arrayBufferFromDataURI(dataURI) {
  const base64 = dataURI.split(",")[1];
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-module-wasm.js
var modulePromise;
g(configure);
configureWorker({
  initModule: (config2) => {
    if (!modulePromise) {
      let { wasmURI } = config2;
      if (typeof wasmURI == FUNCTION_TYPE) {
        wasmURI = wasmURI();
      }
      modulePromise = initModule2(wasmURI, config2);
    }
    return modulePromise;
  }
});
configure({
  CompressionStreamZlib,
  DecompressionStreamZlib
});

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/core/util/mime-type.js
var table2 = {
  "application": {
    "andrew-inset": "ez",
    "annodex": "anx",
    "atom+xml": "atom",
    "atomcat+xml": "atomcat",
    "atomserv+xml": "atomsrv",
    "bbolin": "lin",
    "cu-seeme": "cu",
    "davmount+xml": "davmount",
    "dsptype": "tsp",
    "ecmascript": [
      "es",
      "ecma"
    ],
    "futuresplash": "spl",
    "hta": "hta",
    "java-archive": "jar",
    "java-serialized-object": "ser",
    "java-vm": "class",
    "m3g": "m3g",
    "mac-binhex40": "hqx",
    "mathematica": [
      "nb",
      "ma",
      "mb"
    ],
    "msaccess": "mdb",
    "msword": [
      "doc",
      "dot",
      "wiz"
    ],
    "mxf": "mxf",
    "oda": "oda",
    "ogg": "ogx",
    "pdf": "pdf",
    "pgp-keys": "key",
    "pgp-signature": [
      "asc",
      "sig"
    ],
    "pics-rules": "prf",
    "postscript": [
      "ps",
      "ai",
      "eps",
      "epsi",
      "epsf",
      "eps2",
      "eps3"
    ],
    "rar": "rar",
    "rdf+xml": "rdf",
    "rss+xml": "rss",
    "rtf": "rtf",
    "xhtml+xml": [
      "xhtml",
      "xht"
    ],
    "xml": [
      "xml",
      "xsl",
      "xsd",
      "xpdl"
    ],
    "xspf+xml": "xspf",
    "zip": "zip",
    "vnd.android.package-archive": "apk",
    "vnd.cinderella": "cdy",
    "vnd.google-earth.kml+xml": "kml",
    "vnd.google-earth.kmz": "kmz",
    "vnd.mozilla.xul+xml": "xul",
    "vnd.ms-excel": [
      "xls",
      "xlb",
      "xlt",
      "xlm",
      "xla",
      "xlc",
      "xlw"
    ],
    "vnd.ms-pki.seccat": "cat",
    "vnd.ms-pki.stl": "stl",
    "vnd.ms-powerpoint": [
      "ppt",
      "pps",
      "pot",
      "ppa",
      "pwz"
    ],
    "vnd.oasis.opendocument.chart": "odc",
    "vnd.oasis.opendocument.database": "odb",
    "vnd.oasis.opendocument.formula": "odf",
    "vnd.oasis.opendocument.graphics": "odg",
    "vnd.oasis.opendocument.graphics-template": "otg",
    "vnd.oasis.opendocument.image": "odi",
    "vnd.oasis.opendocument.presentation": "odp",
    "vnd.oasis.opendocument.presentation-template": "otp",
    "vnd.oasis.opendocument.spreadsheet": "ods",
    "vnd.oasis.opendocument.spreadsheet-template": "ots",
    "vnd.oasis.opendocument.text": "odt",
    "vnd.oasis.opendocument.text-master": [
      "odm",
      "otm"
    ],
    "vnd.oasis.opendocument.text-template": "ott",
    "vnd.oasis.opendocument.text-web": "oth",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
    "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
    "vnd.openxmlformats-officedocument.presentationml.template": "potx",
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
    "vnd.smaf": "mmf",
    "vnd.stardivision.calc": "sdc",
    "vnd.stardivision.chart": "sds",
    "vnd.stardivision.draw": "sda",
    "vnd.stardivision.impress": "sdd",
    "vnd.stardivision.math": [
      "sdf",
      "smf"
    ],
    "vnd.stardivision.writer": [
      "sdw",
      "vor"
    ],
    "vnd.stardivision.writer-global": "sgl",
    "vnd.sun.xml.calc": "sxc",
    "vnd.sun.xml.calc.template": "stc",
    "vnd.sun.xml.draw": "sxd",
    "vnd.sun.xml.draw.template": "std",
    "vnd.sun.xml.impress": "sxi",
    "vnd.sun.xml.impress.template": "sti",
    "vnd.sun.xml.math": "sxm",
    "vnd.sun.xml.writer": "sxw",
    "vnd.sun.xml.writer.global": "sxg",
    "vnd.sun.xml.writer.template": "stw",
    "vnd.symbian.install": [
      "sis",
      "sisx"
    ],
    "vnd.visio": [
      "vsd",
      "vst",
      "vss",
      "vsw",
      "vsdx",
      "vssx",
      "vstx",
      "vssm",
      "vstm"
    ],
    "vnd.wap.wbxml": "wbxml",
    "vnd.wap.wmlc": "wmlc",
    "vnd.wap.wmlscriptc": "wmlsc",
    "vnd.wordperfect": "wpd",
    "vnd.wordperfect5.1": "wp5",
    "x-123": "wk",
    "x-7z-compressed": "7z",
    "x-abiword": "abw",
    "x-apple-diskimage": "dmg",
    "x-bcpio": "bcpio",
    "x-bittorrent": "torrent",
    "x-cbr": [
      "cbr",
      "cba",
      "cbt",
      "cb7"
    ],
    "x-cbz": "cbz",
    "x-cdf": [
      "cdf",
      "cda"
    ],
    "x-cdlink": "vcd",
    "x-chess-pgn": "pgn",
    "x-cpio": "cpio",
    "x-csh": "csh",
    "x-director": [
      "dir",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ],
    "x-dms": "dms",
    "x-doom": "wad",
    "x-dvi": "dvi",
    "x-httpd-eruby": "rhtml",
    "x-font": "pcf.Z",
    "x-freemind": "mm",
    "x-gnumeric": "gnumeric",
    "x-go-sgf": "sgf",
    "x-graphing-calculator": "gcf",
    "x-gtar": [
      "gtar",
      "taz"
    ],
    "x-hdf": "hdf",
    "x-httpd-php": [
      "phtml",
      "pht",
      "php"
    ],
    "x-httpd-php-source": "phps",
    "x-httpd-php3": "php3",
    "x-httpd-php3-preprocessed": "php3p",
    "x-httpd-php4": "php4",
    "x-httpd-php5": "php5",
    "x-ica": "ica",
    "x-info": "info",
    "x-internet-signup": [
      "ins",
      "isp"
    ],
    "x-iphone": "iii",
    "x-iso9660-image": "iso",
    "x-java-jnlp-file": "jnlp",
    "x-jmol": "jmz",
    "x-killustrator": "kil",
    "x-latex": "latex",
    "x-lyx": "lyx",
    "x-lzx": "lzx",
    "x-maker": [
      "frm",
      "fb",
      "fbdoc"
    ],
    "x-ms-wmd": "wmd",
    "x-msdos-program": [
      "com",
      "exe",
      "bat",
      "dll"
    ],
    "x-netcdf": [
      "nc"
    ],
    "x-ns-proxy-autoconfig": [
      "pac",
      "dat"
    ],
    "x-nwc": "nwc",
    "x-object": "o",
    "x-oz-application": "oza",
    "x-pkcs7-certreqresp": "p7r",
    "x-python-code": [
      "pyc",
      "pyo"
    ],
    "x-qgis": [
      "qgs",
      "shp",
      "shx"
    ],
    "x-quicktimeplayer": "qtl",
    "x-redhat-package-manager": [
      "rpm",
      "rpa"
    ],
    "x-ruby": "rb",
    "x-sh": "sh",
    "x-shar": "shar",
    "x-shockwave-flash": [
      "swf",
      "swfl"
    ],
    "x-silverlight": "scr",
    "x-stuffit": "sit",
    "x-sv4cpio": "sv4cpio",
    "x-sv4crc": "sv4crc",
    "x-tar": "tar",
    "x-tex-gf": "gf",
    "x-tex-pk": "pk",
    "x-texinfo": [
      "texinfo",
      "texi"
    ],
    "x-trash": [
      "~",
      "%",
      "bak",
      "old",
      "sik"
    ],
    "x-ustar": "ustar",
    "x-wais-source": "src",
    "x-wingz": "wz",
    "x-x509-ca-cert": [
      "crt",
      "der",
      "cer"
    ],
    "x-xcf": "xcf",
    "x-xfig": "fig",
    "x-xpinstall": "xpi",
    "applixware": "aw",
    "atomsvc+xml": "atomsvc",
    "ccxml+xml": "ccxml",
    "cdmi-capability": "cdmia",
    "cdmi-container": "cdmic",
    "cdmi-domain": "cdmid",
    "cdmi-object": "cdmio",
    "cdmi-queue": "cdmiq",
    "docbook+xml": "dbk",
    "dssc+der": "dssc",
    "dssc+xml": "xdssc",
    "emma+xml": "emma",
    "epub+zip": "epub",
    "exi": "exi",
    "font-tdpfr": "pfr",
    "gml+xml": "gml",
    "gpx+xml": "gpx",
    "gxf": "gxf",
    "hyperstudio": "stk",
    "inkml+xml": [
      "ink",
      "inkml"
    ],
    "ipfix": "ipfix",
    "jsonml+json": "jsonml",
    "lost+xml": "lostxml",
    "mads+xml": "mads",
    "marc": "mrc",
    "marcxml+xml": "mrcx",
    "mathml+xml": [
      "mathml",
      "mml"
    ],
    "mbox": "mbox",
    "mediaservercontrol+xml": "mscml",
    "metalink+xml": "metalink",
    "metalink4+xml": "meta4",
    "mets+xml": "mets",
    "mods+xml": "mods",
    "mp21": [
      "m21",
      "mp21"
    ],
    "mp4": "mp4s",
    "oebps-package+xml": "opf",
    "omdoc+xml": "omdoc",
    "onenote": [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ],
    "oxps": "oxps",
    "patch-ops-error+xml": "xer",
    "pgp-encrypted": "pgp",
    "pkcs10": "p10",
    "pkcs7-mime": [
      "p7m",
      "p7c"
    ],
    "pkcs7-signature": "p7s",
    "pkcs8": "p8",
    "pkix-attr-cert": "ac",
    "pkix-crl": "crl",
    "pkix-pkipath": "pkipath",
    "pkixcmp": "pki",
    "pls+xml": "pls",
    "prs.cww": "cww",
    "pskc+xml": "pskcxml",
    "reginfo+xml": "rif",
    "relax-ng-compact-syntax": "rnc",
    "resource-lists+xml": "rl",
    "resource-lists-diff+xml": "rld",
    "rls-services+xml": "rs",
    "rpki-ghostbusters": "gbr",
    "rpki-manifest": "mft",
    "rpki-roa": "roa",
    "rsd+xml": "rsd",
    "sbml+xml": "sbml",
    "scvp-cv-request": "scq",
    "scvp-cv-response": "scs",
    "scvp-vp-request": "spq",
    "scvp-vp-response": "spp",
    "sdp": "sdp",
    "set-payment-initiation": "setpay",
    "set-registration-initiation": "setreg",
    "shf+xml": "shf",
    "sparql-query": "rq",
    "sparql-results+xml": "srx",
    "srgs": "gram",
    "srgs+xml": "grxml",
    "sru+xml": "sru",
    "ssdl+xml": "ssdl",
    "ssml+xml": "ssml",
    "tei+xml": [
      "tei",
      "teicorpus"
    ],
    "thraud+xml": "tfi",
    "timestamped-data": "tsd",
    "vnd.3gpp.pic-bw-large": "plb",
    "vnd.3gpp.pic-bw-small": "psb",
    "vnd.3gpp.pic-bw-var": "pvb",
    "vnd.3gpp2.tcap": "tcap",
    "vnd.3m.post-it-notes": "pwn",
    "vnd.accpac.simply.aso": "aso",
    "vnd.accpac.simply.imp": "imp",
    "vnd.acucobol": "acu",
    "vnd.acucorp": [
      "atc",
      "acutc"
    ],
    "vnd.adobe.air-application-installer-package+zip": "air",
    "vnd.adobe.formscentral.fcdt": "fcdt",
    "vnd.adobe.fxp": [
      "fxp",
      "fxpl"
    ],
    "vnd.adobe.xdp+xml": "xdp",
    "vnd.adobe.xfdf": "xfdf",
    "vnd.ahead.space": "ahead",
    "vnd.airzip.filesecure.azf": "azf",
    "vnd.airzip.filesecure.azs": "azs",
    "vnd.amazon.ebook": "azw",
    "vnd.americandynamics.acc": "acc",
    "vnd.amiga.ami": "ami",
    "vnd.anser-web-certificate-issue-initiation": "cii",
    "vnd.anser-web-funds-transfer-initiation": "fti",
    "vnd.antix.game-component": "atx",
    "vnd.apple.installer+xml": "mpkg",
    "vnd.apple.mpegurl": "m3u8",
    "vnd.aristanetworks.swi": "swi",
    "vnd.astraea-software.iota": "iota",
    "vnd.audiograph": "aep",
    "vnd.blueice.multipass": "mpm",
    "vnd.bmi": "bmi",
    "vnd.businessobjects": "rep",
    "vnd.chemdraw+xml": "cdxml",
    "vnd.chipnuts.karaoke-mmd": "mmd",
    "vnd.claymore": "cla",
    "vnd.cloanto.rp9": "rp9",
    "vnd.clonk.c4group": [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ],
    "vnd.cluetrust.cartomobile-config": "c11amc",
    "vnd.cluetrust.cartomobile-config-pkg": "c11amz",
    "vnd.commonspace": "csp",
    "vnd.contact.cmsg": "cdbcmsg",
    "vnd.cosmocaller": "cmc",
    "vnd.crick.clicker": "clkx",
    "vnd.crick.clicker.keyboard": "clkk",
    "vnd.crick.clicker.palette": "clkp",
    "vnd.crick.clicker.template": "clkt",
    "vnd.crick.clicker.wordbank": "clkw",
    "vnd.criticaltools.wbs+xml": "wbs",
    "vnd.ctc-posml": "pml",
    "vnd.cups-ppd": "ppd",
    "vnd.curl.car": "car",
    "vnd.curl.pcurl": "pcurl",
    "vnd.dart": "dart",
    "vnd.data-vision.rdz": "rdz",
    "vnd.dece.data": [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ],
    "vnd.dece.ttml+xml": [
      "uvt",
      "uvvt"
    ],
    "vnd.dece.unspecified": [
      "uvx",
      "uvvx"
    ],
    "vnd.dece.zip": [
      "uvz",
      "uvvz"
    ],
    "vnd.denovo.fcselayout-link": "fe_launch",
    "vnd.dna": "dna",
    "vnd.dolby.mlp": "mlp",
    "vnd.dpgraph": "dpg",
    "vnd.dreamfactory": "dfac",
    "vnd.ds-keypoint": "kpxx",
    "vnd.dvb.ait": "ait",
    "vnd.dvb.service": "svc",
    "vnd.dynageo": "geo",
    "vnd.ecowin.chart": "mag",
    "vnd.enliven": "nml",
    "vnd.epson.esf": "esf",
    "vnd.epson.msf": "msf",
    "vnd.epson.quickanime": "qam",
    "vnd.epson.salt": "slt",
    "vnd.epson.ssf": "ssf",
    "vnd.eszigno3+xml": [
      "es3",
      "et3"
    ],
    "vnd.ezpix-album": "ez2",
    "vnd.ezpix-package": "ez3",
    "vnd.fdf": "fdf",
    "vnd.fdsn.mseed": "mseed",
    "vnd.fdsn.seed": [
      "seed",
      "dataless"
    ],
    "vnd.flographit": "gph",
    "vnd.fluxtime.clip": "ftc",
    "vnd.framemaker": [
      "fm",
      "frame",
      "maker",
      "book"
    ],
    "vnd.frogans.fnc": "fnc",
    "vnd.frogans.ltf": "ltf",
    "vnd.fsc.weblaunch": "fsc",
    "vnd.fujitsu.oasys": "oas",
    "vnd.fujitsu.oasys2": "oa2",
    "vnd.fujitsu.oasys3": "oa3",
    "vnd.fujitsu.oasysgp": "fg5",
    "vnd.fujitsu.oasysprs": "bh2",
    "vnd.fujixerox.ddd": "ddd",
    "vnd.fujixerox.docuworks": "xdw",
    "vnd.fujixerox.docuworks.binder": "xbd",
    "vnd.fuzzysheet": "fzs",
    "vnd.genomatix.tuxedo": "txd",
    "vnd.geogebra.file": "ggb",
    "vnd.geogebra.tool": "ggt",
    "vnd.geometry-explorer": [
      "gex",
      "gre"
    ],
    "vnd.geonext": "gxt",
    "vnd.geoplan": "g2w",
    "vnd.geospace": "g3w",
    "vnd.gmx": "gmx",
    "vnd.grafeq": [
      "gqf",
      "gqs"
    ],
    "vnd.groove-account": "gac",
    "vnd.groove-help": "ghf",
    "vnd.groove-identity-message": "gim",
    "vnd.groove-injector": "grv",
    "vnd.groove-tool-message": "gtm",
    "vnd.groove-tool-template": "tpl",
    "vnd.groove-vcard": "vcg",
    "vnd.hal+xml": "hal",
    "vnd.handheld-entertainment+xml": "zmm",
    "vnd.hbci": "hbci",
    "vnd.hhe.lesson-player": "les",
    "vnd.hp-hpgl": "hpgl",
    "vnd.hp-hpid": "hpid",
    "vnd.hp-hps": "hps",
    "vnd.hp-jlyt": "jlt",
    "vnd.hp-pcl": "pcl",
    "vnd.hp-pclxl": "pclxl",
    "vnd.hydrostatix.sof-data": "sfd-hdstx",
    "vnd.ibm.minipay": "mpy",
    "vnd.ibm.modcap": [
      "afp",
      "listafp",
      "list3820"
    ],
    "vnd.ibm.rights-management": "irm",
    "vnd.ibm.secure-container": "sc",
    "vnd.iccprofile": [
      "icc",
      "icm"
    ],
    "vnd.igloader": "igl",
    "vnd.immervision-ivp": "ivp",
    "vnd.immervision-ivu": "ivu",
    "vnd.insors.igm": "igm",
    "vnd.intercon.formnet": [
      "xpw",
      "xpx"
    ],
    "vnd.intergeo": "i2g",
    "vnd.intu.qbo": "qbo",
    "vnd.intu.qfx": "qfx",
    "vnd.ipunplugged.rcprofile": "rcprofile",
    "vnd.irepository.package+xml": "irp",
    "vnd.is-xpr": "xpr",
    "vnd.isac.fcs": "fcs",
    "vnd.jam": "jam",
    "vnd.jcp.javame.midlet-rms": "rms",
    "vnd.jisp": "jisp",
    "vnd.joost.joda-archive": "joda",
    "vnd.kahootz": [
      "ktz",
      "ktr"
    ],
    "vnd.kde.karbon": "karbon",
    "vnd.kde.kchart": "chrt",
    "vnd.kde.kformula": "kfo",
    "vnd.kde.kivio": "flw",
    "vnd.kde.kontour": "kon",
    "vnd.kde.kpresenter": [
      "kpr",
      "kpt"
    ],
    "vnd.kde.kspread": "ksp",
    "vnd.kde.kword": [
      "kwd",
      "kwt"
    ],
    "vnd.kenameaapp": "htke",
    "vnd.kidspiration": "kia",
    "vnd.kinar": [
      "kne",
      "knp"
    ],
    "vnd.koan": [
      "skp",
      "skd",
      "skt",
      "skm"
    ],
    "vnd.kodak-descriptor": "sse",
    "vnd.las.las+xml": "lasxml",
    "vnd.llamagraphics.life-balance.desktop": "lbd",
    "vnd.llamagraphics.life-balance.exchange+xml": "lbe",
    "vnd.lotus-1-2-3": "123",
    "vnd.lotus-approach": "apr",
    "vnd.lotus-freelance": "pre",
    "vnd.lotus-notes": "nsf",
    "vnd.lotus-organizer": "org",
    "vnd.lotus-screencam": "scm",
    "vnd.lotus-wordpro": "lwp",
    "vnd.macports.portpkg": "portpkg",
    "vnd.mcd": "mcd",
    "vnd.medcalcdata": "mc1",
    "vnd.mediastation.cdkey": "cdkey",
    "vnd.mfer": "mwf",
    "vnd.mfmp": "mfm",
    "vnd.micrografx.flo": "flo",
    "vnd.micrografx.igx": "igx",
    "vnd.mif": "mif",
    "vnd.mobius.daf": "daf",
    "vnd.mobius.dis": "dis",
    "vnd.mobius.mbk": "mbk",
    "vnd.mobius.mqy": "mqy",
    "vnd.mobius.msl": "msl",
    "vnd.mobius.plc": "plc",
    "vnd.mobius.txf": "txf",
    "vnd.mophun.application": "mpn",
    "vnd.mophun.certificate": "mpc",
    "vnd.ms-artgalry": "cil",
    "vnd.ms-cab-compressed": "cab",
    "vnd.ms-excel.addin.macroenabled.12": "xlam",
    "vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
    "vnd.ms-excel.sheet.macroenabled.12": "xlsm",
    "vnd.ms-excel.template.macroenabled.12": "xltm",
    "vnd.ms-fontobject": "eot",
    "vnd.ms-htmlhelp": "chm",
    "vnd.ms-ims": "ims",
    "vnd.ms-lrm": "lrm",
    "vnd.ms-officetheme": "thmx",
    "vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
    "vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
    "vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
    "vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
    "vnd.ms-powerpoint.template.macroenabled.12": "potm",
    "vnd.ms-project": [
      "mpp",
      "mpt"
    ],
    "vnd.ms-word.document.macroenabled.12": "docm",
    "vnd.ms-word.template.macroenabled.12": "dotm",
    "vnd.ms-works": [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ],
    "vnd.ms-wpl": "wpl",
    "vnd.ms-xpsdocument": "xps",
    "vnd.mseq": "mseq",
    "vnd.musician": "mus",
    "vnd.muvee.style": "msty",
    "vnd.mynfc": "taglet",
    "vnd.neurolanguage.nlu": "nlu",
    "vnd.nitf": [
      "ntf",
      "nitf"
    ],
    "vnd.noblenet-directory": "nnd",
    "vnd.noblenet-sealer": "nns",
    "vnd.noblenet-web": "nnw",
    "vnd.nokia.n-gage.data": "ngdat",
    "vnd.nokia.n-gage.symbian.install": "n-gage",
    "vnd.nokia.radio-preset": "rpst",
    "vnd.nokia.radio-presets": "rpss",
    "vnd.novadigm.edm": "edm",
    "vnd.novadigm.edx": "edx",
    "vnd.novadigm.ext": "ext",
    "vnd.oasis.opendocument.chart-template": "otc",
    "vnd.oasis.opendocument.formula-template": "odft",
    "vnd.oasis.opendocument.image-template": "oti",
    "vnd.olpc-sugar": "xo",
    "vnd.oma.dd2+xml": "dd2",
    "vnd.openofficeorg.extension": "oxt",
    "vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
    "vnd.osgeo.mapguide.package": "mgp",
    "vnd.osgi.dp": "dp",
    "vnd.osgi.subsystem": "esa",
    "vnd.palm": [
      "pdb",
      "pqa",
      "oprc"
    ],
    "vnd.pawaafile": "paw",
    "vnd.pg.format": "str",
    "vnd.pg.osasli": "ei6",
    "vnd.picsel": "efif",
    "vnd.pmi.widget": "wg",
    "vnd.pocketlearn": "plf",
    "vnd.powerbuilder6": "pbd",
    "vnd.previewsystems.box": "box",
    "vnd.proteus.magazine": "mgz",
    "vnd.publishare-delta-tree": "qps",
    "vnd.pvi.ptid1": "ptid",
    "vnd.quark.quarkxpress": [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ],
    "vnd.realvnc.bed": "bed",
    "vnd.recordare.musicxml": "mxl",
    "vnd.recordare.musicxml+xml": "musicxml",
    "vnd.rig.cryptonote": "cryptonote",
    "vnd.rn-realmedia": "rm",
    "vnd.rn-realmedia-vbr": "rmvb",
    "vnd.route66.link66+xml": "link66",
    "vnd.sailingtracker.track": "st",
    "vnd.seemail": "see",
    "vnd.sema": "sema",
    "vnd.semd": "semd",
    "vnd.semf": "semf",
    "vnd.shana.informed.formdata": "ifm",
    "vnd.shana.informed.formtemplate": "itp",
    "vnd.shana.informed.interchange": "iif",
    "vnd.shana.informed.package": "ipk",
    "vnd.simtech-mindmapper": [
      "twd",
      "twds"
    ],
    "vnd.smart.teacher": "teacher",
    "vnd.solent.sdkm+xml": [
      "sdkm",
      "sdkd"
    ],
    "vnd.spotfire.dxp": "dxp",
    "vnd.spotfire.sfs": "sfs",
    "vnd.stepmania.package": "smzip",
    "vnd.stepmania.stepchart": "sm",
    "vnd.sus-calendar": [
      "sus",
      "susp"
    ],
    "vnd.svd": "svd",
    "vnd.syncml+xml": "xsm",
    "vnd.syncml.dm+wbxml": "bdm",
    "vnd.syncml.dm+xml": "xdm",
    "vnd.tao.intent-module-archive": "tao",
    "vnd.tcpdump.pcap": [
      "pcap",
      "cap",
      "dmp"
    ],
    "vnd.tmobile-livetv": "tmo",
    "vnd.trid.tpt": "tpt",
    "vnd.triscape.mxs": "mxs",
    "vnd.trueapp": "tra",
    "vnd.ufdl": [
      "ufd",
      "ufdl"
    ],
    "vnd.uiq.theme": "utz",
    "vnd.umajin": "umj",
    "vnd.unity": "unityweb",
    "vnd.uoml+xml": "uoml",
    "vnd.vcx": "vcx",
    "vnd.visionary": "vis",
    "vnd.vsf": "vsf",
    "vnd.webturbo": "wtb",
    "vnd.wolfram.player": "nbp",
    "vnd.wqd": "wqd",
    "vnd.wt.stf": "stf",
    "vnd.xara": "xar",
    "vnd.xfdl": "xfdl",
    "vnd.yamaha.hv-dic": "hvd",
    "vnd.yamaha.hv-script": "hvs",
    "vnd.yamaha.hv-voice": "hvp",
    "vnd.yamaha.openscoreformat": "osf",
    "vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
    "vnd.yamaha.smaf-audio": "saf",
    "vnd.yamaha.smaf-phrase": "spf",
    "vnd.yellowriver-custom-menu": "cmp",
    "vnd.zul": [
      "zir",
      "zirz"
    ],
    "vnd.zzazz.deck+xml": "zaz",
    "voicexml+xml": "vxml",
    "widget": "wgt",
    "winhlp": "hlp",
    "wsdl+xml": "wsdl",
    "wspolicy+xml": "wspolicy",
    "x-ace-compressed": "ace",
    "x-authorware-bin": [
      "aab",
      "x32",
      "u32",
      "vox"
    ],
    "x-authorware-map": "aam",
    "x-authorware-seg": "aas",
    "x-blorb": [
      "blb",
      "blorb"
    ],
    "x-bzip": "bz",
    "x-bzip2": [
      "bz2",
      "boz"
    ],
    "x-cfs-compressed": "cfs",
    "x-chat": "chat",
    "x-conference": "nsc",
    "x-dgc-compressed": "dgc",
    "x-dtbncx+xml": "ncx",
    "x-dtbook+xml": "dtb",
    "x-dtbresource+xml": "res",
    "x-eva": "eva",
    "x-font-bdf": "bdf",
    "x-font-ghostscript": "gsf",
    "x-font-linux-psf": "psf",
    "x-font-pcf": "pcf",
    "x-font-snf": "snf",
    "x-font-ttf": [
      "ttf",
      "ttc"
    ],
    "x-font-type1": [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ],
    "x-freearc": "arc",
    "x-gca-compressed": "gca",
    "x-glulx": "ulx",
    "x-gramps-xml": "gramps",
    "x-install-instructions": "install",
    "x-lzh-compressed": [
      "lzh",
      "lha"
    ],
    "x-mie": "mie",
    "x-mobipocket-ebook": [
      "prc",
      "mobi"
    ],
    "x-ms-application": "application",
    "x-ms-shortcut": "lnk",
    "x-ms-xbap": "xbap",
    "x-msbinder": "obd",
    "x-mscardfile": "crd",
    "x-msclip": "clp",
    "application/x-ms-installer": "msi",
    "x-msmediaview": [
      "mvb",
      "m13",
      "m14"
    ],
    "x-msmetafile": [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ],
    "x-msmoney": "mny",
    "x-mspublisher": "pub",
    "x-msschedule": "scd",
    "x-msterminal": "trm",
    "x-mswrite": "wri",
    "x-nzb": "nzb",
    "x-pkcs12": [
      "p12",
      "pfx"
    ],
    "x-pkcs7-certificates": [
      "p7b",
      "spc"
    ],
    "x-research-info-systems": "ris",
    "x-silverlight-app": "xap",
    "x-sql": "sql",
    "x-stuffitx": "sitx",
    "x-subrip": "srt",
    "x-t3vm-image": "t3",
    "x-tex-tfm": "tfm",
    "x-tgif": "obj",
    "x-xliff+xml": "xlf",
    "x-xz": "xz",
    "x-zmachine": [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ],
    "xaml+xml": "xaml",
    "xcap-diff+xml": "xdf",
    "xenc+xml": "xenc",
    "xml-dtd": "dtd",
    "xop+xml": "xop",
    "xproc+xml": "xpl",
    "xslt+xml": "xslt",
    "xv+xml": [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ],
    "yang": "yang",
    "yin+xml": "yin",
    "envoy": "evy",
    "fractals": "fif",
    "internet-property-stream": "acx",
    "olescript": "axs",
    "vnd.ms-outlook": "msg",
    "vnd.ms-pkicertstore": "sst",
    "x-compress": "z",
    "x-perfmon": [
      "pma",
      "pmc",
      "pmr",
      "pmw"
    ],
    "ynd.ms-pkipko": "pko",
    "gzip": [
      "gz",
      "tgz"
    ],
    "smil+xml": [
      "smi",
      "smil"
    ],
    "vnd.debian.binary-package": [
      "deb",
      "udeb"
    ],
    "vnd.hzn-3d-crossword": "x3d",
    "vnd.sqlite3": [
      "db",
      "sqlite",
      "sqlite3",
      "db-wal",
      "sqlite-wal",
      "db-shm",
      "sqlite-shm"
    ],
    "vnd.wap.sic": "sic",
    "vnd.wap.slc": "slc",
    "x-krita": [
      "kra",
      "krz"
    ],
    "x-perl": [
      "pm",
      "pl"
    ],
    "yaml": [
      "yaml",
      "yml"
    ]
  },
  "audio": {
    "amr": "amr",
    "amr-wb": "awb",
    "annodex": "axa",
    "basic": [
      "au",
      "snd"
    ],
    "flac": "flac",
    "midi": [
      "mid",
      "midi",
      "kar",
      "rmi"
    ],
    "mpeg": [
      "mpga",
      "mpega",
      "mp3",
      "m4a",
      "mp2a",
      "m2a",
      "m3a"
    ],
    "mpegurl": "m3u",
    "ogg": [
      "oga",
      "ogg",
      "spx"
    ],
    "prs.sid": "sid",
    "x-aiff": "aifc",
    "x-gsm": "gsm",
    "x-ms-wma": "wma",
    "x-ms-wax": "wax",
    "x-pn-realaudio": "ram",
    "x-realaudio": "ra",
    "x-sd2": "sd2",
    "adpcm": "adp",
    "mp4": "mp4a",
    "s3m": "s3m",
    "silk": "sil",
    "vnd.dece.audio": [
      "uva",
      "uvva"
    ],
    "vnd.digital-winds": "eol",
    "vnd.dra": "dra",
    "vnd.dts": "dts",
    "vnd.dts.hd": "dtshd",
    "vnd.lucent.voice": "lvp",
    "vnd.ms-playready.media.pya": "pya",
    "vnd.nuera.ecelp4800": "ecelp4800",
    "vnd.nuera.ecelp7470": "ecelp7470",
    "vnd.nuera.ecelp9600": "ecelp9600",
    "vnd.rip": "rip",
    "webm": "weba",
    "x-caf": "caf",
    "x-matroska": "mka",
    "x-pn-realaudio-plugin": "rmp",
    "xm": "xm",
    "aac": "aac",
    "aiff": [
      "aiff",
      "aif",
      "aff"
    ],
    "opus": "opus",
    "wav": "wav"
  },
  "chemical": {
    "x-alchemy": "alc",
    "x-cache": [
      "cac",
      "cache"
    ],
    "x-cache-csf": "csf",
    "x-cactvs-binary": [
      "cbin",
      "cascii",
      "ctab"
    ],
    "x-cdx": "cdx",
    "x-chem3d": "c3d",
    "x-cif": "cif",
    "x-cmdf": "cmdf",
    "x-cml": "cml",
    "x-compass": "cpa",
    "x-crossfire": "bsd",
    "x-csml": [
      "csml",
      "csm"
    ],
    "x-ctx": "ctx",
    "x-cxf": [
      "cxf",
      "cef"
    ],
    "x-embl-dl-nucleotide": [
      "emb",
      "embl"
    ],
    "x-gamess-input": [
      "inp",
      "gam",
      "gamin"
    ],
    "x-gaussian-checkpoint": [
      "fch",
      "fchk"
    ],
    "x-gaussian-cube": "cub",
    "x-gaussian-input": [
      "gau",
      "gjc",
      "gjf"
    ],
    "x-gaussian-log": "gal",
    "x-gcg8-sequence": "gcg",
    "x-genbank": "gen",
    "x-hin": "hin",
    "x-isostar": [
      "istr",
      "ist"
    ],
    "x-jcamp-dx": [
      "jdx",
      "dx"
    ],
    "x-kinemage": "kin",
    "x-macmolecule": "mcm",
    "x-macromodel-input": "mmod",
    "x-mdl-molfile": "mol",
    "x-mdl-rdfile": "rd",
    "x-mdl-rxnfile": "rxn",
    "x-mdl-sdfile": "sd",
    "x-mdl-tgf": "tgf",
    "x-mmcif": "mcif",
    "x-mol2": "mol2",
    "x-molconn-Z": "b",
    "x-mopac-graph": "gpt",
    "x-mopac-input": [
      "mop",
      "mopcrt",
      "zmt"
    ],
    "x-mopac-out": "moo",
    "x-ncbi-asn1": "asn",
    "x-ncbi-asn1-ascii": [
      "prt",
      "ent"
    ],
    "x-ncbi-asn1-binary": "val",
    "x-rosdal": "ros",
    "x-swissprot": "sw",
    "x-vamas-iso14976": "vms",
    "x-vmd": "vmd",
    "x-xtel": "xtel",
    "x-xyz": "xyz"
  },
  "font": {
    "otf": "otf",
    "woff": "woff",
    "woff2": "woff2"
  },
  "image": {
    "gif": "gif",
    "ief": "ief",
    "jpeg": [
      "jpeg",
      "jpg",
      "jpe",
      "jfif",
      "jfif-tbnl",
      "jif"
    ],
    "pcx": "pcx",
    "png": "png",
    "svg+xml": [
      "svg",
      "svgz"
    ],
    "tiff": [
      "tiff",
      "tif"
    ],
    "vnd.djvu": [
      "djvu",
      "djv"
    ],
    "vnd.wap.wbmp": "wbmp",
    "x-canon-cr2": "cr2",
    "x-canon-crw": "crw",
    "x-cmu-raster": "ras",
    "x-coreldraw": "cdr",
    "x-coreldrawpattern": "pat",
    "x-coreldrawtemplate": "cdt",
    "x-corelphotopaint": "cpt",
    "x-epson-erf": "erf",
    "x-icon": "ico",
    "x-jg": "art",
    "x-jng": "jng",
    "x-nikon-nef": "nef",
    "x-olympus-orf": "orf",
    "x-portable-anymap": "pnm",
    "x-portable-bitmap": "pbm",
    "x-portable-graymap": "pgm",
    "x-portable-pixmap": "ppm",
    "x-rgb": "rgb",
    "x-xbitmap": "xbm",
    "x-xpixmap": "xpm",
    "x-xwindowdump": "xwd",
    "bmp": "bmp",
    "cgm": "cgm",
    "g3fax": "g3",
    "ktx": "ktx",
    "prs.btif": "btif",
    "sgi": "sgi",
    "vnd.dece.graphic": [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ],
    "vnd.dwg": "dwg",
    "vnd.dxf": "dxf",
    "vnd.fastbidsheet": "fbs",
    "vnd.fpx": "fpx",
    "vnd.fst": "fst",
    "vnd.fujixerox.edmics-mmr": "mmr",
    "vnd.fujixerox.edmics-rlc": "rlc",
    "vnd.ms-modi": "mdi",
    "vnd.ms-photo": "wdp",
    "vnd.net-fpx": "npx",
    "vnd.xiff": "xif",
    "webp": "webp",
    "x-3ds": "3ds",
    "x-cmx": "cmx",
    "x-freehand": [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ],
    "x-pict": [
      "pic",
      "pct"
    ],
    "x-tga": "tga",
    "cis-cod": "cod",
    "avif": "avifs",
    "heic": [
      "heif",
      "heic"
    ],
    "pjpeg": [
      "pjpg"
    ],
    "vnd.adobe.photoshop": "psd",
    "x-adobe-dng": "dng",
    "x-fuji-raf": "raf",
    "x-icns": "icns",
    "x-kodak-dcr": "dcr",
    "x-kodak-k25": "k25",
    "x-kodak-kdc": "kdc",
    "x-minolta-mrw": "mrw",
    "x-panasonic-raw": [
      "raw",
      "rw2",
      "rwl"
    ],
    "x-pentax-pef": [
      "pef",
      "ptx"
    ],
    "x-sigma-x3f": "x3f",
    "x-sony-arw": "arw",
    "x-sony-sr2": "sr2",
    "x-sony-srf": "srf"
  },
  "message": {
    "rfc822": [
      "eml",
      "mime",
      "mht",
      "mhtml",
      "nws"
    ]
  },
  "model": {
    "iges": [
      "igs",
      "iges"
    ],
    "mesh": [
      "msh",
      "mesh",
      "silo"
    ],
    "vrml": [
      "wrl",
      "vrml"
    ],
    "x3d+vrml": [
      "x3dv",
      "x3dvz"
    ],
    "x3d+xml": "x3dz",
    "x3d+binary": [
      "x3db",
      "x3dbz"
    ],
    "vnd.collada+xml": "dae",
    "vnd.dwf": "dwf",
    "vnd.gdl": "gdl",
    "vnd.gtw": "gtw",
    "vnd.mts": "mts",
    "vnd.usdz+zip": "usdz",
    "vnd.vtu": "vtu"
  },
  "text": {
    "cache-manifest": [
      "manifest",
      "appcache"
    ],
    "calendar": [
      "ics",
      "icz",
      "ifb"
    ],
    "css": "css",
    "csv": "csv",
    "h323": "323",
    "html": [
      "html",
      "htm",
      "shtml",
      "stm"
    ],
    "iuls": "uls",
    "plain": [
      "txt",
      "text",
      "brf",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "bas",
      "diff",
      "ksh"
    ],
    "richtext": "rtx",
    "scriptlet": [
      "sct",
      "wsc"
    ],
    "texmacs": "tm",
    "tab-separated-values": "tsv",
    "vnd.sun.j2me.app-descriptor": "jad",
    "vnd.wap.wml": "wml",
    "vnd.wap.wmlscript": "wmls",
    "x-bibtex": "bib",
    "x-boo": "boo",
    "x-c++hdr": [
      "h++",
      "hpp",
      "hxx",
      "hh"
    ],
    "x-c++src": [
      "c++",
      "cpp",
      "cxx",
      "cc"
    ],
    "x-component": "htc",
    "x-dsrc": "d",
    "x-diff": "patch",
    "x-haskell": "hs",
    "x-java": "java",
    "x-literate-haskell": "lhs",
    "x-moc": "moc",
    "x-pascal": [
      "p",
      "pas",
      "pp",
      "inc"
    ],
    "x-pcs-gcd": "gcd",
    "x-python": "py",
    "x-scala": "scala",
    "x-setext": "etx",
    "x-tcl": [
      "tcl",
      "tk"
    ],
    "x-tex": [
      "tex",
      "ltx",
      "sty",
      "cls"
    ],
    "x-vcalendar": "vcs",
    "x-vcard": "vcf",
    "n3": "n3",
    "prs.lines.tag": "dsc",
    "sgml": [
      "sgml",
      "sgm"
    ],
    "troff": [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ],
    "turtle": "ttl",
    "uri-list": [
      "uri",
      "uris",
      "urls"
    ],
    "vcard": "vcard",
    "vnd.curl": "curl",
    "vnd.curl.dcurl": "dcurl",
    "vnd.curl.scurl": "scurl",
    "vnd.curl.mcurl": "mcurl",
    "vnd.dvb.subtitle": "sub",
    "vnd.fly": "fly",
    "vnd.fmi.flexstor": "flx",
    "vnd.graphviz": "gv",
    "vnd.in3d.3dml": "3dml",
    "vnd.in3d.spot": "spot",
    "x-asm": [
      "s",
      "asm"
    ],
    "x-c": [
      "c",
      "h",
      "dic"
    ],
    "x-fortran": [
      "f",
      "for",
      "f77",
      "f90"
    ],
    "x-opml": "opml",
    "x-nfo": "nfo",
    "x-sfv": "sfv",
    "x-uuencode": "uu",
    "webviewhtml": "htt",
    "javascript": "js",
    "json": "json",
    "markdown": [
      "md",
      "markdown",
      "mdown",
      "markdn"
    ],
    "vnd.wap.si": "si",
    "vnd.wap.sl": "sl"
  },
  "video": {
    "avif": "avif",
    "3gpp": "3gp",
    "annodex": "axv",
    "dl": "dl",
    "dv": [
      "dif",
      "dv"
    ],
    "fli": "fli",
    "gl": "gl",
    "mpeg": [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v",
      "mp2",
      "mpa",
      "mpv2"
    ],
    "mp4": [
      "mp4",
      "mp4v",
      "mpg4"
    ],
    "quicktime": [
      "qt",
      "mov"
    ],
    "ogg": "ogv",
    "vnd.mpegurl": [
      "mxu",
      "m4u"
    ],
    "x-flv": "flv",
    "x-la-asf": [
      "lsf",
      "lsx"
    ],
    "x-mng": "mng",
    "x-ms-asf": [
      "asf",
      "asx",
      "asr"
    ],
    "x-ms-wm": "wm",
    "x-ms-wmv": "wmv",
    "x-ms-wmx": "wmx",
    "x-ms-wvx": "wvx",
    "x-msvideo": "avi",
    "x-sgi-movie": "movie",
    "x-matroska": [
      "mpv",
      "mkv",
      "mk3d",
      "mks"
    ],
    "3gpp2": "3g2",
    "h261": "h261",
    "h263": "h263",
    "h264": "h264",
    "jpeg": "jpgv",
    "jpm": [
      "jpm",
      "jpgm"
    ],
    "mj2": [
      "mj2",
      "mjp2"
    ],
    "vnd.dece.hd": [
      "uvh",
      "uvvh"
    ],
    "vnd.dece.mobile": [
      "uvm",
      "uvvm"
    ],
    "vnd.dece.pd": [
      "uvp",
      "uvvp"
    ],
    "vnd.dece.sd": [
      "uvs",
      "uvvs"
    ],
    "vnd.dece.video": [
      "uvv",
      "uvvv"
    ],
    "vnd.dvb.file": "dvb",
    "vnd.fvt": "fvt",
    "vnd.ms-playready.media.pyv": "pyv",
    "vnd.uvvu.mp4": [
      "uvu",
      "uvvu"
    ],
    "vnd.vivo": "viv",
    "webm": "webm",
    "x-f4v": "f4v",
    "x-m4v": "m4v",
    "x-ms-vob": "vob",
    "x-smv": "smv",
    "mp2t": "ts"
  },
  "x-conference": {
    "x-cooltalk": "ice"
  },
  "x-world": {
    "x-vrml": [
      "vrm",
      "flr",
      "wrz",
      "xaf",
      "xof"
    ]
  }
};
var mimeTypes = (() => {
  const mimeTypes2 = {};
  for (const type of Object.keys(table2)) {
    for (const subtype of Object.keys(table2[type])) {
      const value = table2[type][subtype];
      if (typeof value == "string") {
        mimeTypes2[value] = type + "/" + subtype;
      } else {
        for (let indexMimeType = 0; indexMimeType < value.length; indexMimeType++) {
          mimeTypes2[value[indexMimeType]] = type + "/" + subtype;
        }
      }
    }
  }
  return mimeTypes2;
})();

// node_modules/.pnpm/@zip.js+zip.js@2.8.26/node_modules/@zip.js/zip.js/lib/zip-fs-wasm.js
t(configure);

// src/backends/epub/vault-zip-loader.ts
async function makeVaultZipLoader(file) {
  configure({ useWebWorkers: false });
  const reader = new ZipReader(new BlobReader(file));
  const entries = await reader.getEntries();
  const byName = new Map(entries.map((entry) => [entry.filename, entry]));
  const fileEntry = (name) => {
    const entry = byName.get(name);
    return entry && entry.directory === false ? entry : null;
  };
  return {
    loadText: async (name) => {
      const entry = fileEntry(name);
      return entry ? await entry.getData(new TextWriter()) : null;
    },
    loadBlob: async (name) => {
      const entry = fileEntry(name);
      return entry ? await entry.getData(new BlobWriter()) : null;
    },
    getSize: (name) => byName.get(name)?.uncompressedSize ?? 0,
    close: () => reader.close()
  };
}

// src/backends/epub/epub-view.ts
var MAKI_EPUB_VIEW_TYPE = "maki-epub";
var FONT_SIZE_STEP = 10;
var FONT_SIZE_MIN = 50;
var FONT_SIZE_MAX = 200;
var SIDEBAR_MIN_PX = 150;
var SIDEBAR_MAX_FRACTION = 0.5;
var MakiEpubView = class extends import_obsidian.FileView {
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
    this.resetReady();
  }
  allowNoFile = false;
  foliate = null;
  adapter = null;
  loader = null;
  toc = [];
  contentContainerEl = null;
  sidebarToggleEl = null;
  tocSelfEls = /* @__PURE__ */ new Map();
  activeTocSelfEl = null;
  /** Survives re-mounts of the same view (file switches). */
  sidebarOpen = false;
  pageInputEl = null;
  pageCountEl = null;
  fontDownEl = null;
  fontUpEl = null;
  chapterEl = null;
  colorPicker = null;
  locationTotal = 0;
  pendingSubpath = null;
  ready;
  readyResolve;
  readyReject;
  savePosition = (0, import_obsidian.debounce)((path, cfi) => {
    this.deps.setPosition(path, cfi);
  }, 1e3);
  getViewType() {
    return MAKI_EPUB_VIEW_TYPE;
  }
  getDisplayText() {
    return this.file?.basename ?? "EPUB";
  }
  getIcon() {
    return "book-open";
  }
  canAcceptExtension(extension) {
    return extension === "epub";
  }
  /** The adapter for the currently open book (used by the provider). */
  whenReady() {
    return this.ready;
  }
  async onLoadFile(file) {
    this.resetReady();
    try {
      await this.mount(file);
    } catch (error) {
      console.error(`Maki: failed to open ${file.path}`, error);
      this.contentEl.empty();
      this.contentEl.createDiv({
        cls: "maki-epub-error",
        text: `Could not open ${file.name}: ${error instanceof Error ? error.message : String(error)}`
      });
      this.readyReject(error);
    }
  }
  async onUnloadFile(_file) {
    this.savePosition.run();
    this.teardown();
  }
  setEphemeralState(state) {
    super.setEphemeralState(state);
    const subpath = state?.subpath;
    if (typeof subpath !== "string" || subpath === "") return;
    const normalized = subpath.replace(/^#/, "");
    if (this.adapter) void this.applySubpath(normalized);
    else this.pendingSubpath = normalized;
  }
  /** Re-apply rendering preferences (called on settings changes). */
  applyPreferences() {
    const prefs = this.deps.prefs();
    this.fontDownEl?.toggleClass("mod-disabled", prefs.fontSizePercent <= FONT_SIZE_MIN);
    this.fontUpEl?.toggleClass("mod-disabled", prefs.fontSizePercent >= FONT_SIZE_MAX);
    const renderer = this.foliate?.renderer;
    if (!renderer) return;
    renderer.setAttribute("flow", prefs.flow === "scrolled" ? "scrolled" : "paginated");
    renderer.setStyles?.(this.bookCss(prefs));
  }
  // ---- mounting
  async mount(file) {
    this.teardown();
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("maki-epub-view");
    const toolbar = contentEl.createDiv({ cls: "pdf-toolbar" });
    const left = toolbar.createDiv({ cls: "pdf-toolbar-left" });
    const right = toolbar.createDiv({ cls: "pdf-toolbar-right" });
    const sidebarBtn = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(sidebarBtn, "lucide-layout-list");
    (0, import_obsidian.setTooltip)(sidebarBtn, "Toggle sidebar");
    sidebarBtn.addEventListener("click", () => this.toggleSidebar());
    this.sidebarToggleEl = sidebarBtn;
    left.createDiv({ cls: "pdf-toolbar-spacer" });
    const prevBtn = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(prevBtn, "lucide-chevron-left");
    (0, import_obsidian.setTooltip)(prevBtn, "Previous page");
    left.createDiv({ cls: "pdf-toolbar-divider" });
    const nextBtn = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(nextBtn, "lucide-chevron-right");
    (0, import_obsidian.setTooltip)(nextBtn, "Next page");
    left.createDiv({ cls: "pdf-toolbar-spacer" });
    this.fontDownEl = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(this.fontDownEl, "lucide-zoom-out");
    (0, import_obsidian.setTooltip)(this.fontDownEl, "Decrease font size");
    this.fontDownEl.addEventListener("click", () => this.adjustFontSize(-FONT_SIZE_STEP));
    left.createDiv({ cls: "pdf-toolbar-divider" });
    this.fontUpEl = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(this.fontUpEl, "lucide-zoom-in");
    (0, import_obsidian.setTooltip)(this.fontUpEl, "Increase font size");
    this.fontUpEl.addEventListener("click", () => this.adjustFontSize(FONT_SIZE_STEP));
    const displayBtn = left.createDiv({ cls: "clickable-icon" });
    (0, import_obsidian.setIcon)(displayBtn, "lucide-chevron-down");
    (0, import_obsidian.setTooltip)(displayBtn, "Display options");
    displayBtn.addEventListener("click", () => this.showDisplayMenu(displayBtn));
    left.createDiv({ cls: "pdf-toolbar-spacer" });
    this.pageInputEl = left.createEl("input", {
      cls: "pdf-page-input",
      type: "number",
      attr: { min: "1" }
    });
    this.pageInputEl.addEventListener("click", () => this.pageInputEl?.select());
    this.pageInputEl.addEventListener("change", () => {
      if (this.pageInputEl) void this.goToPage(this.pageInputEl.value);
    });
    this.pageCountEl = left.createSpan({ cls: "pdf-page-numbers" });
    this.colorPicker = this.deps.mountColorPicker(right);
    this.chapterEl = right.createSpan({ cls: "maki-epub-chapter" });
    const bookHost = contentEl.createDiv({ cls: "maki-epub-book" });
    const content = bookHost.createDiv({ cls: "pdf-content-container" });
    content.style.setProperty("--sidebar-width", "275px");
    const bookEl = content.createDiv({ cls: "pdf-viewer-container" });
    const sidebar = content.createDiv({ cls: "pdf-sidebar-container" });
    this.bindSidebarResizer(sidebar.createDiv({ cls: "pdf-sidebar-resizer" }), content);
    const outlineEl = sidebar.createDiv({ cls: "pdf-sidebar-content-wrapper" }).createDiv({ cls: "pdf-sidebar-content" }).createDiv({ cls: "pdf-outline-view" });
    this.contentContainerEl = content;
    content.toggleClass("sidebarOpen", this.sidebarOpen);
    sidebarBtn.toggleClass("is-active", this.sidebarOpen);
    const bytes = await this.app.vault.readBinary(file);
    this.loader = await makeVaultZipLoader(new File([bytes], file.name));
    const book = await new EPUB(this.loader).init();
    hardenBook(book);
    parkSectionStylesheets(book);
    const foliate = document.createElement("foliate-view");
    foliate.setAttribute("sandbox", "allow-same-origin");
    this.foliate = foliate;
    bookEl.append(foliate);
    prevBtn.addEventListener("click", () => void foliate.prev());
    nextBtn.addEventListener("click", () => void foliate.next());
    foliate.addEventListener("relocate", (event) => {
      this.onRelocate(event.detail, file.path);
    });
    const styleInliner = new SectionStyleInliner();
    foliate.addEventListener("load", (event) => {
      const { doc } = event.detail;
      doc.addEventListener("keydown", (evt) => this.relayKeydown(evt));
      void styleInliner.apply(doc);
    });
    const adapter = new EpubViewerAdapter({ path: file.path, backend: "epub" }, foliate);
    await foliate.open(book);
    this.applyPreferences();
    this.toc = book.toc ?? [];
    this.renderOutline(outlineEl);
    const lastLocation = this.deps.getPosition(file.path);
    await foliate.init(
      lastLocation !== void 0 ? { lastLocation } : { showTextStart: true }
    );
    this.adapter = adapter;
    this.readyResolve(adapter);
    if (this.pendingSubpath !== null) {
      const subpath = this.pendingSubpath;
      this.pendingSubpath = null;
      await this.applySubpath(subpath);
    }
  }
  teardown() {
    this.adapter?.destroy();
    this.adapter = null;
    this.foliate?.close();
    this.foliate?.remove();
    this.foliate = null;
    void this.loader?.close().catch(() => void 0);
    this.loader = null;
    this.toc = [];
    this.tocSelfEls.clear();
    this.activeTocSelfEl = null;
    this.contentContainerEl = null;
    this.sidebarToggleEl = null;
    this.colorPicker?.dispose();
    this.colorPicker = null;
    this.pageInputEl = null;
    this.pageCountEl = null;
    this.fontDownEl = null;
    this.fontUpEl = null;
    this.chapterEl = null;
    this.locationTotal = 0;
  }
  resetReady() {
    this.ready = new Promise((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
    this.ready.catch(() => void 0);
  }
  /** Re-dispatch a section-iframe keydown on the view's document so
   * Obsidian's keymap sees it (`ownerDocument`, not `document`, to follow
   * the view into popout windows). If Obsidian handles it as a hotkey,
   * suppress the iframe's default too. */
  relayKeydown(evt) {
    const target = this.containerEl.ownerDocument.body;
    const clone = new KeyboardEvent(evt.type, evt);
    const proceed = target.dispatchEvent(clone);
    if (!proceed || clone.defaultPrevented) evt.preventDefault();
  }
  // ---- chrome
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.contentContainerEl?.toggleClass("sidebarOpen", this.sidebarOpen);
    this.sidebarToggleEl?.toggleClass("is-active", this.sidebarOpen);
    if (this.sidebarOpen) this.activeTocSelfEl?.scrollIntoView({ block: "nearest" });
  }
  /** The TOC as a standard Obsidian tree, like the native PDF outline view. */
  renderOutline(container) {
    container.empty();
    this.tocSelfEls.clear();
    this.activeTocSelfEl = null;
    if (this.toc.length === 0) {
      container.createDiv({ cls: "maki-epub-outline-empty", text: "No table of contents" });
      return;
    }
    const addItems = (parent, items) => {
      for (const entry of items) {
        const item = parent.createDiv({ cls: "tree-item" });
        const self = item.createDiv({ cls: "tree-item-self" });
        const children = entry.subitems ?? [];
        if (children.length > 0) {
          self.addClass("mod-collapsible");
          const toggle = self.createDiv({ cls: "tree-item-icon collapse-icon" });
          (0, import_obsidian.setIcon)(toggle, "right-triangle");
          toggle.addEventListener("click", (evt) => {
            evt.stopPropagation();
            const collapsed = !item.hasClass("is-collapsed");
            item.toggleClass("is-collapsed", collapsed);
            toggle.toggleClass("is-collapsed", collapsed);
          });
        }
        self.createDiv({ cls: "tree-item-inner", text: entry.label?.trim() ?? "\u2026" });
        const href = entry.href;
        if (href !== void 0) {
          self.addClass("is-clickable");
          this.tocSelfEls.set(href, self);
          self.addEventListener("click", () => void this.foliate?.goTo(href));
        }
        if (children.length > 0) addItems(item.createDiv({ cls: "tree-item-children" }), children);
      }
    };
    addItems(container, this.toc);
  }
  /** Mark (and reveal) the chapter being read, as the PDF outline does. */
  setActiveTocItem(href) {
    const next = href !== null ? this.tocSelfEls.get(href) ?? null : null;
    if (next === this.activeTocSelfEl) return;
    this.activeTocSelfEl?.removeClass("mod-active");
    this.activeTocSelfEl = next;
    next?.addClass("mod-active");
    if (this.sidebarOpen) next?.scrollIntoView({ block: "nearest" });
  }
  /** Drag-resize via the native resizer handle: update `--sidebar-width`
   * (what both the sidebar and the shifted viewer read) and suppress the
   * slide transition while dragging, exactly as pdf.js's sidebar does. */
  bindSidebarResizer(resizer, container) {
    resizer.addEventListener("pointerdown", (down) => {
      down.preventDefault();
      resizer.setPointerCapture(down.pointerId);
      container.addClass("sidebarResizing");
      const rtl = getComputedStyle(container).direction === "rtl";
      const onMove = (move) => {
        const rect = container.getBoundingClientRect();
        const width = rtl ? rect.right - move.clientX : move.clientX - rect.left;
        const clamped = Math.max(
          SIDEBAR_MIN_PX,
          Math.min(width, rect.width * SIDEBAR_MAX_FRACTION)
        );
        container.style.setProperty("--sidebar-width", `${Math.round(clamped)}px`);
      };
      const onUp = () => {
        resizer.releasePointerCapture(down.pointerId);
        container.removeClass("sidebarResizing");
        resizer.removeEventListener("pointermove", onMove);
        resizer.removeEventListener("pointerup", onUp);
      };
      resizer.addEventListener("pointermove", onMove);
      resizer.addEventListener("pointerup", onUp);
    });
  }
  showDisplayMenu(anchor) {
    const prefs = this.deps.prefs();
    const fixedLayout = this.foliate?.isFixedLayout ?? false;
    const menu = new import_obsidian.Menu();
    menu.addItem(
      (item) => item.setIcon("lucide-book-open").setTitle("Paginated").setDisabled(fixedLayout).setChecked(prefs.flow !== "scrolled").onClick(() => this.deps.updatePrefs((p) => p.flow = "paginated"))
    );
    menu.addItem(
      (item) => item.setIcon("lucide-scroll").setTitle("Scrolled").setDisabled(fixedLayout).setChecked(prefs.flow === "scrolled").onClick(() => this.deps.updatePrefs((p) => p.flow = "scrolled"))
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setIcon("lucide-palette").setTitle("Adapt to theme").setChecked(prefs.followTheme).onClick(() => this.deps.updatePrefs((p) => p.followTheme = !p.followTheme))
    );
    this.showBelow(menu, anchor);
  }
  /** Step the font size preference, clamped to [FONT_SIZE_MIN, FONT_SIZE_MAX]. */
  adjustFontSize(delta) {
    const current = this.deps.prefs().fontSizePercent;
    const next = Math.min(Math.max(current + delta, FONT_SIZE_MIN), FONT_SIZE_MAX);
    if (next !== current) this.deps.updatePrefs((p) => p.fontSizePercent = next);
  }
  /** Drop a menu under a toolbar button, as the native PDF toolbar does. */
  showBelow(menu, anchor) {
    const rect = anchor.getBoundingClientRect();
    menu.showAtPosition({ x: rect.x, y: rect.bottom, width: rect.width, overlap: true, left: false });
  }
  /** Jump to a 1-based "page" (a foliate location) typed into the page input. */
  async goToPage(value) {
    const foliate = this.foliate;
    const total = this.locationTotal;
    const n = Number(value);
    if (!foliate || total <= 0 || !Number.isFinite(n)) return;
    const page = Math.min(Math.max(Math.round(n), 1), total);
    await foliate.goToFraction((page - 1) / total);
  }
  onRelocate(location, path) {
    const loc = location.location;
    if (this.pageInputEl && this.pageCountEl && loc !== void 0 && loc.total > 0) {
      this.locationTotal = loc.total;
      this.pageInputEl.max = String(loc.total);
      this.pageInputEl.value = String(Math.min(loc.current + 1, loc.total));
      this.pageCountEl.setText(`of ${loc.total}`);
    }
    this.setActiveTocItem(location.tocItem?.href ?? null);
    if (this.chapterEl) {
      const percent = typeof location.fraction === "number" ? `${Math.round(location.fraction * 100)}%` : "";
      const chapter = location.tocItem?.label?.trim() ?? "";
      this.chapterEl.setText([chapter, percent].filter((s) => s !== "").join(" \xB7 "));
    }
    if (typeof location.cfi === "string" && location.cfi !== "") {
      this.savePosition(path, location.cfi);
    }
  }
  // ---- navigation from links
  async applySubpath(subpath) {
    const adapter = this.adapter;
    if (!adapter) return;
    const locator = EpubLocatorCodec.decode(parseSubpath(subpath));
    if (!locator) return;
    const outcome = await adapter.reveal(locator, { flash: true });
    if (outcome !== "exact") {
      new import_obsidian.Notice(
        outcome === "fallback" ? "Maki: exact passage not found \u2014 jumped to its section" : "Maki: the linked passage could not be found in this book"
      );
    }
  }
  // ---- theme / preferences
  bookCss(prefs) {
    const isDark = document.body.classList.contains("theme-dark");
    const computed = getComputedStyle(this.containerEl);
    const themeCss = prefs.followTheme ? `
        html, body { color: ${computed.color}; background: transparent; }
        a:link { color: ${computed.getPropertyValue("--text-accent").trim() || "inherit"}; }` : "";
    return `
      html { color-scheme: ${isDark && prefs.followTheme ? "dark" : "light"}; font-size: ${prefs.fontSizePercent}%; }
      p, li, blockquote, dd { line-height: 1.5; }
      ${themeCss}
    `;
  }
};

// src/backends/epub/epub-viewer-provider.ts
var ACQUIRE_TIMEOUT_MS = 3e4;
var EpubViewerProvider = class {
  constructor(deps) {
    this.deps = deps;
  }
  backend = "epub";
  canHandle(ref) {
    return ref.backend === "epub" && ref.path.toLowerCase().endsWith(".epub");
  }
  setup(ctx) {
    const plugin = ctx;
    plugin.registerView(MAKI_EPUB_VIEW_TYPE, (leaf) => new MakiEpubView(leaf, this.deps));
    plugin.registerExtensions(["epub"], MAKI_EPUB_VIEW_TYPE);
    return { dispose: () => {
    } };
  }
  async acquire(host, ref) {
    if (!(host instanceof MakiEpubView)) {
      throw new Error(`Not a ${MAKI_EPUB_VIEW_TYPE} view for ${ref.path}`);
    }
    return await Promise.race([
      host.whenReady(),
      new Promise((_, reject) => {
        window.setTimeout(
          () => reject(new Error(`Timed out opening ${ref.path}`)),
          ACQUIRE_TIMEOUT_MS
        );
      })
    ]);
  }
};

// node_modules/.pnpm/monkey-around@3.0.0/node_modules/monkey-around/dist/index.mjs
function around(obj, factories) {
  const removers = Object.keys(factories).map((key) => around1(obj, key, factories[key]));
  return removers.length === 1 ? removers[0] : function() {
    removers.forEach((r) => r());
  };
}
function around1(obj, method, createWrapper) {
  const inherited = obj[method], hadOwn = obj.hasOwnProperty(method), original = hadOwn ? inherited : function() {
    return Object.getPrototypeOf(obj)[method].apply(this, arguments);
  };
  let current = createWrapper(original);
  if (inherited)
    Object.setPrototypeOf(current, inherited);
  Object.setPrototypeOf(wrapper, current);
  obj[method] = wrapper;
  return remove;
  function wrapper(...args) {
    if (current === original && obj[method] === wrapper)
      remove();
    return current.apply(this, args);
  }
  function remove() {
    if (obj[method] === wrapper) {
      if (hadOwn)
        obj[method] = original;
      else
        delete obj[method];
    }
    if (current === original)
      return;
    current = original;
    Object.setPrototypeOf(wrapper, inherited || Function);
  }
}

// src/core/locator/pdf-codec.ts
function parseInteger(value) {
  if (!/^-?\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}
function parseNumber(value) {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function parseSelectionEndpoints(value) {
  const parts = value.split(",").map((part) => parseInteger(part.trim()));
  if (parts.length !== 4 || parts.some((p) => p === null || p < 0)) return null;
  const [bi, bo, ei, eo] = parts;
  return { begin: [bi, bo], end: [ei, eo] };
}
function isForwardTextRange(begin, end) {
  return begin[0] < end[0] || begin[0] === end[0] && begin[1] < end[1];
}
function parseSelection(value) {
  const endpoints = parseSelectionEndpoints(value);
  return endpoints ? { kind: "text", begin: endpoints.begin, end: endpoints.end } : null;
}
function parseRect(value) {
  const parts = value.split(",").map(parseNumber);
  if (parts.length !== 4 || parts.some((p) => p === null)) return null;
  return { kind: "rect", rect: parts };
}
var PdfLocatorCodec = {
  encode(loc) {
    const pdf = expectBackend(loc, "pdf", "PdfLocatorCodec");
    const params = { page: String(pdf.page) };
    switch (pdf.target.kind) {
      case "text":
        params["selection"] = [...pdf.target.begin, ...pdf.target.end].join(",");
        break;
      case "rect":
        params["rect"] = pdf.target.rect.join(",");
        break;
      case "annotation":
        params["annotation"] = pdf.target.id;
        break;
    }
    return params;
  },
  decode(params) {
    const page = params["page"] !== void 0 ? parseInteger(params["page"]) : null;
    if (page === null || page < 1) return null;
    let target = null;
    if (params["selection"] !== void 0) {
      target = parseSelection(params["selection"]);
    } else if (params["rect"] !== void 0) {
      target = parseRect(params["rect"]);
    } else if (params["annotation"] !== void 0 && params["annotation"] !== "") {
      target = { kind: "annotation", id: params["annotation"] };
    }
    if (!target) return null;
    return { backend: "pdf", page, target };
  }
};

// src/core/pdf-geometry.ts
function toItemBoxes(items) {
  return items.map((item) => {
    const x = item.transform[4] ?? 0;
    const y = item.transform[5] ?? 0;
    return { rect: [x, y, x + item.width, y + item.height], text: item.str };
  });
}
var LINE_EPSILON = 0.5;
function selectionRects(items, begin, end) {
  const [beginItem, beginOffset] = begin;
  const [endItem, endOffset] = end;
  if (beginItem > endItem) return [];
  if (beginItem < 0 || endItem >= items.length) return [];
  const rects = [];
  for (let i = beginItem; i <= endItem; i++) {
    const item = items[i];
    if (!item || item.text.length === 0) continue;
    const from = i === beginItem ? beginOffset : 0;
    const to = i === endItem ? endOffset : item.text.length;
    const clampedFrom = Math.max(0, Math.min(from, item.text.length));
    const clampedTo = Math.max(0, Math.min(to, item.text.length));
    if (clampedFrom >= clampedTo) continue;
    const [left, bottom, right, top] = item.rect;
    const width = right - left;
    const x0 = left + width * clampedFrom / item.text.length;
    const x1 = left + width * clampedTo / item.text.length;
    rects.push([x0, bottom, x1, top]);
  }
  return mergeRects(rects);
}
function mergeRects(rects) {
  const sorted = [...rects].sort((a, b) => b[3] - a[3] || a[0] - b[0]);
  const merged = [];
  for (const rect of sorted) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(last[1] - rect[1]) <= LINE_EPSILON && Math.abs(last[3] - rect[3]) <= LINE_EPSILON && rect[0] <= last[2] + LINE_EPSILON) {
      last[2] = Math.max(last[2], rect[2]);
    } else {
      merged.push([...rect]);
    }
  }
  return merged;
}

// src/backends/pdf/pdf-viewer-adapter.ts
var OVERLAY_CLASS = "maki-pdf-annotation-layer";
var HIGHLIGHT_CLASS = "maki-highlight";
function textDivsOf(pageView) {
  const builder = pageView?.textLayer;
  if (!builder) return null;
  return (builder.textLayer ?? builder).textDivs ?? null;
}
var PdfViewerAdapter = class {
  constructor(ref, view, child) {
    this.ref = ref;
    this.view = view;
    this.child = child;
    void this.child.pdfViewer?.pdfViewer?.pdfDocument?.getPageLabels().then((labels) => this.pageLabels = labels).catch(() => void 0);
    const eventBus = this.child.pdfViewer?.eventBus;
    if (eventBus) {
      const onPageRendered = (data) => {
        const pageNumber = data.pageNumber;
        if (typeof pageNumber === "number") void this.paintPage(pageNumber);
      };
      eventBus.on("pagerendered", onPageRendered);
      this.disposers.push(() => eventBus.off("pagerendered", onPageRendered));
    }
    if (typeof this.child.highlightText === "function") {
      const adapter = this;
      this.disposers.push(
        around(this.child, {
          highlightText: (next) => function(pageNumber, range) {
            if (adapter.makiHighlightIdAt(pageNumber, range)) return void 0;
            return next?.call(this, pageNumber, range);
          }
        })
      );
    }
    const container = this.containerEl();
    const doc = container?.ownerDocument;
    if (container && doc) {
      const onSelectionChange = () => {
        const live = this.liveSelection();
        if (!live) return;
        this.remembered = live;
        for (const cb of this.selectionCbs) cb(live);
      };
      const onPointerDown = (event) => {
        if (!(event.target instanceof Element) || !event.target.closest(".page")) return;
        this.remembered = null;
        for (const cb of this.selectionCbs) cb(null);
        for (const cb of this.dragCbs) cb(true);
      };
      const onPointerUp = () => {
        for (const cb of this.dragCbs) cb(false);
      };
      doc.addEventListener("selectionchange", onSelectionChange);
      container.addEventListener("pointerdown", onPointerDown);
      doc.addEventListener("pointerup", onPointerUp);
      doc.addEventListener("pointercancel", onPointerUp);
      this.disposers.push(() => {
        doc.removeEventListener("selectionchange", onSelectionChange);
        container.removeEventListener("pointerdown", onPointerDown);
        doc.removeEventListener("pointerup", onPointerUp);
        doc.removeEventListener("pointercancel", onPointerUp);
      });
    }
  }
  backend = "pdf";
  highlights = /* @__PURE__ */ new Map();
  activateCbs = /* @__PURE__ */ new Set();
  selectionCbs = /* @__PURE__ */ new Set();
  dragCbs = /* @__PURE__ */ new Set();
  textItemCache = /* @__PURE__ */ new Map();
  /**
   * The last live selection, kept when another pane steals the (window-wide)
   * DOM selection — e.g. focusing the note to paste into. Cleared only by a
   * pointerdown on a page, i.e. the user acting inside the document again.
   */
  remembered = null;
  pageLabels = null;
  disposers = [];
  destroyed = false;
  /** Tie an external binding (e.g. injected toolbar UI) to this viewer's lifetime. */
  own(dispose) {
    if (this.destroyed) dispose();
    else this.disposers.push(dispose);
  }
  containerEl() {
    return this.child.containerEl ?? this.view.containerEl ?? null;
  }
  pageView(pageNumber) {
    return this.child.pdfViewer?.pdfViewer?.getPageView(pageNumber - 1) ?? null;
  }
  // ---- navigation
  async reveal(target, opts) {
    if (target.backend !== "pdf") return "not-found";
    const pageCount = this.child.pdfViewer?.pdfViewer?.pagesCount ?? 0;
    if (target.page < 1 || pageCount > 0 && target.page > pageCount) return "not-found";
    const params = PdfLocatorCodec.encode(target);
    const subpath = serializeSubpath(opts?.flash === false ? { page: params["page"] } : params);
    if (typeof this.child.applySubpath === "function") {
      this.child.applySubpath(`#${subpath}`);
    } else if (typeof this.view.setEphemeralState === "function") {
      this.view.setEphemeralState({ subpath });
    } else {
      return "not-found";
    }
    return "exact";
  }
  // ---- selection
  captureSelection() {
    return this.liveSelection() ?? this.remembered;
  }
  liveSelection() {
    const container = this.containerEl();
    const doc = container?.ownerDocument;
    const sel = doc?.defaultView?.getSelection() ?? null;
    if (!container || !sel || sel.isCollapsed || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return null;
    const startPage = this.pageElOf(range.startContainer);
    const endPage = this.pageElOf(range.endContainer);
    if (!startPage || startPage !== endPage) {
      console.debug("Maki[pdf]: selection rejected \u2014", startPage ? "spans pages" : "no .page ancestor");
      return null;
    }
    const pageNumber = Number(startPage.getAttribute("data-page-number"));
    if (!Number.isInteger(pageNumber) || pageNumber < 1) return null;
    const snapped = snapToTextEndpoints(range);
    if (!snapped) {
      console.debug("Maki[pdf]: selection rejected \u2014 no text inside the range");
      return null;
    }
    const endpoints = this.nativeEndpoints(startPage) ?? this.domEndpoints(snapped, pageNumber, doc);
    if (!endpoints) return null;
    const [begin, end] = endpoints;
    return {
      locator: { backend: "pdf", page: pageNumber, target: { kind: "text", begin, end } },
      text: sel.toString()
    };
  }
  /**
   * Endpoints via Obsidian's own selection helper, when present — it tracks
   * pdf.js's text-layer DOM across versions, and its item indices are the
   * same native `selection=` convention the locator format reuses (spec §6).
   */
  nativeEndpoints(pageEl) {
    if (typeof this.child.getTextSelectionRangeStr !== "function") return null;
    const str = this.child.getTextSelectionRangeStr(pageEl);
    const endpoints = str ? parseSelectionEndpoints(str) : null;
    if (!endpoints || !isForwardTextRange(endpoints.begin, endpoints.end)) return null;
    return [endpoints.begin, endpoints.end];
  }
  /** Fallback for older internals: resolve endpoints by walking `textDivs`. */
  domEndpoints(range, pageNumber, doc) {
    const textDivs = textDivsOf(this.pageView(pageNumber));
    if (!textDivs || textDivs.length === 0) {
      console.debug("Maki[pdf]: selection rejected \u2014 no textDivs on page view (internals drift?)");
      return null;
    }
    const begin = this.endpointOf(range.startContainer, range.startOffset, textDivs, doc);
    const end = this.endpointOf(range.endContainer, range.endOffset, textDivs, doc);
    if (!begin || !end) {
      console.debug("Maki[pdf]: selection rejected \u2014 endpoint not in textDivs");
      return null;
    }
    if (!isForwardTextRange(begin, end)) return null;
    return [begin, end];
  }
  onSelectionChange(cb) {
    this.selectionCbs.add(cb);
    return { dispose: () => this.selectionCbs.delete(cb) };
  }
  onSelectionDrag(cb) {
    this.dragCbs.add(cb);
    return { dispose: () => this.dragCbs.delete(cb) };
  }
  pageElOf(node) {
    const el = node instanceof Element ? node : node.parentElement;
    return el?.closest(".page[data-page-number]") ?? null;
  }
  /** DOM endpoint → Obsidian's (text item index, char offset) address. */
  endpointOf(node, offset, textDivs, doc) {
    const el = node instanceof Element ? node : node.parentElement;
    const span = el?.closest(".textLayer span, .textLayer > *");
    if (!span) return null;
    let indexed = span;
    let item = -1;
    while (indexed) {
      item = textDivs.indexOf(indexed);
      if (item >= 0) break;
      indexed = indexed.parentElement?.closest(".textLayer span") ?? null;
    }
    if (item < 0 || !indexed) return null;
    const r = doc.createRange();
    r.selectNodeContents(indexed);
    try {
      r.setEnd(node, offset);
    } catch {
      return null;
    }
    return [item, r.toString().length];
  }
  // ---- highlights
  drawHighlight(h) {
    if (h.locator.backend !== "pdf") return;
    this.highlights.set(h.id, h);
    void this.paintHighlight(h);
  }
  eraseHighlight(id) {
    this.highlights.delete(id);
    this.removeNodes(id);
  }
  clearHighlights() {
    this.highlights.clear();
    const container = this.containerEl();
    container?.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((el) => el.remove());
  }
  onHighlightActivate(cb) {
    this.activateCbs.add(cb);
    return { dispose: () => this.activateCbs.delete(cb) };
  }
  /** Re-inject a page's highlights after PDF.js (re)renders it. */
  async paintPage(pageNumber) {
    for (const h of this.highlights.values()) {
      if (h.locator.backend === "pdf" && h.locator.page === pageNumber) {
        await this.paintHighlight(h);
      }
    }
  }
  /** Best-effort: an unresolvable locator draws nothing and never throws. */
  async paintHighlight(h) {
    try {
      if (h.locator.backend !== "pdf") return;
      const pageView = this.pageView(h.locator.page);
      const viewport = pageView?.viewport;
      const pageEl = pageView?.div;
      if (!pageView || !viewport || !pageEl) return;
      let rects;
      const target = h.locator.target;
      if (target.kind === "text") {
        const items = await this.textItems(h.locator.page);
        rects = selectionRects(items, target.begin, target.end);
      } else if (target.kind === "rect") {
        rects = [target.rect];
      } else {
        return;
      }
      if (this.destroyed || rects.length === 0) return;
      const overlay = this.ensureOverlay(pageEl);
      this.removeNodes(h.id);
      for (const rect of rects) {
        const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(rect);
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const el = overlay.ownerDocument.createElement("div");
        el.className = HIGHLIGHT_CLASS;
        el.dataset["makiId"] = h.id;
        el.style.left = `${left / viewport.width * 100}%`;
        el.style.top = `${top / viewport.height * 100}%`;
        el.style.width = `${Math.abs(x2 - x1) / viewport.width * 100}%`;
        el.style.height = `${Math.abs(y2 - y1) / viewport.height * 100}%`;
        el.style.backgroundColor = `rgba(${h.color.rgb.join(",")}, var(--maki-highlight-opacity, 0.5))`;
        el.addEventListener("click", () => {
          for (const cb of this.activateCbs) cb(h.id);
        });
        overlay.append(el);
      }
      this.clearNativeDuplicate();
    } catch (error) {
      console.error("Maki: PDF highlight failed", error);
    }
  }
  /**
   * The id of the registered Maki highlight covering exactly the native
   * `(page, [[beginItem, beginOffset], [endItem, endOffset]])` text range, if
   * any. Reuses the canonical locator id, so "same range" means "the same
   * highlight the reconciler draws".
   */
  makiHighlightIdAt(pageNumber, range) {
    const nums = Array.isArray(range) && range.length === 2 ? range.flat() : null;
    if (!nums || nums.length !== 4 || nums.some((n) => typeof n !== "number" || !Number.isInteger(n) || n < 0)) {
      return null;
    }
    const [bi, bo, ei, eo] = nums;
    const id = highlightIdFor(
      { backend: "pdf", page: pageNumber, target: { kind: "text", begin: [bi, bo], end: [ei, eo] } },
      PdfLocatorCodec
    );
    return this.highlights.has(id) ? id : null;
  }
  /** Clear the native subpath highlight once Maki draws the same range. */
  clearNativeDuplicate() {
    const sub = this.child.subpathHighlight;
    if (!sub || sub.type !== "text" || typeof sub.page !== "number") return;
    if (this.makiHighlightIdAt(sub.page, sub.range) === null) return;
    this.child.clearTextHighlight?.();
  }
  ensureOverlay(pageEl) {
    const existing = pageEl.querySelector(`:scope > .${OVERLAY_CLASS}`);
    if (existing) return existing;
    const overlay = pageEl.ownerDocument.createElement("div");
    overlay.className = OVERLAY_CLASS;
    pageEl.append(overlay);
    return overlay;
  }
  removeNodes(id) {
    const container = this.containerEl();
    container?.querySelectorAll(`.${HIGHLIGHT_CLASS}[data-maki-id="${CSS.escape(id)}"]`).forEach((el) => el.remove());
  }
  textItems(pageNumber) {
    const cached = this.textItemCache.get(pageNumber);
    if (cached) return cached;
    const pdfDocument = this.child.pdfViewer?.pdfViewer?.pdfDocument;
    const promise = pdfDocument ? pdfDocument.getPage(pageNumber).then((page) => page.getTextContent()).then((content) => toItemBoxes(content.items)) : Promise.resolve([]);
    this.textItemCache.set(pageNumber, promise);
    return promise;
  }
  // ---- metadata / lifecycle
  metadata() {
    const meta = {};
    const basename = this.ref.path.slice(this.ref.path.lastIndexOf("/") + 1);
    meta.title = basename.replace(/\.pdf$/i, "");
    const pageCount = this.child.pdfViewer?.pdfViewer?.pagesCount;
    if (typeof pageCount === "number") meta.pageCount = pageCount;
    if (this.pageLabels) meta.pageLabels = this.pageLabels;
    return meta;
  }
  destroy() {
    this.destroyed = true;
    this.clearHighlights();
    for (const dispose of this.disposers) dispose();
    this.disposers.length = 0;
    this.activateCbs.clear();
    this.selectionCbs.clear();
    this.dragCbs.clear();
  }
};

// src/backends/pdf/pdf-viewer-provider.ts
var ACQUIRE_TIMEOUT_MS2 = 1e4;
var POLL_INTERVAL_MS = 100;
function waitForChild(component) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const settle = (child) => {
      if (settled || !child.pdfViewer?.pdfViewer) return;
      settled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      resolve(child);
    };
    const interval = window.setInterval(() => {
      if (component.child) settle(component.child);
    }, POLL_INTERVAL_MS);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      reject(
        new Error(
          "Obsidian's PDF viewer internals did not become ready \u2014 the private API may have changed in this Obsidian version"
        )
      );
    }, ACQUIRE_TIMEOUT_MS2);
    if (typeof component.then === "function") {
      component.then((child) => settle(child));
    }
  });
}
var PdfViewerProvider = class {
  constructor(deps) {
    this.deps = deps;
  }
  backend = "pdf";
  canHandle(ref) {
    return ref.backend === "pdf" && ref.path.toLowerCase().endsWith(".pdf");
  }
  setup(_ctx) {
    return { dispose: () => {
    } };
  }
  async acquire(host, ref) {
    const view = host;
    const component = view.viewer;
    if (!component) {
      throw new Error("Not a native PDF view (no `viewer` component)");
    }
    const child = await waitForChild(component);
    const adapter = new PdfViewerAdapter(ref, view, child);
    this.injectColorPicker(view, adapter);
    return adapter;
  }
  /**
   * Add the color picker to the native toolbar. Version-guarded DOM
   * injection: an absent/renamed toolbar degrades to no button.
   */
  injectColorPicker(view, adapter) {
    const toolbar = view.containerEl?.querySelector(".pdf-toolbar-right");
    if (!toolbar) return;
    toolbar.querySelectorAll(".maki-color-picker").forEach((el) => el.remove());
    const picker = this.deps.mountColorPicker(toolbar);
    toolbar.prepend(picker.el);
    adapter.own(() => picker.dispose());
  }
};

// src/core/annotation-service.ts
var DEFAULT_ANNOTATION_SETTINGS = {
  snippetTemplate: "> [!quote] {{linkWithDisplay}}\n> {{text}}",
  displayTemplates: {
    pdf: "{{file.basename}}, p.{{page}}",
    epub: "{{file.basename}}, {{chapter}}"
  }
};
function basenameOf(path) {
  const file = path.slice(path.lastIndexOf("/") + 1);
  const dot = file.lastIndexOf(".");
  return dot > 0 ? file.slice(0, dot) : file;
}
function buildVariables(viewer, sel, color, colors, comment) {
  const meta = viewer.metadata();
  const vars = {
    text: sel.text,
    comment: comment ?? "",
    color: colors.serialize(color),
    colorName: color.name ?? "",
    file: {
      path: viewer.ref.path,
      basename: basenameOf(viewer.ref.path)
    }
  };
  if (sel.locator.backend === "pdf") {
    vars["page"] = sel.locator.page;
    vars["pageLabel"] = meta.pageLabels?.[sel.locator.page - 1] ?? sel.locator.page;
    vars["pageCount"] = meta.pageCount;
  } else {
    vars["chapter"] = meta.chapter;
    vars["progress"] = meta.progress;
  }
  return vars;
}
var AnnotationService = class {
  constructor(deps) {
    this.deps = deps;
  }
  /**
   * Turn the viewer's current selection into an annotation snippet and
   * deliver it to `destination`. Returns null when nothing is selected.
   */
  async annotate(viewer, color, destination, comment) {
    const sel = viewer.captureSelection();
    if (!sel) return null;
    const { codecs, templates, colors, notes, settings } = this.deps;
    const s = settings();
    const params = {
      ...codecs[sel.locator.backend].encode(sel.locator),
      [COLOR_PARAM_KEY]: colors.serialize(color)
    };
    const vars = buildVariables(viewer, sel, color, colors, comment);
    const display = templates.expand(s.displayTemplates[sel.locator.backend], vars);
    const link = buildLink(viewer.ref, params);
    const linkWithDisplay = buildLink(viewer.ref, params, display);
    const snippet = templates.expand(s.snippetTemplate, {
      ...vars,
      link,
      linkWithDisplay,
      display
    });
    if (destination === "clipboard") await notes.copyToClipboard(snippet);
    else await notes.insertIntoActiveNote(snippet);
    return { link: linkWithDisplay, snippet };
  }
};

// src/core/color-model.ts
var DEFAULT_PALETTE = {
  yellow: [255, 208, 0],
  red: [255, 86, 86],
  green: [68, 207, 110],
  blue: [84, 155, 255]
};
function isValidPaletteName(name) {
  return /^[\w-]+$/.test(name);
}
function rgbToHex(rgb2) {
  return `#${rgb2.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
function hexToRgb(hex) {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}
function renamePaletteColor(palette, from, to) {
  const next = {};
  for (const [name, rgb2] of Object.entries(palette)) next[name === from ? to : name] = rgb2;
  return next;
}
function nextColorName(palette) {
  for (let n = 1; ; n++) {
    const name = `color-${n}`;
    if (!(name in palette)) return name;
  }
}
function parseChannel(value) {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n <= 255 ? n : null;
}
var ColorModel = class {
  constructor(palette = DEFAULT_PALETTE) {
    this.palette = palette;
  }
  /** Resolve a palette name to a Color, or null if not in the palette. */
  fromName(name) {
    const rgb2 = this.palette[name];
    return rgb2 ? { name, rgb: [...rgb2] } : null;
  }
  /**
   * Parse a `color` subpath value: a palette name or `r,g,b` (three 0–255
   * ints). Returns null for anything else — callers fall back to a default
   * rather than skipping the highlight (only *locators* gate rendering).
   */
  parse(value) {
    const named = this.fromName(value);
    if (named) return named;
    const parts = value.split(",").map((p) => parseChannel(p.trim()));
    if (parts.length !== 3 || parts.some((p) => p === null)) return null;
    return { rgb: parts };
  }
  /** Serialize a Color to its subpath value: the name, or `r,g,b`. */
  serialize(color) {
    return color.name ?? color.rgb.join(",");
  }
};

// src/core/highlight-reconciler.ts
function compareBySource(a, b) {
  return a.source.path.localeCompare(b.source.path) || (a.source.line ?? 0) - (b.source.line ?? 0);
}
function sameSource(a, b) {
  return a.path === b.path && a.line === b.line;
}
function sameColor(a, b) {
  return a.name === b.name && a.rgb[0] === b.rgb[0] && a.rgb[1] === b.rgb[1] && a.rgb[2] === b.rgb[2];
}
function sameHighlight(a, b) {
  return sameColor(a.color, b.color) && a.sources.length === b.sources.length && a.sources.every((s, i) => sameSource(s, b.sources[i]));
}
var HighlightReconciler = class {
  constructor(codecs, colors, defaultColor) {
    this.codecs = codecs;
    this.colors = colors;
    this.defaultColor = defaultColor;
  }
  /** Per-viewer state — several documents can be open at once. */
  current = /* @__PURE__ */ new Map();
  reconcile(viewer, entries) {
    const codec2 = this.codecs[viewer.backend];
    const desired = /* @__PURE__ */ new Map();
    let skipped = 0;
    for (const entry of [...entries].sort(compareBySource)) {
      const locator = codec2.decode(entry.subpath);
      if (!locator) {
        skipped++;
        continue;
      }
      const id = highlightIdFor(locator, codec2);
      const color = (entry.color !== void 0 ? this.colors.parse(entry.color) : null) ?? this.defaultColor;
      const existing = desired.get(id);
      if (existing) {
        if (!existing.sources.some((s) => sameSource(s, entry.source))) {
          existing.sources.push(entry.source);
        }
      } else {
        desired.set(id, { id, locator, color, sources: [entry.source] });
      }
    }
    const prev = this.current.get(viewer) ?? /* @__PURE__ */ new Map();
    for (const [id, highlight] of desired) {
      const before = prev.get(id);
      if (!before || !sameHighlight(before, highlight)) viewer.drawHighlight(highlight);
    }
    for (const id of prev.keys()) {
      if (!desired.has(id)) viewer.eraseHighlight(id);
    }
    this.current.set(viewer, desired);
    return { drawn: desired.size, skipped };
  }
  /**
   * Look up a currently drawn highlight, e.g. to resolve a highlight click
   * back to its source notes.
   */
  getHighlight(viewer, id) {
    return this.current.get(viewer)?.get(id) ?? null;
  }
  /** Forget a closed viewer's state (called from the viewer's dispose path). */
  detach(viewer) {
    this.current.delete(viewer);
  }
};

// src/core/selection-auto-annotator.ts
var defaultSchedule = (cb, delayMs) => {
  const handle = setTimeout(cb, delayMs);
  return () => clearTimeout(handle);
};
var SELECTION_SETTLE_MS = 300;
function selectionKey(sel) {
  return `${JSON.stringify(sel.locator)}\0${sel.text}`;
}
var SelectionAutoAnnotator = class {
  constructor(deps) {
    this.deps = deps;
  }
  states = /* @__PURE__ */ new Map();
  /** Feed every `DocumentViewer.onSelectionChange` event here. */
  onSelection(viewer, sel) {
    const state = this.state(viewer);
    state.cancel?.();
    state.cancel = null;
    if (sel === null) {
      state.lastKey = null;
      state.heldKey = null;
      return;
    }
    if (!this.deps.enabled()) return;
    const key = selectionKey(sel);
    if (key === state.lastKey) {
      state.heldKey = null;
      return;
    }
    if (state.dragging) {
      state.heldKey = key;
      return;
    }
    this.arm(viewer, state, key);
  }
  /** Feed every `DocumentViewer.onSelectionDrag` event here. */
  onDragChange(viewer, dragging) {
    const state = this.state(viewer);
    state.dragging = dragging;
    if (dragging) {
      state.cancel?.();
      state.cancel = null;
      state.heldKey = null;
      return;
    }
    const key = state.heldKey;
    state.heldKey = null;
    if (key === null || key === state.lastKey || !this.deps.enabled()) return;
    this.arm(viewer, state, key);
  }
  /** Drop a viewer's state and cancel its pending work (viewer closed). */
  detach(viewer) {
    this.states.get(viewer)?.cancel?.();
    this.states.delete(viewer);
  }
  arm(viewer, state, key) {
    const schedule = this.deps.schedule ?? defaultSchedule;
    state.cancel = schedule(() => {
      state.cancel = null;
      if (!this.deps.enabled()) return;
      state.lastKey = key;
      this.deps.annotate(viewer);
    }, this.deps.settleMs ?? SELECTION_SETTLE_MS);
  }
  state(viewer) {
    let state = this.states.get(viewer);
    if (!state) {
      state = { cancel: null, lastKey: null, dragging: false, heldKey: null };
      this.states.set(viewer, state);
    }
    return state;
  }
};

// src/core/template-engine.ts
var PLACEHOLDER = /\{\{\s*([\w.]+)\s*\}\}/g;
function lookup(vars, path) {
  let value = vars;
  for (const segment of path.split(".")) {
    if (value === null || typeof value !== "object") return void 0;
    value = value[segment];
  }
  return value;
}
var TemplateEngine = class {
  expand(template, vars) {
    return template.replace(PLACEHOLDER, (_match, path) => {
      const value = lookup(vars, path);
      return value === void 0 || value === null ? "" : String(value);
    });
  }
};

// src/core/viewer-registry.ts
var ViewerRegistry = class {
  providers = [];
  /** Register a provider. Selection prefers earlier registrations on ties. */
  register(provider) {
    this.providers.push(provider);
    return {
      dispose: () => {
        const i = this.providers.indexOf(provider);
        if (i >= 0) this.providers.splice(i, 1);
      }
    };
  }
  /** The first registered provider that can handle the ref, or null. */
  providerFor(ref) {
    return this.providers.find((p) => p.canHandle(ref)) ?? null;
  }
};

// src/obsidian/backlink-index.ts
var import_obsidian2 = require("obsidian");
var CHANGE_DEBOUNCE_MS = 250;
var ObsidianBacklinkIndex = class {
  constructor(app) {
    this.app = app;
  }
  /** Every backlink (in any note) whose subpath targets the document. */
  forDocument(ref) {
    const { metadataCache } = this.app;
    const entries = [];
    for (const sourcePath of this.sourcePaths(ref)) {
      const cache = metadataCache.getCache(sourcePath);
      if (!cache) continue;
      for (const link of [...cache.links ?? [], ...cache.embeds ?? []]) {
        const parsed = parseAnnotationLink(link.link);
        if (!parsed) continue;
        const dest = metadataCache.getFirstLinkpathDest(parsed.linkpath, sourcePath);
        if (dest?.path !== ref.path) continue;
        const entry = {
          subpath: parsed.params,
          source: { path: sourcePath, line: link.position.start.line }
        };
        if (parsed.color !== void 0) entry.color = parsed.color;
        entries.push(entry);
      }
    }
    return entries;
  }
  /**
   * Fire (debounced) whenever a note that links — or linked — to the document
   * changes, is deleted, or is renamed. Unrelated notes never trigger it.
   */
  onChange(ref, cb) {
    const notify = (0, import_obsidian2.debounce)(cb, CHANGE_DEBOUNCE_MS, true);
    const sources = new Set(this.sourcePaths(ref));
    const touched = (path) => {
      const now = this.linksTo(path, ref);
      const before = sources.has(path);
      if (now) sources.add(path);
      else sources.delete(path);
      if (now || before) notify();
    };
    const { metadataCache, vault } = this.app;
    const refs = [
      [metadataCache, metadataCache.on("changed", (file) => touched(file.path))],
      // "changed" fires before the link resolver updates `resolvedLinks`, so
      // a note's *first* link to the document is invisible to `linksTo` at
      // that point; "resolve" fires once resolution lands and closes the gap.
      [metadataCache, metadataCache.on("resolve", (file) => touched(file.path))],
      [metadataCache, metadataCache.on("deleted", (file) => touched(file.path))],
      [
        vault,
        vault.on("rename", (file, oldPath) => {
          if (sources.delete(oldPath)) notify();
          if (file instanceof import_obsidian2.TFile) touched(file.path);
        })
      ]
    ];
    return {
      dispose: () => {
        notify.cancel();
        for (const [owner, eventRef] of refs) owner.offref(eventRef);
      }
    };
  }
  linksTo(sourcePath, ref) {
    return (this.app.metadataCache.resolvedLinks[sourcePath]?.[ref.path] ?? 0) > 0;
  }
  sourcePaths(ref) {
    return Object.keys(this.app.metadataCache.resolvedLinks).filter(
      (path) => this.linksTo(path, ref)
    );
  }
};

// src/obsidian/color-picker.ts
var import_obsidian3 = require("obsidian");
function rgb(color) {
  return `rgb(${color.rgb.join(",")})`;
}
function label(color) {
  return color.name ?? color.rgb.join(",");
}
function mountColorPicker(parent, deps) {
  const button = parent.createDiv({ cls: "clickable-icon maki-color-picker" });
  const dot = button.createDiv({ cls: "maki-color-picker-dot" });
  const refresh = () => {
    const color = deps.selected();
    dot.style.backgroundColor = rgb(color);
    (0, import_obsidian3.setTooltip)(button, `Highlight color: ${label(color)}`);
  };
  refresh();
  button.addEventListener("click", () => {
    const current = deps.selected();
    const menu = new import_obsidian3.Menu();
    for (const color of deps.colors()) {
      menu.addItem(
        (item) => item.setTitle(
          createFragment((frag) => {
            const swatch = frag.createSpan({ cls: "maki-color-swatch" });
            swatch.style.backgroundColor = rgb(color);
            frag.createSpan({ text: label(color) });
          })
        ).setChecked(label(color) === label(current) ? true : null).onClick(() => {
          deps.select(color);
          refresh();
        })
      );
    }
    const rect = button.getBoundingClientRect();
    menu.showAtPosition({ x: rect.x, y: rect.bottom, width: rect.width, overlap: true, left: false });
  });
  return { el: button, refresh, dispose: () => button.remove() };
}

// src/obsidian/commands.ts
var import_obsidian5 = require("obsidian");

// src/obsidian/modals.ts
var import_obsidian4 = require("obsidian");
var SourceSuggestModal = class extends import_obsidian4.SuggestModal {
  constructor(app, sources, onPick) {
    super(app);
    this.sources = sources;
    this.onPick = onPick;
    this.setPlaceholder("Open source note\u2026");
  }
  getSuggestions(query) {
    const q = query.toLowerCase();
    return this.sources.filter((s) => s.path.toLowerCase().includes(q));
  }
  renderSuggestion(source, el) {
    el.createSpan({
      text: source.line !== void 0 ? `${source.path}:${source.line + 1}` : source.path
    });
  }
  onChooseSuggestion(source) {
    this.onPick(source);
  }
};
var CommentModal = class extends import_obsidian4.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  value = "";
  submitted = false;
  onOpen() {
    this.titleEl.setText("Annotation comment");
    const input = this.contentEl.createEl("input", {
      type: "text",
      cls: "maki-comment-input",
      placeholder: "Comment\u2026"
    });
    input.addEventListener("input", () => this.value = input.value);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        this.submit();
      }
    });
    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    const ok = buttons.createEl("button", { text: "Annotate", cls: "mod-cta" });
    ok.addEventListener("click", () => this.submit());
    input.focus();
  }
  submit() {
    if (this.submitted) return;
    this.submitted = true;
    this.close();
    this.onSubmit(this.value);
  }
};

// src/obsidian/commands.ts
async function annotateViewer(plugin, viewer, color, destination, opts = {}) {
  try {
    const result = await plugin.annotations.annotate(viewer, color, destination, opts.comment);
    if (!result) {
      if (!opts.quiet) new import_obsidian5.Notice("Maki: nothing is selected");
      return;
    }
    if (destination === "clipboard") new import_obsidian5.Notice("Maki: link copied");
  } catch (error) {
    console.error("Maki: annotate failed", error);
    new import_obsidian5.Notice(`Maki: ${error instanceof Error ? error.message : "annotation failed"}`);
  }
}
async function annotate(plugin, color, destination, comment) {
  const viewer = plugin.viewers.activeViewer();
  if (!viewer) {
    new import_obsidian5.Notice("Maki: no document preview is open");
    return;
  }
  await annotateViewer(plugin, viewer, color, destination, { comment });
}
var ON_SELECT_CYCLE = {
  off: "copy",
  copy: "insert",
  insert: "off"
};
var ON_SELECT_NOTICE = {
  off: "do nothing",
  copy: "copy the link",
  insert: "insert the link into the note"
};
function registerCommands(plugin) {
  const families = [
    { id: "copy-link-to-selection", verb: "Copy link to selection", destination: "clipboard" },
    { id: "insert-link-into-note", verb: "Insert link into note", destination: "note" }
  ];
  for (const { id, verb, destination } of families) {
    plugin.addCommand({
      id,
      name: verb,
      callback: () => void annotate(plugin, plugin.selectedColor(), destination)
    });
    plugin.addCommand({
      id: `${id}-with-comment`,
      name: `${verb} with comment`,
      callback: () => {
        new CommentModal(plugin.app, (comment) => {
          void annotate(plugin, plugin.selectedColor(), destination, comment);
        }).open();
      }
    });
  }
  plugin.addCommand({
    id: "cycle-on-select-action",
    name: "Cycle what selecting text does (off / copy / insert)",
    callback: () => {
      void plugin.updateSettings((s) => {
        s.onSelect = ON_SELECT_CYCLE[s.onSelect];
      }).then(() => {
        new import_obsidian5.Notice(`Maki: selecting text will ${ON_SELECT_NOTICE[plugin.settings.onSelect]}`);
      });
    }
  });
}

// src/obsidian/note-writer.ts
var import_obsidian6 = require("obsidian");

// src/core/note-insertion.ts
function insertionBlock(text, atLineStart) {
  return atLineStart ? `${text}
` : `
${text}
`;
}

// src/obsidian/note-writer.ts
function electronClipboard() {
  try {
    const req = window.require;
    const electron = req?.("electron");
    return electron?.clipboard ?? null;
  } catch {
    return null;
  }
}
var ObsidianNoteWriter = class {
  constructor(app) {
    this.app = app;
  }
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const clipboard = electronClipboard();
      if (!clipboard) throw error;
      clipboard.writeText(text);
    }
  }
  /**
   * Insert the snippet at the cursor of the last-active markdown note.
   * Throws when no markdown note is open — callers surface this as a notice.
   */
  async insertIntoActiveNote(text) {
    const view = this.lastActiveMarkdownView();
    if (!view?.file) throw new Error("No markdown note is open to paste into");
    this.insertAtCursor(view, text);
  }
  /** Delete-from-preview = remove the link from its note. */
  async removeLink(source, subpath) {
    const file = this.app.vault.getFileByPath(source.path);
    if (!file) return;
    await this.app.vault.process(file, (content) => {
      return removeAnnotationLink(content, subpath, source.line) ?? content;
    });
  }
  /** The most recently active markdown view (the insert target). */
  lastActiveMarkdownView() {
    const active = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (active) return active;
    let best = null;
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof import_obsidian6.MarkdownView)) continue;
      const time = leaf.activeTime ?? 0;
      if (!best || time > best.time) best = { view, time };
    }
    return best?.view ?? null;
  }
  insertAtCursor(view, text) {
    const editor = view.editor;
    const cursor = editor.getCursor();
    const block = insertionBlock(text, cursor.ch === 0);
    editor.replaceRange(block, cursor);
    editor.setCursor(editor.offsetToPos(editor.posToOffset(cursor) + block.length));
  }
};

// src/obsidian/settings.ts
var import_obsidian7 = require("obsidian");
var DEFAULT_SETTINGS = {
  version: 1,
  palette: { ...DEFAULT_PALETTE },
  selectedColor: "",
  snippetTemplate: DEFAULT_ANNOTATION_SETTINGS.snippetTemplate,
  displayTemplates: { ...DEFAULT_ANNOTATION_SETTINGS.displayTemplates },
  onSelect: "off",
  epub: {
    flow: "paginated",
    fontSizePercent: 100,
    followTheme: true
  },
  readingPositions: {}
};
var MakiSettingTab = class extends import_obsidian7.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    const s = this.plugin.settings;
    containerEl.empty();
    this.displayPalette();
    new import_obsidian7.Setting(containerEl).setName("Snippet template").setDesc("Block inserted into the note. Variables: {{linkWithDisplay}}, {{text}}, {{comment}}, \u2026.").addTextArea(
      (text) => text.setValue(s.snippetTemplate).onChange(async (value) => {
        await this.plugin.updateSettings((settings) => {
          settings.snippetTemplate = value || DEFAULT_SETTINGS.snippetTemplate;
        });
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Link display text (PDF)").addText(
      (text) => text.setValue(s.displayTemplates.pdf).onChange(async (value) => {
        await this.plugin.updateSettings((settings) => {
          settings.displayTemplates.pdf = value || DEFAULT_SETTINGS.displayTemplates.pdf;
        });
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Link display text (EPUB)").addText(
      (text) => text.setValue(s.displayTemplates.epub).onChange(async (value) => {
        await this.plugin.updateSettings((settings) => {
          settings.displayTemplates.epub = value || DEFAULT_SETTINGS.displayTemplates.epub;
        });
      })
    );
    new import_obsidian7.Setting(containerEl).setName("On text selection").setDesc(
      "What selecting text in the preview does by itself, with the toolbar color \u2014 no command needed."
    ).addDropdown(
      (dropdown) => dropdown.addOptions({
        off: "Do nothing",
        copy: "Copy link to clipboard",
        insert: "Insert link into note"
      }).setValue(s.onSelect).onChange(async (value) => {
        await this.plugin.updateSettings((settings) => {
          settings.onSelect = value;
        });
      })
    );
  }
  /**
   * The palette as a strip of chips — the same "swatch + name" the toolbar
   * picker menu shows, so the setting looks like what it configures.
   */
  displayPalette() {
    const setting = new import_obsidian7.Setting(this.containerEl).setName("Highlight colors").setDesc(
      "The palette offered by the toolbar picker; the first color is the default. Links in notes store the color name, so renaming or deleting one makes existing annotations fall back to the default."
    );
    setting.settingEl.addClass("maki-palette-setting");
    const strip = setting.settingEl.createDiv({ cls: "maki-palette-chips" });
    const palette = this.plugin.settings.palette;
    const lastColor = Object.keys(palette).length <= 1;
    for (const [name, rgb2] of Object.entries(palette)) {
      this.displayColorChip(strip, name, rgb2, lastColor);
    }
    const add = strip.createEl("button", { cls: "maki-color-chip maki-chip-add" });
    const addIcon = add.createSpan({ cls: "maki-chip-add-icon" });
    (0, import_obsidian7.setIcon)(addIcon, "plus");
    add.createSpan({ text: "Add color" });
    add.addEventListener("click", async () => {
      await this.plugin.updateSettings((settings) => {
        settings.palette[nextColorName(settings.palette)] = [255, 165, 0];
      });
      this.display();
    });
  }
  /** One chip: swatch (opens the color dialog) + inline name + delete. */
  displayColorChip(strip, name, rgb2, lastColor) {
    const chip = strip.createDiv({ cls: "maki-color-chip" });
    let currentName = name;
    const swatch = chip.createDiv({ cls: "maki-chip-swatch" });
    swatch.style.backgroundColor = `rgb(${rgb2.join(",")})`;
    (0, import_obsidian7.setTooltip)(swatch, "Change color");
    const swatchInput = swatch.createEl("input", {
      type: "color",
      cls: "maki-chip-swatch-input"
    });
    swatchInput.value = rgbToHex(rgb2);
    swatchInput.addEventListener("change", async () => {
      const nextRgb = hexToRgb(swatchInput.value);
      if (!nextRgb) return;
      swatch.style.backgroundColor = `rgb(${nextRgb.join(",")})`;
      await this.plugin.updateSettings((settings) => {
        settings.palette[currentName] = nextRgb;
      });
    });
    const nameInput = chip.createEl("input", { type: "text", cls: "maki-chip-name" });
    nameInput.value = name;
    (0, import_obsidian7.setTooltip)(nameInput, "Rename (the name is stored in links)");
    nameInput.addEventListener("change", async () => {
      const next = nameInput.value.trim();
      if (next === currentName) return;
      const invalid = !isValidPaletteName(next);
      if (invalid || next in this.plugin.settings.palette) {
        new import_obsidian7.Notice(
          invalid ? "Color names may only use letters, digits, _ and -." : `A color named "${next}" already exists.`
        );
        nameInput.value = currentName;
        return;
      }
      const previous = currentName;
      currentName = next;
      await this.plugin.updateSettings((settings) => {
        settings.palette = renamePaletteColor(settings.palette, previous, next);
        if (settings.selectedColor === previous) settings.selectedColor = next;
      });
    });
    if (!lastColor) {
      const remove = chip.createEl("button", {
        cls: "maki-chip-delete",
        attr: { "aria-label": "Delete color" }
      });
      (0, import_obsidian7.setIcon)(remove, "trash-2");
      (0, import_obsidian7.setTooltip)(remove, "Delete color");
      remove.addEventListener("click", async () => {
        await this.plugin.updateSettings((settings) => {
          delete settings.palette[currentName];
          if (settings.selectedColor === currentName) settings.selectedColor = "";
        });
        this.display();
      });
    }
  }
};

// src/obsidian/viewer-manager.ts
var import_obsidian8 = require("obsidian");
var VIEW_TYPES = {
  pdf: "pdf",
  [MAKI_EPUB_VIEW_TYPE]: "epub"
};
var ViewerManager = class {
  constructor(app, registry, reconciler, index, onHighlightActivate, bindViewer) {
    this.app = app;
    this.registry = registry;
    this.reconciler = reconciler;
    this.index = index;
    this.onHighlightActivate = onHighlightActivate;
    this.bindViewer = bindViewer;
  }
  open = /* @__PURE__ */ new Map();
  attaching = /* @__PURE__ */ new Set();
  lastActive = null;
  /**
   * Reconcile tracked leaves with the current workspace. Called on
   * layout-change / active-leaf-change; cheap when nothing changed.
   */
  scan() {
    const seen = /* @__PURE__ */ new Set();
    for (const viewType of Object.keys(VIEW_TYPES)) {
      for (const leaf of this.app.workspace.getLeavesOfType(viewType)) {
        seen.add(leaf);
        const file = leaf.view.file;
        const tracked = this.open.get(leaf);
        if (tracked && file && tracked.path === file.path) continue;
        if (tracked) this.teardown(leaf);
        if (file instanceof import_obsidian8.TFile) {
          void this.attach(leaf, file, VIEW_TYPES[viewType]);
        }
      }
    }
    for (const leaf of [...this.open.keys()]) {
      if (!seen.has(leaf)) this.teardown(leaf);
    }
  }
  noteActiveLeaf(leaf) {
    if (leaf && (this.open.has(leaf) || this.attaching.has(leaf))) {
      this.lastActive = leaf;
    }
  }
  /**
   * The viewer commands should act on: the most recently active document
   * leaf (kept current via `noteActiveLeaf`), else the only open one.
   */
  activeViewer() {
    if (this.lastActive) {
      const entry = this.open.get(this.lastActive);
      if (entry) return entry.viewer;
    }
    if (this.open.size === 1) return [...this.open.values()][0].viewer;
    return null;
  }
  /** Re-run reconcile for every open viewer (e.g. after a palette change). */
  refreshAll() {
    for (const entry of this.open.values()) {
      this.reconcile(entry, { path: entry.path, backend: entry.viewer.backend });
    }
  }
  destroyAll() {
    for (const leaf of [...this.open.keys()]) this.teardown(leaf);
  }
  async attach(leaf, file, backend) {
    if (this.attaching.has(leaf)) return;
    const ref = { path: file.path, backend };
    const provider = this.registry.providerFor(ref);
    if (!provider) return;
    this.attaching.add(leaf);
    try {
      const viewer = await provider.acquire(leaf.view, ref);
      const current = leaf.view?.file;
      if (!current || current.path !== ref.path || this.open.has(leaf)) {
        viewer.destroy();
        return;
      }
      const entry = { viewer, path: ref.path, subs: [], lastSkipped: 0 };
      entry.subs.push(this.index.onChange(ref, () => this.reconcile(entry, ref)));
      entry.subs.push(
        viewer.onHighlightActivate((id) => this.onHighlightActivate(viewer, id))
      );
      if (this.bindViewer) entry.subs.push(this.bindViewer(viewer));
      this.open.set(leaf, entry);
      this.reconcile(entry, ref);
    } catch (error) {
      console.error(`Maki: could not attach to ${ref.path}`, error);
      new import_obsidian8.Notice(`Maki: annotations unavailable for ${file.name} (see console)`);
    } finally {
      this.attaching.delete(leaf);
    }
  }
  reconcile(entry, ref) {
    const summary = this.reconciler.reconcile(entry.viewer, this.index.forDocument(ref));
    if (summary.skipped > 0 && summary.skipped !== entry.lastSkipped) {
      new import_obsidian8.Notice(
        `Maki: ${summary.skipped} annotation link(s) to ${ref.path} could not be read`
      );
    }
    entry.lastSkipped = summary.skipped;
  }
  teardown(leaf) {
    const entry = this.open.get(leaf);
    if (!entry) return;
    this.open.delete(leaf);
    if (this.lastActive === leaf) this.lastActive = null;
    for (const sub of entry.subs) sub.dispose();
    this.reconciler.detach(entry.viewer);
    entry.viewer.destroy();
  }
};
async function openNoteAt(app, source) {
  const file = app.vault.getFileByPath(source.path);
  if (!file) {
    new import_obsidian8.Notice(`Maki: source note not found: ${source.path}`);
    return;
  }
  const eState = source.line !== void 0 ? { line: source.line } : void 0;
  for (const leaf of app.workspace.getLeavesOfType("markdown")) {
    const view = leaf.view;
    if (view.file?.path === file.path) {
      app.workspace.revealLeaf(leaf);
      if (eState) leaf.setEphemeralState(eState);
      return;
    }
  }
  await app.workspace.getLeaf("tab").openFile(file, eState ? { eState } : void 0);
}

// src/main.ts
var FALLBACK_COLOR = { name: "yellow", rgb: [...DEFAULT_PALETTE["yellow"]] };
var POSITION_SAVE_MS = 1e3;
var MakiPlugin = class extends import_obsidian9.Plugin {
  codecs = { pdf: PdfLocatorCodec, epub: EpubLocatorCodec };
  /**
   * The one palette object handed to `ColorModel`. Settings changes are
   * synced *into* it (in place), so the core always sees the current palette
   * without being rebuilt.
   */
  livePalette = {};
  colors;
  /** Refresh hooks of the mounted toolbar color pickers (one per open viewer). */
  pickerRefreshers = /* @__PURE__ */ new Set();
  /**
   * Deferred save for reading-position updates: they carry no palette /
   * template changes, so they skip `updateSettings`' reconcile-and-refresh
   * but still funnel into the same `saveData` persistence.
   */
  savePositionsSoon = (0, import_obsidian9.debounce)(
    () => void this.saveData(this.settings).catch(
      (error) => console.error("Maki: could not save reading position", error)
    ),
    POSITION_SAVE_MS
  );
  annotations;
  reconciler;
  viewers;
  async onload() {
    await this.loadSettings();
    this.colors = new ColorModel(this.livePalette);
    this.reconciler = new HighlightReconciler(this.codecs, this.colors, this.defaultColor());
    this.annotations = new AnnotationService({
      codecs: this.codecs,
      templates: new TemplateEngine(),
      colors: this.colors,
      notes: new ObsidianNoteWriter(this.app),
      settings: () => this.annotationSettings()
    });
    const registry = new ViewerRegistry();
    const providers = [
      new PdfViewerProvider({
        mountColorPicker: (parent) => this.mountColorPicker(parent)
      }),
      new EpubViewerProvider({
        mountColorPicker: (parent) => this.mountColorPicker(parent),
        prefs: () => this.settings.epub,
        // updateSettings re-applies preferences to every open EPUB view.
        updatePrefs: (mutate) => void this.updateSettings((settings) => mutate(settings.epub)),
        getPosition: (path) => this.settings.readingPositions[path],
        setPosition: (path, cfi) => {
          this.settings.readingPositions[path] = cfi;
          this.savePositionsSoon();
        }
      })
    ];
    for (const provider of providers) {
      this.register(registry.register(provider).dispose);
      this.register(provider.setup(this).dispose);
    }
    const autoAnnotator = new SelectionAutoAnnotator({
      enabled: () => this.settings.onSelect !== "off",
      annotate: (viewer) => void annotateViewer(
        this,
        viewer,
        this.selectedColor(),
        this.settings.onSelect === "insert" ? "note" : "clipboard",
        { quiet: true }
      )
    });
    const index = new ObsidianBacklinkIndex(this.app);
    this.viewers = new ViewerManager(
      this.app,
      registry,
      this.reconciler,
      index,
      (viewer, id) => this.openHighlightSources(viewer, id),
      (viewer) => {
        const sub = viewer.onSelectionChange((sel) => autoAnnotator.onSelection(viewer, sel));
        const drag = viewer.onSelectionDrag(
          (dragging) => autoAnnotator.onDragChange(viewer, dragging)
        );
        return {
          dispose: () => {
            sub.dispose();
            drag.dispose();
            autoAnnotator.detach(viewer);
          }
        };
      }
    );
    this.registerEvent(this.app.workspace.on("layout-change", () => this.viewers.scan()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.viewers.scan()));
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        this.viewers.noteActiveLeaf(leaf);
        this.viewers.scan();
      })
    );
    this.app.workspace.onLayoutReady(() => this.viewers.scan());
    registerCommands(this);
    this.addSettingTab(new MakiSettingTab(this));
  }
  onunload() {
    this.viewers.destroyAll();
    this.savePositionsSoon.run();
  }
  // ---- settings
  async updateSettings(mutate) {
    mutate(this.settings);
    this.syncLivePalette();
    await this.saveData(this.settings);
    this.viewers.refreshAll();
    for (const refresh of this.pickerRefreshers) refresh();
    for (const leaf of this.app.workspace.getLeavesOfType(MAKI_EPUB_VIEW_TYPE)) {
      if (leaf.view instanceof MakiEpubView) leaf.view.applyPreferences();
    }
  }
  defaultColor() {
    const first = Object.keys(this.livePalette)[0];
    return (first !== void 0 ? this.colors?.fromName(first) : null) ?? FALLBACK_COLOR;
  }
  /** The toolbar-picked color the annotate commands use (FR-9.2). */
  selectedColor() {
    return this.colors.fromName(this.settings.selectedColor) ?? this.defaultColor();
  }
  /**
   * Mount a toolbar color picker bound to the persisted selection. One per
   * open viewer; disposing unhooks it from settings refreshes.
   */
  mountColorPicker(parent) {
    const handle = mountColorPicker(parent, {
      colors: () => this.paletteColors(),
      selected: () => this.selectedColor(),
      select: (color) => void this.updateSettings((settings) => {
        settings.selectedColor = color.name ?? "";
      })
    });
    this.pickerRefreshers.add(handle.refresh);
    return {
      el: handle.el,
      dispose: () => {
        this.pickerRefreshers.delete(handle.refresh);
        handle.dispose();
      }
    };
  }
  paletteColors() {
    return Object.keys(this.livePalette).map((name) => this.colors.fromName(name)).filter((color) => color !== null);
  }
  async loadSettings() {
    const stored = await this.loadData();
    const raw = stored ?? {};
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...raw,
      version: 1,
      palette: { ...raw.palette ?? DEFAULT_SETTINGS.palette },
      displayTemplates: { ...DEFAULT_SETTINGS.displayTemplates, ...raw.displayTemplates },
      epub: { ...DEFAULT_SETTINGS.epub, ...raw.epub },
      readingPositions: { ...raw.readingPositions ?? {} }
    };
    this.syncLivePalette();
  }
  syncLivePalette() {
    for (const key of Object.keys(this.livePalette)) {
      if (!(key in this.settings.palette)) delete this.livePalette[key];
    }
    Object.assign(this.livePalette, this.settings.palette);
  }
  annotationSettings() {
    const s = this.settings;
    return {
      snippetTemplate: s.snippetTemplate,
      displayTemplates: { ...s.displayTemplates }
    };
  }
  // ---- navigation
  openHighlightSources(viewer, id) {
    const highlight = this.reconciler.getHighlight(viewer, id);
    if (!highlight || highlight.sources.length === 0) return;
    if (highlight.sources.length === 1) {
      void openNoteAt(this.app, highlight.sources[0]);
      return;
    }
    new SourceSuggestModal(this.app, highlight.sources, (source) => {
      void openNoteAt(this.app, source);
    }).open();
  }
};
