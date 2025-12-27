/**
 * @fileoverview Generic Item class for use within Model instances.
 *
 * Responsibilities:
 * - Represent a smaller item managed by a Model instance
 * - Provide basic properties: id and name
 * - Can be extended with additional fields or methods as needed
 *
 * Example:
 *   import { Item } from './Item.js';
 *   const item = new Item("My Subitem");
 *
 * @module Item
 */

export class Item {
    /**
     * @param {string} name - Name of the item.
     */
    constructor(name = "Untitled Item") {
        this._id = crypto.randomUUID(); // unique identifier
        this._name = name;
    }

    /**
     * Returns the unique identifier of the item.
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     * Returns the name of the item.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Sets a new name for the item.
     * @param {string} newName
     */
    set name(newName) {
        this._name = newName;
    }
}
