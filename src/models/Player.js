import Gameboard from "./Gameboard.js";

/**
 * Base class for all players
 * @abstract
 */
class Player {
    #name;
    #gameboard;

    constructor(name, boardSize = 10) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new TypeError("Player name must be a non-empty string");
        }

        this.#name = name.trim();
        this.#gameboard = new Gameboard(boardSize);
    }

    get name() {
        return this.#name;
    }

    get gameboard() {
        return this.#gameboard;
    }

    /**
     * Makes an attack - must be implemented by subclasses
     * Subclass implementations:
     * - RealPlayer: attack(opponentBoard, x, y)
     * - ComputerPlayer: attack(opponentBoard)
     * @abstract
     */
    attack() {
        throw new Error("attack() must be implemented by subclass");
    }
}

/**
 * Human player - receives coordinates from UI
 */
export class RealPlayer extends Player {
    constructor(name, boardSize = 10) {
        super(name, boardSize);
    }

    /**
     * Human player attacks with provided coordinates
     * @param {Gameboard} opponentBoard
     * @param {number} x - X coordinate from UI
     * @param {number} y - Y coordinate from UI
     * @returns {{result: string, x: number, y: number}}
     */
    attack(opponentBoard, x, y) {
        if (x === undefined || y === undefined) {
            throw new Error("Human player must provide attack coordinates");
        }
        return { result: opponentBoard.receiveAttack(x, y), x, y };
    }
}

/**
 * Computer player - generates attacks using AI strategy
 */
export class ComputerPlayer extends Player {
    #attackHistory;
    #aiStrategy;

    constructor(name = "Computer", boardSize = 10, aiStrategy = "random") {
        super(name, boardSize);
        this.#attackHistory = new Set(); // Track attempted attacks
        this.#aiStrategy = aiStrategy; // Future: 'hunt', 'smart'
    }

    /**
     * Computer generates and executes attack automatically
     * @param {Gameboard} opponentBoard
     * @returns {{result: string, x: number, y: number}}
     */
    attack(opponentBoard) {
        // Check if all cells have been attacked first
        const totalCells = opponentBoard.size ** 2;
        if (this.#attackHistory.size >= totalCells) {
            throw new Error("All cells have already been attacked");
        }
        const [x, y] = this.#generateAttackCoordinates(opponentBoard);
        this.#attackHistory.add(`${x},${y}`);
        return { result: opponentBoard.receiveAttack(x, y), x, y };
    }

    /**
     * Generates attack coordinates based on AI strategy
     * @private
     */
    #generateAttackCoordinates(opponentBoard) {
        switch (this.#aiStrategy) {
            case "random":
                return this.#randomAttack(opponentBoard);
            // Future strategies:
            // case 'hunt':
            //     return this.#huntAndTargetAttack(opponentBoard);
            // case 'smart':
            //     return this.#smartAttack(opponentBoard);
            default:
                return this.#randomAttack(opponentBoard);
        }
    }

    /**
     * Simple random attack strategy
     * @private
     */
    #randomAttack(opponentBoard) {
        const size = opponentBoard.size;
        let x, y;

        // Keep trying until we find an unattacked cell
        do {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
        } while (this.#attackHistory.has(`${x},${y}`));

        return [x, y];
    }

    // Future: Add more sophisticated AI methods

    // Hunt with checkerboard pattern. Target adjacent cells after hit. Follow ship direction once found
    // #huntAndTargetAttack(opponentBoard) { ... }

    /* Probability calculations (where ships CAN be)
    Ship size awareness (what ships REMAIN)
    Weighted hunting (attack high-probability cells first)
    Context-aware targeting (smarter direction choices) */
    // #smartAttack(opponentBoard) { ... }
}
