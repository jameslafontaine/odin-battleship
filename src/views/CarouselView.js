class CarouselView {
    constructor({
        slidesContainer,
        slideButtonContainer,
        leftButton,
        rightButton,
        autoCycle = false,
        cycleInterval = 3000,
        loop = false,
    }) {
        this._slidesContainerEl = slidesContainer;
        this._slideButtonContainer = slideButtonContainer;
        this._leftButtonEl = leftButton;
        this._rightButtonEl = rightButton;
        this._slideIndex = 0;
        this._slides = slidesContainer.querySelectorAll(".slide");
        if (this._slides.length === 0) {
            throw new Error(
                "SlideshowView requires at least one slide element. \
                Give slidesContainer at least one child with the 'slide' class."
            );
        } else {
            this._slideWidths = Array.from(this._slides).map((slide) => slide.offsetWidth);
        }
        this._createSlideButtons();

        this._autoCycle = autoCycle;
        this._cycleInterval = cycleInterval;
        this._cycleTimer = null;

        this._loop = loop; // store the loop preference

        this._setupEventListeners();
        if (this._autoCycle) this.startAutoCycle();
    }

    _getOffsetForIndex(index) {
        return -this._slideWidths.slice(0, index).reduce((acc, w) => acc + w, 0);
    }

    _setupEventListeners() {
        this._leftButtonEl.addEventListener("click", () => {
            this.prevSlide();
            this._updateActiveButton();
        });

        this._rightButtonEl.addEventListener("click", () => {
            this.nextSlide();
            this._updateActiveButton();
        });

        this._slideButtonEls.forEach((buttonEl, index) => {
            buttonEl.addEventListener("click", () => {
                this._slideIndex = index;
                this._slidesContainerEl.style.transform = `translateX(${this._getOffsetForIndex(this._slideIndex)}px)`;
                this._updateActiveButton();
                this._resetAutoCycle();
            });
        });
    }

    _updateActiveButton() {
        this._slideButtonEls.forEach((buttonEl, index) => {
            buttonEl.classList.toggle("active", index === this._slideIndex);
        });
    }

    prevSlide() {
        if (this._slideIndex === 0) {
            if (this._loop) {
                this._slideIndex = this._slideWidths.length - 1;
            } else {
                return;
            }
        } else {
            this._slideIndex--;
        }

        this._slidesContainerEl.style.transform = `translateX(${this._getOffsetForIndex(this._slideIndex)}px)`;
        this._updateActiveButton();
        this._resetAutoCycle();
    }

    nextSlide() {
        if (this._slideIndex === this._slideWidths.length - 1) {
            if (this._loop) {
                this._slideIndex = 0;
            } else {
                return;
            }
        } else {
            this._slideIndex++;
        }

        this._slidesContainerEl.style.transform = `translateX(${this._getOffsetForIndex(this._slideIndex)}px)`;
        this._updateActiveButton();
        this._resetAutoCycle();
    }

    _createSlideButtons() {
        this._slideButtonEls = [];
        this._slides.forEach((_, index) => {
            const buttonEl = document.createElement("button");
            buttonEl.classList.add("slide-button");
            if (index === this._slideIndex) {
                buttonEl.classList.add("active");
            }
            this._slideButtonContainer.appendChild(buttonEl);
            this._slideButtonEls.push(buttonEl);
        });
    }

    // ---------- Auto-Cycle Methods ----------
    startAutoCycle() {
        if (this._cycleTimer) return;
        this._cycleTimer = setInterval(() => this.nextSlide(), this._cycleInterval);
    }

    stopAutoCycle() {
        clearInterval(this._cycleTimer);
        this._cycleTimer = null;
    }

    toggleAutoCycle(onOrOff) {
        if (onOrOff) this.startAutoCycle();
        else this.stopAutoCycle();
    }

    _resetAutoCycle() {
        if (!this._autoCycle) return;
        this.stopAutoCycle();
        this.startAutoCycle();
    }
}

export default CarouselView;
