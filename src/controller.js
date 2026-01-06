/**
 * @fileoverview Bootstraps and orchestrates the main application.
 *
 * Responsibilities:
 *  - Initialize core application components.
 *  - Connect the data/model layer with view event handlers.
 *  - Trigger the render of UI components.
 *
 * Exports:
 *  - initApp — Function that starts the application.
 *
 * Dependencies:
 *  - Player — The global state/data managers (model layer).
 *  - SidebarView — Renders and manages a sidebar UI.
 *  - MainView — Renders and manages the main content UI.
 *  - DialogView — Handles modal dialog UI instances.
 *
 * @module controller
 */

import { GameView } from "./views/GameView.js";
import { DialogView } from "./views/DialogView.js";
import { placeShipsRandom, initialisePlayers } from "./utils/gameSetup.js";

// ----------------------

// Game state
let playerOne;
let playerTwo;
let currentGameId = 0;
let gameId;

// ----------------------

// View instances
const gameView = new GameView(document.querySelector(".game-container"));
const newGameDialog = new DialogView(document.querySelector(".new-game-dialog"));

// ----------------------
// Helper to render the entire app state
// ----------------------
function renderAll(player, opponent) {
    gameView.update(player, opponent);
}

// ----------------------
// Assign all callbacks between views and the game logic
// ----------------------
function assignCallbacks() {
    // GameView events
    gameView.setOnNewGameClicked(() => {
        newGameDialog.open();
    });

    gameView.setOnCellClicked(async (x, y) => {
        await handlePlayerTurn(x, y, gameId);
    });

    // Dialog events
    newGameDialog.setOnSubmit(startNewGame);
}

function startNewGame(formData) {
    currentGameId++;
    gameId = currentGameId;
    ({ playerOne, playerTwo } = initialisePlayers(formData));

    placeShipsRandom([playerOne.gameboard, playerTwo.gameboard]);
    renderAll(playerOne, playerTwo);
    gameView.renderGameMessage(`It's ${playerOne.name}'s turn.`);
    gameView.wakeGrids();
    gameView.enableGrids();
}

async function handlePlayerTurn(x, y, gameId) {
    // Player one's turn (human)
    const attackResult = playerOne.attack(playerTwo.gameboard, x, y);
    renderAll(playerOne, playerTwo);
    gameView.sleepGrids();

    if (attackResult.result === "sunk-all") {
        gameView.renderGameMessage(`${playerOne.name} wins!`);
        gameView.disableGrids();
        return;
    } else {
        // Computer's turn
        gameView.renderGameMessage(`${playerOne.name} attacked - ${attackResult.result}.`);
        await new Promise((r) => setTimeout(r, 2000));

        if (gameId !== currentGameId) return;
        const computerAttack = playerTwo.attack(playerOne.gameboard);
        renderAll(playerOne, playerTwo);

        gameView.renderGameMessage(`${playerTwo.name} attacked - ${computerAttack.result}.`);

        if (computerAttack.result === "sunk-all") {
            gameView.renderGameMessage(`${playerTwo.name} wins!`);
            gameView.disableGrids();
            return;
        }
        // await new Promise((r) => setTimeout(r, 2000));
        // gameView.renderGameMessage(`It's ${playerOne.name}'s turn.`);
        gameView.wakeGrids();
    }
}

// ----------------------
// Initialize the app
// ----------------------
export async function initApp() {
    assignCallbacks();
}
