/**
 * @fileoverview Generic manager singleton for handling multiple Model instances.
 *
 * Responsibilities:
 *  - Store and manage multiple Model instances in an internal array
 *  - Provide CRUD-style operations: create, delete, retrieve all
 *  - Track and switch the currently active model
 *  - Serve as the global source of truth for all app-level data
 *
 * Exports:
 *  - manager — Singleton instance of Manager.
 *
 * Dependencies:
 *  - Model from './Model.js' — Represents individual models.
 *  - Storage from '../storage/Storage.js - Provides methods for saving and loading application state to / from
 *                                          localStorage
 *
 * Example:
 *  import { projectManager } from './ProjectManager.js';
 *  const project = projectManager.createProject("Work");
 *  projectManager.deleteProjectById(project.id);
 *  const activeProject = projectManager.getActiveProject();
 *
 * @module Manager
 */

import { Model } from "./Model.js";
import { Storage } from "../storage/Storage.js";

class Manager {
    constructor() {
        /** @type {Model[]} */
        this._models = [];
        this._activeModel = null; // currently selected model
        this._defaultModel = null; // default model that is selected on app launch
    }

    /**
     * Creates a new Model instance and stores it in the manager.
     * @param {string} name - The name for the new item.
     * @returns {Model} The newly created Model instance.
     */
    createItem(name) {
        const item = new Model(this._models.length + 1, name);
        this._models.push(item);
        return item;
    }

    /**
     * Deletes an existing Model instance by its ID.
     * @param {number} id - The ID of the item to delete.
     */
    deleteItem(id) {
        this._models = this._models.filter((item) => item.id !== id);
    }

    getModelById(id) {
        return this._models.find((item) => item.id === id) || null;
    }

    deleteModelById(id) {
        this._models = this._models.filter((m) => m.id !== id);
        if (this._activeModel?.id === id) {
            this._activeModel = this._models[0] ?? null;
        }
        if (this._defaultModel?.id === id) {
            this._defaultModel = this._models[0] ?? null;
        }
    }

    deleteAllModels() {
        this._models = [];
        this._activeModel = null;
    }

    /**
     * Returns all managed Model instances.
     * @returns {Model[]} Array of Model instances.
     */
    get allModels() {
        return [...this._models];
    }

    get activeModel() {
        return this._activeModel;
    }

    setActiveModelById(id) {
        const model = this.getModelById(id);
        this._activeModel = model || null;
    }

    get defaultModel() {
        return this._defaultModel;
    }

    setDefaultModel(id) {
        this._defaultModel = this._defaultModel?.id === id ? null : this.getModelById(id);
    }

    loadFromStorage() {
        const data = Storage.load();
        if (!data) return;

        this._models = data.projects.map((m) => {
            const model = new Model(m.name);
            model.setId(m.id); // restore model ID

            // Rebuild models contained in Models
            m.items.forEach((i) => {
                const item = model.createItem(i.title, i.description, i.dueDate, i.priority);

                // Now override system-generated fields
                item.info = {
                    id: i.id,
                    completed: i.completed,
                    expanded: i.expanded,
                };
            });

            return model;
        });

        this._defaultModel = data.defaultModelId ? this.getModelById(data.defaultModelId) : null;
        this._activeModel = data.defaultModel;
    }

    saveToStorage() {
        // deserialize models and their items to plain objects for storage
        Storage.save({
            defaultModelId: this._defaultModel?.getId() ?? null,
            models: this._models.map((m) => ({
                id: m.id,
                name: m.name,
                todos: m.items.map((i) => ({
                    id: i.id,
                    title: i.title,
                    description: i.description,
                })),
            })),
        });
    }
}

export const manager = new Manager();
