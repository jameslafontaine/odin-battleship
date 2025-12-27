/**
 * @fileoverview Generic main content view responsible for rendering:
 *  - The active entity (e.g., project, category, document) heading.
 *  - A list of items associated with that entity.
 *  - Action buttons for editing, deleting, starring, expanding items, etc.
 *
 * This view does not assume any specific schema. All data comes in
 * through arguments and is rendered generically.
 *
 * Exports:
 *  - MainView — A reusable UI view for list-based applications.
 *
 * Dependencies:
 *  - UIUtils
 *
 * @module MainView
 */

import { UIUtils } from "../utils/UIUtils.js";

export class MainView {
    /**
     * @param {HTMLElement} container The DOM element for the main section.
     */
    constructor(container) {
        this.container = container;

        this.headingContainerEl = container.querySelector(".main-heading-container");
        this.listContainerEl = container.querySelector(".main-item-list");
        this.createItemBtn = container.querySelector(".create-item-btn");

        /** @type {(entityId: string) => void} */
        this._onEditEntity = null;

        /** @type {(entityId: string) => void} */
        this._onDeleteEntity = null;

        /** @type {(entityId: string) => void} */
        this._onStarEntity = null;

        /** @type {(entityId: string, itemId: string) => void} */
        this._onToggleItem = null;

        /** @type {(entityId: string, itemId: string) => void} */
        this._onExpandItem = null;

        /** @type {(entityId: string, itemId: string) => void} */
        this._onEditItem = null;

        /** @type {(entityId: string, itemId: string) => void} */
        this._onDeleteItem = null;

        /** @type {(entityId: string) => void} */
        this._onCreateItem = null;

        this._setupEventListeners();
    }

    /**
     * Render the heading section for the active entity.
     * @param {Object} entity
     * @param {string} entity.id
     * @param {string} entity.name
     * @param {Object} meta Additional metadata for rendering.
     * @param {boolean} meta.isStarred Whether the entity is starred.
     */
    _renderHeading(entity, meta = {}) {
        this.headingContainerEl.innerHTML = "";

        const titleEl = UIUtils.createElement("h2", "main-heading-title", entity.name);

        const starBtn = this._createStarBtn(meta.isStarred);
        const editBtn = this._createEditBtn();
        const deleteBtn = this._createDeleteBtn();

        const wrapper = UIUtils.createElement("div", "main-heading-buttons");
        wrapper.append(starBtn, editBtn, deleteBtn);

        this.headingContainerEl.dataset.entityId = entity.id;
        this.headingContainerEl.append(titleEl, wrapper);
    }

    /**
     * Render the full main view: heading + list of items.
     * @param {Object} entity The active entity (project/category/etc.).
     * @param {Object[]} items List of items belonging to the entity.
     * @param {Object} meta Metadata used for rendering.
     */
    update(entity, items = [], meta = {}) {
        this._currentEntityId = entity.id;

        this._renderHeading(entity, meta);

        this.listContainerEl.innerHTML = "";

        items.forEach((item) => {
            const itemEl = UIUtils.createElement("li", "main-item");
            itemEl.dataset.entityId = entity.id;
            itemEl.dataset.itemId = item.id;

            const rowEl = UIUtils.createElement("div", "main-item-row");

            const toggleBtn = this._createToggleBtn(item.state?.toggled ?? false);
            const expandBtn = this._createExpandBtn(item.name, item.state?.expanded ?? false);
            const editBtn = this._createEditBtn();
            const deleteBtn = this._createDeleteBtn();

            rowEl.append(toggleBtn, expandBtn, editBtn, deleteBtn);

            const detailsEl = UIUtils.createElement("div", "main-item-details");
            if (item.description) {
                const descEl = UIUtils.createElement("div", "main-item-description", item.description);
                if (item.state?.expanded) descEl.classList.add("expanded");
                detailsEl.append(descEl);
            }

            itemEl.append(rowEl, detailsEl);
            this.listContainerEl.appendChild(itemEl);
        });
    }

    /**
     * Event delegation for all controls inside the main view.
     */
    _setupEventListeners() {
        // Heading controls
        this.headingContainerEl.addEventListener("click", (event) => {
            const entityId = this.headingContainerEl.dataset.entityId;

            if (event.target.closest(".edit-btn")) this._onEditEntity?.(entityId);
            if (event.target.closest(".delete-btn")) this._onDeleteEntity?.(entityId);
            if (event.target.closest(".star-btn")) this._onStarEntity?.(entityId);
        });

        // Item controls
        this.listContainerEl.addEventListener("click", (event) => {
            const itemEl = event.target.closest(".main-item");
            if (!itemEl) return;

            const entityId = itemEl.dataset.entityId;
            const itemId = itemEl.dataset.itemId;

            if (event.target.closest(".toggle-btn")) this._onToggleItem?.(entityId, itemId);
            if (event.target.closest(".expand-btn")) this._onExpandItem?.(entityId, itemId);
            if (event.target.closest(".edit-btn")) this._onEditItem?.(entityId, itemId);
            if (event.target.closest(".delete-btn")) this._onDeleteItem?.(entityId, itemId);
        });

        // Create item button
        this.createItemBtn.addEventListener("click", () => {
            this._onCreateItem?.(this._currentEntityId);
        });
    }

    expandItem(itemId) {
        const descEl = document.querySelector(`.main-item[data-item-id="${itemId}"] .main-item-description`);
        if (!descEl) return;
        descEl.classList.toggle("expanded");
    }

    setOnEditEntity(callback) {
        this._onEditEntity = callback;
    }

    setOnDeleteEntity(callback) {
        this._onDeleteEntity = callback;
    }

    setOnStarEntity(callback) {
        this._onStarEntity = callback;
    }

    setOnToggleItem(callback) {
        this._onToggleItem = callback;
    }

    setOnExpandItem(callback) {
        this._onExpandItem = callback;
    }

    setOnEditItem(callback) {
        this._onEditItem = callback;
    }

    setOnDeleteItem(callback) {
        this._onDeleteItem = callback;
    }

    setOnCreateItem(callback) {
        this._onCreateItem = callback;
    }

    // --- Icon Button Generators ---

    _createStarBtn(isStarred) {
        const btn = UIUtils.createElement("button", "star-btn");
        const svg = isStarred
            ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-star-filled")
            : UIUtils.createSVGFromSpriteSheet("icon", "#icon-star");
        btn.appendChild(svg);
        return btn;
    }

    _createEditBtn() {
        const btn = UIUtils.createElement("button", "edit-btn");
        const svg = UIUtils.createSVGFromSpriteSheet("icon", "#icon-edit");
        btn.appendChild(svg);
        return btn;
    }

    _createDeleteBtn() {
        const btn = UIUtils.createElement("button", "delete-btn");
        const svg = UIUtils.createSVGFromSpriteSheet("icon", "#icon-delete");
        btn.appendChild(svg);
        return btn;
    }

    _createToggleBtn(isActive) {
        const btn = UIUtils.createElement("button", "toggle-btn");
        const svg = isActive
            ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-toggle-on")
            : UIUtils.createSVGFromSpriteSheet("icon", "#icon-toggle-off");
        btn.appendChild(svg);
        return btn;
    }

    _createExpandBtn(label, isExpanded) {
        const btn = UIUtils.createElement("button", ["expand-btn", "main-item-title"], label);
        const svg = isExpanded
            ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-minimize")
            : UIUtils.createSVGFromSpriteSheet("icon", "#icon-expand");
        btn.appendChild(svg);
        return btn;
    }
}
