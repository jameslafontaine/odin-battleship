// Export public API
export { placeShipsRandom, initialisePlayers };

// Export for testing
export const __testing__ = { pickRandomDirection, tryPlaceShip };

import { ComputerPlayer, RealPlayer } from "../models/Player.js";

// gameSetup.js
import {
    MAX_PLACEMENT_ATTEMPTS,
    BOARD_CAPACITY_THRESHOLD,
    DEFAULT_SHIP_LENGTHS,
    VALID_DIRECTIONS,
} from "../models/Constants.js";

function pickRandomDirection() {
    return VALID_DIRECTIONS[Math.floor(Math.random() * VALID_DIRECTIONS.length)];
}

function tryPlaceShip(board, length, maxAttempts) {
    let attempts = 0;
    while (
        !board.placeShip(
            Math.floor(Math.random() * board.size),
            Math.floor(Math.random() * board.size),
            length,
            pickRandomDirection()
        ).success
    ) {
        attempts++;
        if (attempts >= maxAttempts) {
            throw new Error(`Failed to place ${length}-length ship after ${maxAttempts} attempts`);
        }
    }
}

function placeShipsRandom(boards, shipLengths = DEFAULT_SHIP_LENGTHS) {
    const maxAttempts = MAX_PLACEMENT_ATTEMPTS;
    const totalShipCells = shipLengths.reduce((a, b) => a + b, 0);

    // Step 1: Validate ALL boards first
    for (let board of boards) {
        const totalBoardCells = board.size ** 2;

        if (totalShipCells > totalBoardCells * BOARD_CAPACITY_THRESHOLD) {
            throw new Error("Board too small for these ships");
        }
    }

    // Step 2: Only if ALL valid, place ships
    for (let board of boards) {
        for (let len of shipLengths) {
            tryPlaceShip(board, len, maxAttempts);
        }
    }
}

function initialisePlayers(formData) {
    let playerOne;
    let playerTwo;
    const boardSize = Number(formData["board-size"]);
    const playerOneType = formData["player-type-1"];
    const playerOneName = formData["player-name-1"];
    const playerTwoType = formData["player-type-2"];
    const playerTwoName = formData["player-name-2"];

    // Player One
    switch (playerOneType) {
        case "real":
            playerOne = new RealPlayer(playerOneName, boardSize);
            break;
        case "comp":
            playerOne = new ComputerPlayer(playerOneName, boardSize, formData["strategy-1"]);
            break;
        default:
            throw new Error("Invalid player type for Player 1");
    }

    // Player Two
    switch (playerTwoType) {
        case "real":
            playerTwo = new RealPlayer(playerTwoName, boardSize);
            break;
        case "comp":
            playerTwo = new ComputerPlayer(playerTwoName, boardSize, formData["strategy-2"]);
            break;
        default:
            throw new Error("Invalid player type for Player 2");
    }

    return { playerOne, playerTwo };
}
