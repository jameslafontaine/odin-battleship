/**
 * @fileoverview Generic model class for template purposes.
 *
 * Responsibilities:
 * - Serve as a base structure for objects managed by the Manager singleton
 * - Provide basic properties: id and name
 * - Can be extended with additional fields or methods as needed
 * - Maintain an internal array of smaller Item instances if necessary
 * Exports:
 *  - Model — Class representing a generic model instance.
 *
 * Dependencies:
 * - Item from './Item.js' — Represents smaller items contained within the model.
 *
 * Example:
 *   import { Model } from './Model.js';
 *   const model = new Model(1, "My Item");
 *
 * @module Model
 */

import { Item } from "./Item.js";

export class Model {
    /**
     * @param {number} id - Unique identifier for the model instance.
     * @param {string} name - Name of the model instance.
     */
    constructor(name = "Untitled Model") {
        this._id = crypto.randomUUID();
        this._name = name;
        this._items = [];
    }

    get items() {
        return [...this._items];
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }

    addItem(...args) {
        const item = new Item(...args);
        this._items.push(item);
    }

    removeItemById(itemId) {
        this._items = this._items.filter((item) => item.id !== itemId);
    }
}
