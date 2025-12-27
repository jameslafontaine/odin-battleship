/**
 * @fileoverview A reusable, framework-agnostic dialog controller for working with
 * HTML <dialog> elements and form-like modal interactions.
 *
 * Responsibilities:
 *  - Open and close a dialog element.
 *  - Collect values from form controls inside the dialog.
 *  - Store contextual data for the duration of the dialog session.
 *  - Allow external modules to register submit and cancel handlers.
 *
 * Usage example:
 *  const myDialog = new DialogView(document.querySelector("#my-dialog"));
 *
 *  myDialog.onSubmit((payload) => {
 *      console.log("User submitted:", payload);
 *  });
 *
 *  myDialog.onCancel(() => {
 *      console.log("Dialog cancelled");
 *  });
 *
 *  // Optional contextual data (e.g., IDs, mode flags, metadata)
 *  myDialog.open({ mode: "create" });
 *
 * Public API:
 *  - open(context) — Opens the dialog, optionally storing contextual info.
 *  - close() — Closes the dialog and clears internal context.
 *  - onSubmit(callback) — Registers a submit handler.
 *  - onCancel(callback) — Registers a cancel handler.
 *
 * Internal methods/properties:
 *  - _setupEventListeners() — Binds UI event handlers.
 *  - _collectFormData() — Gathers form control values inside the dialog.
 *  - _onSubmit — Stored function for submit events.
 *  - _onCancel — Stored function for cancel events.
 *  - _context — Internal store for contextual data passed into open().
 *
 * @module DialogView
 */

export class DialogView {
    constructor(dialogElement) {
        this.dialogElement = dialogElement;

        // Buttons are expected, but are still optional for flexibility
        this.submitButton = dialogElement.querySelector(".submit-button");
        this.cancelButton = dialogElement.querySelector(".cancel-button");

        this._onSubmit = null;
        this._onCancel = null;
        this._context = {};

        this._setupEventListeners();
    }

    /**
     * Opens the dialog and attaches optional contextual session data.
     * @param {Object} context Arbitrary data passed to submit callbacks.
     */
    open(context = {}) {
        this._context = context;
        this.dialogElement.showModal();
    }

    /**
     * Closes the dialog and resets stored context.
     */
    close() {
        this.dialogElement.close();
        this._context = {};
    }

    /**
     * Registers a submit callback.
     * @param {Function} callback
     */
    setOnSubmit(callback) {
        this._onSubmit = callback;
    }

    /**
     * Registers a cancel callback.
     * @param {Function} callback
     */
    setOnCancel(callback) {
        this._onCancel = callback;
    }

    /**
     * Bind internal UI event handlers.
     */
    _setupEventListeners() {
        if (this.submitButton) {
            this.submitButton.addEventListener("click", () => {
                const formData = this._collectFormData();
                // Merge form data with context
                this._onSubmit?.({ ...this._context, ...formData });
                this.close();
            });
        }

        if (this.cancelButton) {
            this.cancelButton.addEventListener("click", () => {
                this._onCancel?.();
                this.close();
            });
        }
    }

    /**
     * Collects all "input", "textarea", and "select" values inside the dialog.
     * Only includes elements with a defined `name` attribute.
     * @returns {Object} A key-value map of form data.
     */
    _collectFormData() {
        const elements = this.dialogElement.querySelectorAll("input, textarea, select");

        const payload = {};
        elements.forEach((el) => {
            if (el.name) {
                payload[el.name] = el.value;
            }
        });

        return payload;
    }

    /**
     * Internal: populate form fields from the given context
     * Only sets values for inputs/textarea/select elements whose `name` matches a context key
     */
    _populateFormFields(context) {
        const formElements = this.dialogElement.querySelectorAll("input, textarea, select");
        formElements.forEach((el) => {
            if (el.name && context[el.name] !== undefined) {
                // Special handling for date inputs
                if (el.type === "date" && context[el.name] instanceof Date) {
                    const year = context[el.name].getFullYear();
                    const month = String(context[el.name].getMonth() + 1).padStart(2, "0");
                    const day = String(context[el.name].getDate()).padStart(2, "0");
                    el.value = `${year}-${month}-${day}`;
                } else {
                    el.value = context[el.name];
                }
            }
        });
    }
}

export default DialogView;
