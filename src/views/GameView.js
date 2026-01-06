/**
 * @fileoverview Generic main content view responsible for rendering:
 *  - The active entity (e.g., project, category, document) heading.
 *  - A list of items associated with that entity.
 *  - Action buttons for editing, deleting, starring, expanding items, etc.
 *
 * This view does not assume any specific schema. All data comes in
 * through arguments and is rendered generically.
 *
 * Exports:
 *  - MainView — A reusable UI view for list-based applications.
 *
 * Dependencies:
 *  - UIUtils
 *
 * @module GameView
 */

import { UIUtils } from "../utils/UIUtils.js";
import { CELL_STATES } from "../models/Constants.js";

export class GameView {
    #onNewGameClicked;
    #onCellClicked;

    /**
     * @param {HTMLElement} container The DOM element for the main section.
     */
    constructor(container) {
        this.container = container;

        this.messageContainer = container.querySelector(".message-container");
        this.gridsContainer = container.querySelector(".grids-container");
        this.playerGrid = container.querySelector(".player-grid");
        this.opponentGrid = container.querySelector(".opponent-grid");
        this.newGameBtn = container.querySelector(".new-game-button");

        /** @type {() => void} */
        this.#onNewGameClicked = null;

        this._setupEventListeners();
    }

    /**
     * Build the battleship game grids according to the provided boardSize.
     * @param {number} playerGridSize The dimensions of the player grid that will be built
     * @param {number} opponnetGridSize The dimensions of the opponent grid that will be built
     */
    #buildGrids(playerGridSize, opponentGridSize) {
        this.playerGrid.innerHTML = ``;
        this.opponentGrid.innerHTML = ``;

        for (let i = 0; i < playerGridSize; i++) {
            for (let j = 0; j < playerGridSize; j++) {
                // create a square
                let playerSquare = UIUtils.createElement("div", "player-square");

                playerSquare.id = `player-square${j}-${i}`;
                playerSquare.style.minWidth = `${100 / playerGridSize}%`;
                playerSquare.style.minHeight = `${100 / playerGridSize}%`;
                /* playerSquare.style.opacity = 0; */

                this.playerGrid.appendChild(playerSquare);
            }
        }

        for (let i = 0; i < opponentGridSize; i++) {
            for (let j = 0; j < opponentGridSize; j++) {
                // create a square
                let opponentSquare = UIUtils.createElement("div", "opponent-square");

                opponentSquare.classList.add("opponent-square");
                opponentSquare.id = `opponent-square${j}-${i}`;
                // use data attributes for robust coordinate retrieval
                opponentSquare.dataset.x = String(j);
                opponentSquare.dataset.y = String(i);
                // mark as not-clicked so we can prevent double-clicks
                opponentSquare.dataset.clicked = "false";
                // show pointer for clickable opponent squares
                opponentSquare.style.cursor = "pointer";
                opponentSquare.style.minWidth = `${100 / opponentGridSize}%`;
                opponentSquare.style.minHeight = `${100 / opponentGridSize}%`;
                /* opponentSquare.style.opacity = 0; */

                this.opponentGrid.appendChild(opponentSquare);
            }
        }

        this.playerGrid.style.gridTemplateColumns = `repeat(${playerGridSize}, 1fr)`;
        this.opponentGrid.style.gridTemplateColumns = `repeat(${opponentGridSize}, 1fr)`;
        // reveal the game grids
        this.gridsContainer.classList.add("visible");
    }

    #renderPlayerBoard(gameboard) {
        const gridSize = gameboard.size;
        const boardState = gameboard.board;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cellState = boardState[i][j];

                // if the cell is empty, we don't style it
                if (!cellState) {
                    continue;
                }
                let cellEl = this.playerGrid.querySelector(`#player-square${j}-${i}`);
                // check if this is a ship
                if (cellState === CELL_STATES.HIT) {
                    cellEl.appendChild(UIUtils.createElement("div", "hit"));
                    cellEl.classList.add("ship");
                } else if (cellState === CELL_STATES.MISS) {
                    cellEl.appendChild(UIUtils.createElement("div", "miss"));
                } else {
                    // it's a ship
                    cellEl.classList.add("ship");
                }
            }
        }
    }

    #renderOpponentBoard(gameboard) {
        const gridSize = gameboard.size;
        const boardState = gameboard.board;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cellState = boardState[i][j];
                const cellEl = this.opponentGrid.querySelector(`#opponent-square${j}-${i}`);
                if (!cellEl) continue;
                // don't render anything for empty cells (they remain clickable)
                if (!cellState) {
                    continue;
                }
                // check if this is a hit or miss
                if (cellState === CELL_STATES.HIT) {
                    cellEl.appendChild(UIUtils.createElement("div", "hit"));
                    cellEl.dataset.clicked = "true";
                    cellEl.style.cursor = "default";
                    cellEl.classList.add("clicked");
                } else if (cellState === CELL_STATES.MISS) {
                    cellEl.appendChild(UIUtils.createElement("div", "miss"));
                    cellEl.dataset.clicked = "true";
                    cellEl.style.cursor = "default";
                    cellEl.classList.add("clicked");
                } else {
                    // we don't show ships on opponent board
                    continue;
                }
            }
        }
    }

    renderGameMessage(message) {
        this.messageContainer.textContent = message;
    }

    disableGrids() {
        this.playerGrid.classList.add("disabled");
        this.opponentGrid.classList.add("disabled");
    }

    sleepGrids() {
        this.playerGrid.classList.add("sleeping");
        this.opponentGrid.classList.add("sleeping");
    }

    wakeGrids() {
        this.playerGrid.classList.remove("sleeping");
        this.opponentGrid.classList.remove("sleeping");
    }

    #renderRemainingShips(opponent) {
        const shipCountContainer = this.container.querySelector(".ship-count-container");
        const totalShips = opponent.gameboard.ships.length;
        const shipsRemaining = opponent.gameboard.getRemainingShips().length;

        shipCountContainer.innerHTML = "";
        for (let i = 0; i < totalShips; i++) {
            let shipIndicator = UIUtils.createElement("div", "ship-indicator");
            if (i < shipsRemaining) {
                shipIndicator.classList.add("ship-alive");
            } else {
                shipIndicator.classList.add("ship-sunk");
            }
            shipCountContainer.appendChild(shipIndicator);
        }
    }

    /**
     * Rerender the game view (player board + opponent board)
     */
    update(player, opponent) {
        this.#buildGrids(player.gameboard.size, opponent.gameboard.size);
        this.#renderPlayerBoard(player.gameboard);
        this.#renderOpponentBoard(opponent.gameboard);
        this.#renderRemainingShips(opponent);
    }

    /**
     * Event delegation for all controls inside the main view.
     */
    _setupEventListeners() {
        // Start new game button
        this.newGameBtn.addEventListener("click", () => {
            this.#onNewGameClicked?.();
        });

        // Delegated click handling for opponent grid; prevent clicks on already-clicked cells
        this.opponentGrid.addEventListener("click", (e) => {
            const square = e.target.closest(".opponent-square");
            if (!square || !this.opponentGrid.contains(square)) return;
            // prevent double clicks
            if (square.dataset.clicked === "true") return;
            const x = parseInt(square.dataset.x, 10);
            const y = parseInt(square.dataset.y, 10);
            if (Number.isNaN(x) || Number.isNaN(y)) return;
            // mark immediately to avoid race double-clicks while controller processes
            square.dataset.clicked = "true";
            square.style.cursor = "default";
            square.classList.add("clicked");
            this.#onCellClicked?.(x, y);
        });
    }

    setOnNewGameClicked(callback) {
        this.#onNewGameClicked = callback;
    }

    setOnCellClicked(callback) {
        this.#onCellClicked = callback;
    }
}
