// Board configuration
export const MIN_BOARD_SIZE = 5;
export const MAX_BOARD_SIZE = 10;
export const DEFAULT_BOARD_SIZE = 10;

// Ship configuration
export const MIN_SHIP_LENGTH = 2;
export const MAX_SHIP_LENGTH = 5;
export const DEFAULT_SHIP_LENGTH = 2;
export const DEFAULT_SHIP_LENGTHS = [5, 4, 3, 2, 2];

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
