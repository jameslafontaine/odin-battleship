class DropdownView {
    constructor({ root, button, list }) {
        // Store the root container
        this._dropdownContainerEl = root;

        // Use passed elements if provided, otherwise query inside root
        this._dropdownButtonEl = button || root.querySelector(".dropdown-button");
        this._dropdownListEl = list || root.querySelector(".dropdown-list");

        // Optional hover callback
        this._onDropdownButtonHover = null;

        // Set up events
        this._setupEventListeners();
    }

    setOnDropdownButtonHover(callback) {
        this._onDropdownButtonHover = callback;
    }

    _setupEventListeners() {
        const showDropdown = () => {
            this._onDropdownButtonHover?.();
            this._dropdownListEl.classList.add("visible");
        };

        const hideDropdown = () => {
            this._dropdownListEl.classList.remove("visible");
        };

        this._dropdownButtonEl.addEventListener("mouseenter", showDropdown);
        this._dropdownContainerEl.addEventListener("mouseleave", hideDropdown);
    }
}

export default DropdownView;
