import Gameboard from "./Gameboard.js";
import { DEFAULT_BOARD_SIZE, DEFAULT_COMPUTER_NAME, DEFAULT_AI_STRATEGY } from "./Constants.js";

/**
 * Base class for all players
 * @abstract
 */
class Player {
    #name;
    #gameboard;

    constructor(name, boardSize = DEFAULT_BOARD_SIZE) {
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
    constructor(name, boardSize = DEFAULT_BOARD_SIZE) {
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

    constructor(name = DEFAULT_COMPUTER_NAME, boardSize = DEFAULT_BOARD_SIZE, aiStrategy = DEFAULT_AI_STRATEGY) {
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
            case "hunt":
                return this.#huntAndTargetAttack(opponentBoard);
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
    #huntAndTargetAttack(opponentBoard) {
        const size = opponentBoard.size;
        const board = opponentBoard.board || [];

        const isHit = (val) => {
            if (val == null) return false;
            const s = String(val).toLowerCase();
            return s.includes("hit") || s === "x" || s === "h";
        };

        // 1) Target adjacent cells around any known hits first
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < (board[row] || []).length; col++) {
                if (!isHit(board[row][col])) continue;
                const neighbours = [
                    [col + 1, row],
                    [col - 1, row],
                    [col, row + 1],
                    [col, row - 1],
                ];
                for (const [nx, ny] of neighbours) {
                    if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
                    const key = `${nx},${ny}`;
                    if (this.#attackHistory.has(key)) continue;
                    return [nx, ny];
                }
            }
        }

        // 2) Hunt phase: checkerboard pattern to maximize chances
        const huntCandidates = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const key = `${x},${y}`;
                if (this.#attackHistory.has(key)) continue;
                if ((x + y) % 2 === 0) huntCandidates.push([x, y]);
            }
        }
        if (huntCandidates.length) {
            return huntCandidates[Math.floor(Math.random() * huntCandidates.length)];
        }

        // 3) Fallback: pick any unattacked cell
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const key = `${x},${y}`;
                if (!this.#attackHistory.has(key)) return [x, y];
            }
        }

        // Shouldn't happen due to checks in attack(), but return safe coords
        return [0, 0];
    }

    /* Probability calculations (where ships CAN be)
    Ship size awareness (what ships REMAIN)
    Weighted hunting (attack high-probability cells first)
    Context-aware targeting (smarter direction choices) */
    // #smartAttack(opponentBoard) { ... }
}
