/**
 * @fileoverview Generic DOM / UI utility functions
 *
 * Responsibilities:
 * - Show/hide/toggle elements
 * - Generic event binding helpers
 * - Element creation helpers
 * - Can be extended with more DOM utility methods
 *
 * Example:
 *   UIUtils.show('#sidebar');
 *
 * @module UIUtils
 */
export const UIUtils = {
    show(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = "";
    },
    hide(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = "none";
    },
    toggle(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = el.style.display === "none" ? "" : "none";
    },
    bindEvent(selector, eventType, callback) {
        const el = document.querySelector(selector);
        if (el) el.addEventListener(eventType, callback);
    },
    createElement(tag, classNames = [], textContent = "") {
        const el = document.createElement(tag);
        // Normalize input
        const classes = Array.isArray(classNames) ? classNames : classNames ? [classNames] : [];

        classes.forEach((cls) => el.classList.add(cls));
        el.textContent = textContent;
        return el;
    },
    createClickableButton(classNames = [], textContent = "", onClick) {
        const btn = this.createElement("button", classNames, textContent);
        btn.addEventListener("click", onClick);
        return btn;
    },
    clearChildren(parent) {
        while (parent.firstChild) parent.removeChild(parent.firstChild);
    },
    createSVGFromSpriteSheet(classNames = [], symbolId) {
        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        // Normalize: accept "icon" or ["icon"]
        if (typeof classNames === "string") {
            classNames = [classNames];
        }

        if (Array.isArray(classNames)) {
            classNames.forEach((cls) => svg.classList.add(cls));
        }
        svg.setAttribute("viewBox", "0 0 24 24");

        const use = document.createElementNS(SVG_NS, "use");
        use.setAttribute("href", symbolId); // or "xlink:href" if you support older browsers
        svg.appendChild(use);

        return svg;
    },
    async renderSvg({ path, target, className = "" }) {
        const response = await fetch(path);
        const svg = await response.text();

        target.innerHTML = svg;

        const svgEl = target.querySelector("svg");
        if (className) svgEl.classList.add(className);

        return svgEl;
    },
};
