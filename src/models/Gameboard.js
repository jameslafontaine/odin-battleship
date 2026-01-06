import Ship from "./Ship.js";
import {
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
    DEFAULT_BOARD_SIZE,
    VALID_DIRECTIONS,
    ATTACK_RESULTS,
    CELL_STATES,
} from "./Constants.js";

/**
 * Represents a Battleship game board
 *
 * @class
 *
 * Board State Model:
 * - Each cell can contain:
 *   - `null`: Empty water (no ship, not attacked)
 *   - `Ship`: Ship object (ship is placed here)
 *   - `'miss'`: Attacked water (no ship was here)
 *   - `'hit'`: Attacked ship (ship was damaged here)
 *
 * Coordinate System:
 * - board[y][x] where (0,0) is top-left
 * - x: column (0 to size-1, left to right)
 * - y: row (0 to size-1, top to bottom)
 *
 * Example 5x5 board after some gameplay:
 * ```
 * [
 *   [null,   null,  Ship, Ship, null],
 *   ['miss', null,  null, null, null],
 *   [Ship,   Ship,  null, 'hit', null],
 *   [null,   'miss', null, null, null],
 *   [null,   null,  null, null, null]
 * ]
 * ```
 */
export default class Gameboard {
    // Private instance fields
    #size;
    #board;
    #ships;

    /**
     * Creates a new game board
     * @param {number} [size=DEFAULT_BOARD_SIZE] - Board size (MIN_BOARD_SIZE-MAX_BOARD_SIZE inclusive)
     * @throws {TypeError} If size is not an integer
     * @throws {RangeError} If size is outside valid range
     */
    constructor(size = DEFAULT_BOARD_SIZE) {
        // Validate type
        if (!Number.isInteger(size)) {
            throw new TypeError("Size must be an integer");
        }

        // Validate range
        if (size < MIN_BOARD_SIZE || size > MAX_BOARD_SIZE) {
            throw new RangeError(
                `Gameboard must have grid size between ${MIN_BOARD_SIZE} and ${MAX_BOARD_SIZE} inclusive`
            );
        }

        this.#size = size;
        this.#board = Array.from({ length: size }, () => Array(size).fill(CELL_STATES.EMPTY));
        this.#ships = [];
    }

    /**
     * Gets the board size
     * @returns {number} The size of the board (MIN_BOARD_SIZE-MAX_BOARD_SIZE)
     */
    get size() {
        return this.#size;
    }

    /**
     * Gets the board 2D array
     * @returns {Array<Array>} A 2D array representing the board state
     */
    get board() {
        return this.#board;
    }

    /**
     * Gets the ships array
     * @returns {Array<Ship>} An array of ships currently on the board
     */
    get ships() {
        return [...this.#ships];
    }

    /**
     * Places a new Ship object of the specified length, at the specified coordinates, facing the specified direction
     * @param {number} x - The x-coordinate of the base of the ship
     * @param {number} y - The y-coordinate of the base of the ship
     * @param {number} length - The length of the ship (2-5)
     * @param {string} direction - The direction the ship will face ("N" - North, "E" - East, "S" - South, "W" - West)
     * @throws {TypeError} If coordinates aren't integers or direction is invalid
     * @returns {{success: boolean, ship?: Ship, reason?: string, position?: object}} A results object which describes
     * whether the ship was successfully placed or not. If not, we provide the reason why and the position at which we
     * failed.
     */
    placeShip(x, y, length = 2, direction = "S") {
        const deltas = {
            N: [0, -1],
            E: [1, 0],
            S: [0, 1],
            W: [-1, 0],
        };

        // Input validation
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new TypeError("Coordinates must be integers");
        }

        if (!VALID_DIRECTIONS.includes(direction)) {
            throw new TypeError(`Direction must be one of: ${VALID_DIRECTIONS.join(", ")}`);
        }

        const delta = deltas[direction];

        // Check placement with detailed reason
        const canPlace = this.#canPlaceShip(x, y, length, delta);
        if (!canPlace.valid) {
            return {
                success: false,
                reason: canPlace.reason, // "out-of-bounds" or "cell-occupied"
                position: canPlace.position,
            };
        }

        // Now we can safely place the new ship
        const ship = new Ship(length);
        for (let i = 0; i < length; i++) {
            const xCoord = x + i * delta[0];
            const yCoord = y + i * delta[1];
            this.#board[yCoord][xCoord] = ship;
        }

        this.#ships.push(ship);
        return { success: true, ship };
    }

    /**
     * Checks if ship can be placed (all positions must be valid and empty)
     * @param {number} x - x-coordinate of the base of the ship
     * @param {number} y - y-coordinate of the base of the ship
     * @param {number} length - The length of the ship (2-5)
     * @param {Array<Number>} delta - The delta applied to the coordinates on each iteration to correctly place the ship
     * @returns {{valid: boolean, reason?: string, position?: object}} A results object which describes whether the ship
     * can be placed or not. If not, we provide the reason why and the position at which we failed.
     * @private
     */
    #canPlaceShip(x, y, length, delta) {
        // This checks EVERY position including the starting one
        for (let i = 0; i < length; i++) {
            const xCoord = x + i * delta[0];
            const yCoord = y + i * delta[1];

            // Checks starting position too (when i=0)
            if (!this.#withinBoard(xCoord, yCoord)) {
                return {
                    valid: false,
                    reason: "out-of-bounds",
                    position: { x: xCoord, y: yCoord, segment: i },
                };
            }

            if (this.#board[yCoord][xCoord] !== CELL_STATES.EMPTY) {
                return {
                    valid: false,
                    reason: "cell-occupied",
                    position: { x: xCoord, y: yCoord, segment: i },
                };
            }
        }
        return { valid: true };
    }

    /**
     * Validates coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @throws {TypeError} If coordinates are not integers
     * @throws {RangeError} If coordinates are out of bounds
     * @private
     */
    #validateCoordinates(x, y) {
        // Type validation
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new TypeError("x- and y-coordinates must both be integers");
        }

        // Range validation
        if (!this.#withinBoard(x, y)) {
            throw new RangeError(`Coordinates must be between 0 and ${this.#size - 1} inclusive`);
        }
    }

    /**
     * Helper that checks if the provided x- and y-coordinates are contained within the board
     * @param {number} x - x-coordinate
     * @param {number} y - y-coordinate
     * @returns {boolean} True if the cell is within the board, false otherwise
     * @private
     */
    #withinBoard(x, y) {
        return x >= 0 && x <= this.#size - 1 && y >= 0 && y <= this.#size - 1;
    }

    /**
     * Takes a pair of coordinates, determines whether or not the attack hit a ship, then sends the 'hit' function to
     * the correct ship, or records the coordinates of the missed shot
     * Also reports whether a ship / all ships have been sunk
     * @param {number} x - x-coordinate of the attack
     * @param {number} y - y-coordinate of the attack
     * @returns {string} "hit" if the shot hits, "miss" if the shot misses, "sunk" if a ship has sunk,
     *                   "sunk-all" if all ships have been sunk
     */
    receiveAttack(x, y) {
        this.#validateCoordinates(x, y);

        const cell = this.#board[y][x];

        // Check if already attacked
        if (cell === CELL_STATES.HIT || cell === CELL_STATES.MISS) {
            throw new Error(`Cell at (${x}, ${y}) has already been attacked`);
        }

        if (cell instanceof Ship) {
            cell.hit();
            this.#board[y][x] = CELL_STATES.HIT;

            if (this.#allSunk()) return ATTACK_RESULTS.SUNK_ALL;
            if (cell.isSunk()) return ATTACK_RESULTS.SUNK;
            return ATTACK_RESULTS.HIT;
        }

        // Must be null (empty water)
        this.#board[y][x] = CELL_STATES.MISS;
        return ATTACK_RESULTS.MISS;
    }

    /**
     *
     * @returns {boolean} True if all ships are sunk, false otherwise
     * @private
     */
    #allSunk() {
        for (const ship of this.#ships) {
            if (!ship.isSunk()) return false;
        }

        return true;
    }

    /**
     * Helper function for visualising board
     */
    displayBoard() {
        return this.#board
            .map((row) =>
                row
                    .map((cell) => {
                        if (cell === CELL_STATES.EMPTY) return "~";
                        if (cell === CELL_STATES.MISS) return "O";
                        if (cell === CELL_STATES.HIT) return "X";
                        if (cell instanceof Ship) return "S";
                    })
                    .join(" ")
            )
            .join("\n");
    }
}
