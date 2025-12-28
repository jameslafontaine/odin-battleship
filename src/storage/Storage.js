/**
 * @fileoverview A small wrapper module for saving and loading
 * application state from LocalStorage.
 *
 * Handles:
 *  - Serialization (object → JSON string)
 *  - Deserialization (JSON string → object)
 *  - Error handling for corrupt or missing data
 *  - Consistent key management
 */

const STORAGE_KEY = "appData";

export const Storage = {
    /**
     * Save arbitrary data to LocalStorage.
     * Automatically serializes the data into a JSON string.
     *
     * @param {Object} data - The full application state to persist.
     */
    save(data) {
        try {
            const serialized = JSON.stringify(data); // serialize
            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (error) {
            console.error("Storage.save() failed:", error);
        }
    },

    /**
     * Load and deserialize stored app data.
     * If nothing is stored or JSON is corrupted, returns null.
     *
     * @returns {Object|null} The deserialized app state.
     */
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null; // nothing stored yet

            return JSON.parse(raw); // deserialize
        } catch (error) {
            console.error("Storage.load() failed — corrupted data?", error);
            return null;
        }
    },

    /**
     * Remove all stored data (used for debugging or resetting the app).
     */
    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Storage.clear() failed:", error);
        }
    },

    /**
     * Check whether valid data exists in LocalStorage.
     * @returns {boolean}
     */
    exists() {
        return localStorage.getItem(STORAGE_KEY) !== null;
    },
};
