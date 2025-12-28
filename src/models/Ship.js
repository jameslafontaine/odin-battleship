/**
 * Represents a ship in the Battleship game
 * @class
 */
export default class Ship {
    #MIN_LENGTH = 2;
    #MAX_LENGTH = 5;
    #length;
    #timesHit;

    /**
     * Creates a new ship
     * @param {number} [length=2] - The length of the ship (2-5 inclusive)
     * @throws {TypeError} If length is not an integer
     * @throws {RangeError} If length is outside the valid range
     */
    constructor(length = 2) {
        if (!Number.isInteger(length)) {
            throw new TypeError("Length must be an integer");
        }
        if (length < this.#MIN_LENGTH || length > this.#MAX_LENGTH) {
            throw new RangeError(`Ship must have length between ${this.#MIN_LENGTH} and ${this.#MAX_LENGTH} inclusive`);
        }
        this.#length = length;
        this.#timesHit = 0;
    }

    /**
     * Gets the length of the ship
     * @returns {number} The ship's length (2-5)
     */
    get length() {
        return this.#length;
    }

    /**
     * Gets the number of hits the ship has taken
     * @returns {number} Number of hits (0 to length)
     */
    get hits() {
        return this.#timesHit;
    }

    /**
     * Records a hit on the ship
     * @returns {number} The total number of hits
     */
    hit() {
        if (!this.isSunk()) this.#timesHit++;
        return this.#timesHit;
    }

    /**
     * Checks if the ship has been sunk
     * @returns {boolean} True if sunk, false otherwise
     */
    isSunk() {
        return this.#timesHit >= this.#length;
    }
}
