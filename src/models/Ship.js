import { MIN_SHIP_LENGTH, MAX_SHIP_LENGTH, DEFAULT_SHIP_LENGTH } from "./Constants.js";

/**
 * Represents a ship in the Battleship game
 * @class
 */
export default class Ship {
    #length;
    #timesHit;

    /**
     * Creates a new ship
     * @param {number} [length=DEFAULT_SHIP_LENGTH] - The length of the ship (MIN_SHIP_LENGTH-MAX_SHIP_LENGTH inclusive)
     * @throws {TypeError} If length is not an integer
     * @throws {RangeError} If length is outside the valid range
     */
    constructor(length = DEFAULT_SHIP_LENGTH) {
        if (!Number.isInteger(length)) {
            throw new TypeError("Length must be an integer");
        }
        if (length < MIN_SHIP_LENGTH || length > MAX_SHIP_LENGTH) {
            throw new RangeError(`Ship must have length between ${MIN_SHIP_LENGTH} and ${MAX_SHIP_LENGTH} inclusive`);
        }
        this.#length = length;
        this.#timesHit = 0;
    }

    /**
     * Gets the length of the ship
     * @returns {number} The ship's length (MIN_SHIP_LENGTH-MAX_SHIP_LENGTH)
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
