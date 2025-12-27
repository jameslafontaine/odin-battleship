/**
 * @fileoverview Bootstraps and orchestrates the main application.
 *
 * Responsibilities:
 *  - Initialize core application components.
 *  - Create and configure all view instances (SidebarView, MainView, DialogView).
 *  - Connect the data/model layer with view event handlers.
 *  - Trigger the render of UI components.
 *
 * Exports:
 *  - initApp — Function that starts the application.
 *
 * Dependencies:
 *  - manager — The global state/data manager (model layer).
 *  - SidebarView — Renders and manages a sidebar UI.
 *  - MainView — Renders and manages the main content UI.
 *  - DialogView — Handles modal dialog UI instances.
 *
 * @module controller
 */

import { manager } from "./models/Manager.js";
import { SidebarView } from "./views/SidebarView.js";
import { MainView } from "./views/MainView.js";
import { DialogView } from "./views/DialogView.js";

// ----------------------
// View instances
// ----------------------
const sidebarView = new SidebarView(document.querySelector(".sidebar"));
const mainView = new MainView(document.querySelector(".main-container"));

// Example dialogs (generic)
const createModelDialog = new DialogView(document.querySelector("#create-model-dialog"));
const editModelDialog = new DialogView(document.querySelector("#edit-model-dialog"));
const deleteModelDialog = new DialogView(document.querySelector("#delete-model-dialog"));

// ----------------------
// Helper to render the entire app state
// ----------------------
function renderAll() {
    const activeModelId = manager?.activeModel?.id || null;
    sidebarView.update(manager.getModels(), activeModelId);
    mainView.update(manager?.activeModel);
}

// ----------------------
// Assign all callbacks between views and the manager
// ----------------------
function assignCallbacks() {
    // Sidebar events
    sidebarView.setOnModelSelected((id) => {
        manager.setActiveModelById(id);
        renderAll();
    });

    sidebarView.setOnCreateModelClicked(() => {
        createModelDialog.open();
    });

    // MainView events
    mainView.setOnEditModelClicked((modelId) => {
        const model = manager.getModelById(modelId);
        editModelDialog.open({ id: model.id, ...model.getData() });
    });

    mainView.setOnDeleteModelClicked((modelId) => {
        const model = manager.getModelById(modelId);
        deleteModelDialog.open({ id: model.id, ...model.getData() });
    });

    mainView.setOnToggleModelState?.((modelId) => {
        const model = manager.getModelById(modelId);
        model.toggleState?.();
        renderAll();
        manager.saveToStorage();
    });

    // Dialog events
    createModelDialog.setOnSubmit((data) => {
        manager.createModel(data);
        renderAll();
        manager.saveToStorage();
    });

    editModelDialog.setOnSubmit((data) => {
        const model = manager.getModelById(data.id);
        model.updateData?.(data);
        renderAll();
        manager.saveToStorage();
    });

    deleteModelDialog.setOnSubmit((data) => {
        manager.deleteModelById(data.id);
        renderAll();
        manager.saveToStorage();
    });
}

// ----------------------
// Initialize the app
// ----------------------
export async function initApp() {
    assignCallbacks();
    manager.loadFromStorage?.();
    renderAll();
}
