/**
 * @fileoverview Webpack entry point.
 *
 * Responsibilities:
 *  - Aggregates CSS imports.
 *  - Initializes app on DOMContentLoaded
 *
 * @module index
 */
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/utilities.css";
import { initApp } from "./controller.js";

console.log("🚀 Webpack Template Running!");

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
