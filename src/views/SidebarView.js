/**
 * @fileoverview A reusable sidebar component for rendering selectable models.
 *
 * Responsibilities:
 *  - Render a vertical list of models (labels + icons optional).
 *  - Highlight the currently active model.
 *  - Emit events when an model is clicked.
 *  - Emit an event when the "create / add model" button is clicked.
 *  - Stay fully decoupled from data models; receives data through arguments.
 *
 * Usage example:
 *  const sidebar = new SidebarView(document.querySelector("#sidebar"));
 *
 *  sidebar.onModelSelected((id) => {
 *      console.log("Selected model:", id);
 *  });
 *
 *  sidebar.onAddModel(() => {
 *      console.log("Add button clicked");
 *  });
 *
 *  sidebar.update(
 *      [
 *          { id: "a1", label: "Model A" },
 *          { id: "b2", label: "Model B" }
 *      ],
 *      "a1"
 *  );
 *
 * Public API:
 *  - update(models, activeId) — Render list + highlight active.
 *  - onModelSelected(callback) — Register selection handler.
 *  - onAddModel(callback) — Register "add model" button handler.
 *  - clear() — Clear the sidebar contents.
 *
 * @module SidebarView
 */

import { UIUtils } from "../utils/UIUtils.js";

export class SidebarView {
    /**
     * @param {HTMLElement} container The root element for the sidebar.
     * Expected structure:
     *   <nav class="sidebar">
     *     <ul class="sidebar-list"></ul>
     *     <button class="sidebar-add-btn">Add</button>
     *   </nav>
     */
    constructor(container) {
        this.container = container;

        this.listEl = container.querySelector(".sidebar-list");
        this.addButton = container.querySelector(".sidebar-add-btn");

        /**
         * Selection callback: receives selected model ID.
         * @type {(id: string) => void | null}
         */
        this._onModelSelected = null;

        /**
         * "Add new model" callback.
         * @type {() => void | null}
         */
        this._onAddModel = null;

        this._setupEventListeners();
    }

    /**
     * Render the sidebar.
     * @param {Array<{id: string, label: string, iconId?: string}>} models
     * @param {string} activeId ID of the currently active model.
     */
    update(models, activeId) {
        this.clear();

        models.forEach((model) => {
            const li = document.createElement("li");

            // Creates a button with the label text
            const button = UIUtils.createElement("button", "sidebar-model-btn", model.label);
            button.dataset.modelId = model.id;

            // Active state styling
            button.classList.toggle("sidebar-model--active", model.id === activeId);

            // Optional icon support (generic SVG sprite usage)
            if (model.iconId) {
                const svg = UIUtils.createSVGFromSpriteSheet("icon", `#${model.iconId}`);
                button.prepend(svg);
            }

            li.appendChild(button);
            this.listEl.appendChild(li);
        });
    }

    /**
     * Register a callback for when a list model is clicked.
     * @param {(id: string) => void} callback
     */
    onModelSelected(callback) {
        this._onModelSelected = callback;
    }

    /**
     * Register a callback for when the "add model" button is clicked.
     * @param {() => void} callback
     */
    onAddModel(callback) {
        this._onAddModel = callback;
    }

    /**
     * Internal event listeners.
     */
    _setupEventListeners() {
        // Delegate list clicks to buttons
        this.listEl.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) return;

            const id = button.dataset.modelId;

            if (this._onModelSelected && id !== undefined) {
                this._onModelSelected(id);
            }
        });

        // Add button
        if (this.addButton) {
            this.addButton.addEventListener("click", () => {
                this._onAddModel?.();
            });
        }
    }

    setOnModelSelected(callback) {
        this._onModelSelected = callback;
    }

    setOnAddModel(callback) {
        this._onAddModel = callback;
    }

    /**
     * Clear sidebar content.
     */
    clear() {
        this.listEl.innerHTML = "";
    }
}

export default SidebarView;
