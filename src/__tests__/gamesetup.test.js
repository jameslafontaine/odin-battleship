// gameSetup.test.js
import { placeShipsRandom, __testing__ } from "../utils/gameSetup.js";
import Gameboard from "../models/Gameboard.js";
import { MIN_BOARD_SIZE, MAX_BOARD_SIZE, MAX_PLACEMENT_ATTEMPTS } from "../models/Constants.js";

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

                expect(board.ships).toHaveLength(5);
                const lengths = board.ships.map((ship) => ship.length).sort();
                expect(lengths).toEqual([2, 2, 3, 4, 5]);
            });

            test("places all ships on multiple boards", () => {
                const board1 = new Gameboard(MAX_BOARD_SIZE);
                const board2 = new Gameboard(MAX_BOARD_SIZE);

                placeShipsRandom([board1, board2]);

                expect(board1.ships).toHaveLength(5);
                expect(board2.ships).toHaveLength(5);
            });

            test("works with custom ship lengths", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);
                const customLengths = [3, 3, 2];

                placeShipsRandom([board], customLengths);

                expect(board.ships).toHaveLength(3);
                const lengths = board.ships.map((ship) => ship.length).sort();
                expect(lengths).toEqual([2, 3, 3]);
            });

            test("handles boards of different sizes", () => {
                const smallBoard = new Gameboard(MIN_BOARD_SIZE + 3);
                const largeBoard = new Gameboard(MAX_BOARD_SIZE);
                const shipLengths = [3, 2, 2];

                placeShipsRandom([smallBoard, largeBoard], shipLengths);

                expect(smallBoard.ships).toHaveLength(3);
                expect(largeBoard.ships).toHaveLength(3);
            });
        });

        describe("Validation", () => {
            test("throws error when board too small for ships", () => {
                const tinyBoard = new Gameboard(MIN_BOARD_SIZE);

                expect(() => {
                    placeShipsRandom([tinyBoard]);
                }).toThrow("Board too small for these ships");
            });

            test("validates all boards before placing any ships", () => {
                const validBoard = new Gameboard(MAX_BOARD_SIZE);
                const invalidBoard = new Gameboard(MIN_BOARD_SIZE);

                expect(() => {
                    placeShipsRandom([validBoard, invalidBoard]);
                }).toThrow();

                expect(validBoard.ships).toHaveLength(0);
            });

            test("accepts board at 30% capacity threshold", () => {
                const board = new Gameboard(MIN_BOARD_SIZE + 3);
                const shipLengths = [5, 4, 3, 2, 2]; // 16 cells
                // 8×8 = 64 cells, 30% = 19.2, so 16 should pass

                expect(() => {
                    placeShipsRandom([board], shipLengths);
                }).not.toThrow();
            });
        });

        describe("Edge Cases", () => {
            test("handles empty boards array", () => {
                expect(() => {
                    placeShipsRandom([]);
                }).not.toThrow();
            });

            test("handles empty ship lengths array", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);

                placeShipsRandom([board], []);

                expect(board.ships).toHaveLength(0);
            });

            test("handles single ship", () => {
                const board = new Gameboard(MAX_BOARD_SIZE);

                placeShipsRandom([board], [3]);

                expect(board.ships).toHaveLength(1);
                expect(board.ships[0].length).toBe(3);
            });

            test("handles many boards", () => {
                const boards = Array.from({ length: 5 }, () => new Gameboard(MAX_BOARD_SIZE));

                placeShipsRandom(boards, [3, 2]);

                boards.forEach((board) => {
                    expect(board.ships).toHaveLength(2);
                });
            });
        });
    });
});
