// Board configuration
export const MIN_BOARD_SIZE = 5;
export const MAX_BOARD_SIZE = 10;
export const DEFAULT_BOARD_SIZE = 10;

// Ship configuration
export const MIN_SHIP_LENGTH = 2;
export const MAX_SHIP_LENGTH = 5;
export const DEFAULT_SHIP_LENGTH = 2;
export const SHIP_CONFIGURATIONS = {
    5: [2, 2], // 4 cells = 16% of 25
    6: [3, 2], // 5 cells = 14% of 36
    7: [3, 3, 2], // 8 cells = 16% of 49
    8: [4, 3, 2], // 9 cells = 14% of 64
    9: [4, 3, 2, 2], // 11 cells = 14% of 81
    10: [5, 4, 3, 2, 2], // 16 cells = 16% of 100
};

export function getShipConfigForBoardSize(size) {
    if (!SHIP_CONFIGURATIONS[size]) {
        throw new RangeError(`No ship configuration for board size ${size}`);
    }
    return SHIP_CONFIGURATIONS[size];
}

// Game setup
export const MAX_PLACEMENT_ATTEMPTS = 1000;
export const BOARD_CAPACITY_THRESHOLD = 0.3;

// Directions
export const DIRECTIONS = {
    NORTH: "N",
    EAST: "E",
    SOUTH: "S",
    WEST: "W",
};

export const VALID_DIRECTIONS = ["N", "E", "S", "W"];

// Attack results
export const ATTACK_RESULTS = {
    HIT: "hit",
    MISS: "miss",
    SUNK: "sunk",
    SUNK_ALL: "sunk-all",
};

// Cell states
export const CELL_STATES = {
    EMPTY: null,
    MISS: "miss",
    HIT: "hit",
};

// Player defaults
export const DEFAULT_COMPUTER_NAME = "Computer";
export const DEFAULT_AI_STRATEGY = "random";
