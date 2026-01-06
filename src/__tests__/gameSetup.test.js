// gameSetup.test.js
import { placeShipsRandom, __testing__ } from "../utils/gameSetup.js";
import Gameboard from "../models/Gameboard.js";
import {
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
    MAX_PLACEMENT_ATTEMPTS,
    getShipConfigForBoardSize,
    BOARD_CAPACITY_THRESHOLD,
} from "../models/Constants.js";
import * as CONSTANTS from "../models/Constants.js";

const { pickRandomDirection, tryPlaceShip } = __testing__;

describe("Game Setup Module Tests", () => {
    describe("pickRandomDirection()", () => {
        test("returns a valid direction", () => {
            const direction = pickRandomDirection();
            expect(["N", "E", "S", "W"]).toContain(direction);
        });

        test("returns all four directions over multiple calls", () => {
            const directions = new Set();

            for (let i = 0; i < 100; i++) {
                directions.add(pickRandomDirection());
            }

            expect(directions.size).toBe(4);
            expect(directions).toEqual(new Set(["N", "E", "S", "W"]));
        });
    });

    describe("tryPlaceShip()", () => {
        let board;

        beforeEach(() => {
            board = new Gameboard(MAX_BOARD_SIZE);
        });

        test("successfully places ship with retry logic", () => {
            // Place a ship first to make placement harder
            board.placeShip(0, 0, 5, "E");

            // Should still succeed, might take multiple attempts
            expect(() => {
                tryPlaceShip(board, 3, MAX_PLACEMENT_ATTEMPTS);
            }).not.toThrow();

            expect(board.ships).toHaveLength(2);
        });

        test("throws error after max attempts exceeded", () => {
            const tinyBoard = new Gameboard(MIN_BOARD_SIZE);

            expect(() => {
                tryPlaceShip(tinyBoard, 20, 100);
            }).toThrow(/Failed to place 20-length ship after 100 attempts/);
        });

        test("throws error when board completely full", () => {
            const smallBoard = new Gameboard(MIN_BOARD_SIZE);

            // Fill the board completely
            for (let i = 0; i < MIN_BOARD_SIZE; i++) {
                smallBoard.placeShip(0, i, MIN_BOARD_SIZE, "E");
            }

            expect(() => {
                tryPlaceShip(smallBoard, 2, 100);
            }).toThrow();
        });
    });

    describe("placeShipsRandom()", () => {
        describe("Success Cases", () => {
            test("places all ships on single board with default lengths", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);

                placeShipsRandom([board]);

                const expected = getShipConfigForBoardSize(board.size);
                expect(board.ships).toHaveLength(expected.length);
                const lengths = board.ships.map((ship) => ship.length).sort();
                expect(lengths).toEqual(expected.slice().sort());
            });

            test("places all ships on multiple boards", () => {
                const board1 = new Gameboard(MAX_BOARD_SIZE);
                const board2 = new Gameboard(MAX_BOARD_SIZE);

                placeShipsRandom([board1, board2]);

                const expected = getShipConfigForBoardSize(board1.size);
                expect(board1.ships).toHaveLength(expected.length);
                expect(board2.ships).toHaveLength(expected.length);
            });

            test("places ships according to lookup table for a non-max board", () => {
                const board = new Gameboard(MAX_BOARD_SIZE - 2);
                const expected = getShipConfigForBoardSize(board.size);

                placeShipsRandom([board]);

                expect(board.ships).toHaveLength(expected.length);
                const lengths = board.ships.map((ship) => ship.length).sort();
                expect(lengths).toEqual(expected.slice().sort());
            });

            test("handles boards of different sizes", () => {
                const smallBoard = new Gameboard(MIN_BOARD_SIZE + 3);
                const largeBoard = new Gameboard(MAX_BOARD_SIZE);
                const smallExpected = getShipConfigForBoardSize(smallBoard.size);
                const largeExpected = getShipConfigForBoardSize(largeBoard.size);

                placeShipsRandom([smallBoard, largeBoard]);

                expect(smallBoard.ships).toHaveLength(smallExpected.length);
                expect(largeBoard.ships).toHaveLength(largeExpected.length);
            });
        });

        describe("Validation", () => {
            test("accepts board at 30% capacity threshold", () => {
                const board = new Gameboard(MIN_BOARD_SIZE + 3);
                const expected = getShipConfigForBoardSize(board.size);
                const capacity = expected.reduce((s, l) => s + l, 0);
                expect(capacity / board.size ** 2).toBeLessThanOrEqual(BOARD_CAPACITY_THRESHOLD);
                expect(() => {
                    placeShipsRandom([board]);
                }).not.toThrow();
            });
        });

        describe("Edge Cases", () => {
            test("handles empty boards array", () => {
                expect(() => {
                    placeShipsRandom([]);
                }).not.toThrow();
            });

            test("handles empty ship lengths from lookup (no ships to place)", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);
                const spy = jest.spyOn(CONSTANTS, "getShipConfigForBoardSize").mockReturnValue([]);

                placeShipsRandom([board]);

                expect(board.ships).toHaveLength(0);
                spy.mockRestore();
            });

            test("handles single ship from lookup", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);
                const spy = jest.spyOn(CONSTANTS, "getShipConfigForBoardSize").mockReturnValue([3]);

                placeShipsRandom([board]);

                expect(board.ships).toHaveLength(1);
                expect(board.ships[0].length).toBe(3);
                spy.mockRestore();
            });

            test("handles many boards", () => {
                const boards = Array.from({ length: 5 }, () => new Gameboard(MAX_BOARD_SIZE));
                const spy = jest.spyOn(CONSTANTS, "getShipConfigForBoardSize").mockReturnValue([3, 2]);
                placeShipsRandom(boards);
                spy.mockRestore();

                boards.forEach((board) => {
                    expect(board.ships).toHaveLength(2);
                });
            });
        });
    });
});
