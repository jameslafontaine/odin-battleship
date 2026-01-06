import Gameboard from "../models/Gameboard.js";
import { MIN_BOARD_SIZE, MAX_BOARD_SIZE, DEFAULT_BOARD_SIZE, DIRECTIONS, ATTACK_RESULTS } from "../models/Constants.js";

describe("Gameboard Class Tests", () => {
    describe("Constructor Tests", () => {
        describe("Invalid Input Tests", () => {
            test("throws TypeError for non-integer size", () => {
                expect(() => new Gameboard("4")).toThrow(TypeError);
                expect(() => new Gameboard(4.4)).toThrow(TypeError);
                expect(() => new Gameboard(false)).toThrow(TypeError);
            });

            test("throws RangeError for size below minimum", () => {
                expect(() => new Gameboard(MIN_BOARD_SIZE - 1)).toThrow(RangeError);
            });

            test("throws RangeError for size above maximum", () => {
                expect(() => new Gameboard(MAX_BOARD_SIZE + 1)).toThrow(RangeError);
            });
        });

        describe("Valid Input Tests", () => {
            test("assigns default size correctly", () => {
                expect(new Gameboard().size).toBe(DEFAULT_BOARD_SIZE);
            });

            test.each([
                [MIN_BOARD_SIZE, "minimum"],
                [8, "middle"],
                [MAX_BOARD_SIZE, "maximum"],
            ])("creates gameboard with size %i (%s valid value)", (size) => {
                const gameboard = new Gameboard(size);
                expect(gameboard.size).toBe(size);
            });
        });
    });

    describe("placeShip() Tests", () => {
        let gameboard;

        beforeEach(() => {
            gameboard = new Gameboard(DEFAULT_BOARD_SIZE);
        });

        describe("Invalid Input Tests", () => {
            test("throws TypeError for non-integer coordinates", () => {
                expect(() => gameboard.placeShip("a", 0)).toThrow(TypeError);
                expect(() => gameboard.placeShip(0, "a")).toThrow(TypeError);
            });

            test("throws TypeError for invalid direction", () => {
                expect(() => gameboard.placeShip(0, 0, 2, "SA")).toThrow(TypeError);
                expect(() => gameboard.placeShip(0, 0, 2, 1)).toThrow(TypeError);
                expect(() => gameboard.placeShip(0, 0, 2, "north")).toThrow(TypeError);
            });
        });

        describe("Valid Input Tests", () => {
            test("places ship successfully", () => {
                const result = gameboard.placeShip(0, 0, 2, DIRECTIONS.SOUTH);
                expect(result).toMatchObject({ success: true });
                expect(result.ship).toBeDefined();
            });

            test("prevents overlapping ships", () => {
                gameboard.placeShip(0, 0, 2, DIRECTIONS.SOUTH);

                expect(gameboard.placeShip(0, 0, 2, DIRECTIONS.SOUTH)).toMatchObject({
                    success: false,
                    reason: "cell-occupied",
                });
                expect(gameboard.placeShip(0, 1, 2, DIRECTIONS.EAST)).toMatchObject({
                    success: false,
                    reason: "cell-occupied",
                });
            });

            test("allows non-overlapping ships", () => {
                gameboard.placeShip(0, 0, 2, DIRECTIONS.SOUTH);

                expect(gameboard.placeShip(0, 2, 2, DIRECTIONS.EAST)).toMatchObject({
                    success: true,
                });
                expect(gameboard.placeShip(1, 0, 2, DIRECTIONS.EAST)).toMatchObject({
                    success: true,
                });
            });

            test("fails to place ships outside the board", () => {
                expect(gameboard.placeShip(0, 0, 2, DIRECTIONS.WEST)).toMatchObject({
                    success: false,
                    reason: "out-of-bounds",
                });
                expect(gameboard.placeShip(-1, 0)).toMatchObject({
                    success: false,
                    reason: "out-of-bounds",
                });
                expect(gameboard.placeShip(0, -1)).toMatchObject({
                    success: false,
                    reason: "out-of-bounds",
                });
                expect(gameboard.placeShip(MAX_BOARD_SIZE + 1, 0)).toMatchObject({
                    success: false,
                    reason: "out-of-bounds",
                });
            });

            test("places ships in all four directions", () => {
                expect(gameboard.placeShip(5, 5, 3, DIRECTIONS.NORTH).success).toBe(true);
                expect(gameboard.placeShip(5, 0, 3, DIRECTIONS.EAST).success).toBe(true);
                expect(gameboard.placeShip(0, 0, 3, DIRECTIONS.SOUTH).success).toBe(true);
                expect(gameboard.placeShip(9, 5, 3, DIRECTIONS.WEST).success).toBe(true);
            });
        });
    });

    describe("receiveAttack() Tests", () => {
        let gameboard;

        beforeEach(() => {
            gameboard = new Gameboard(DEFAULT_BOARD_SIZE);
            gameboard.placeShip(0, 0, 2, DIRECTIONS.SOUTH); // Ship at (0,0) and (0,1)
            gameboard.placeShip(1, 0, 2, DIRECTIONS.SOUTH); // Ship at (1,0) and (1,1)
        });

        describe("Invalid Input Tests", () => {
            test("throws TypeError for non-integer coordinates", () => {
                expect(() => gameboard.receiveAttack("a", 0)).toThrow(TypeError);
                expect(() => gameboard.receiveAttack(0, "a")).toThrow(TypeError);
            });

            test("throws RangeError for coordinates outside the board", () => {
                expect(() => gameboard.receiveAttack(-1, 0)).toThrow(RangeError);
                expect(() => gameboard.receiveAttack(0, -1)).toThrow(RangeError);
                expect(() => gameboard.receiveAttack(MAX_BOARD_SIZE + 1, 0)).toThrow(RangeError);
                expect(() => gameboard.receiveAttack(0, MAX_BOARD_SIZE + 1)).toThrow(RangeError);
            });

            test("throws Error when attacking same cell twice", () => {
                gameboard.receiveAttack(0, 0);
                expect(() => gameboard.receiveAttack(0, 0)).toThrow(Error);
                expect(() => gameboard.receiveAttack(0, 0)).toThrow(/already been attacked/);
            });
        });

        describe("Valid Input Tests", () => {
            test("returns 'hit' when attacking ship", () => {
                expect(gameboard.receiveAttack(0, 0)).toBe(ATTACK_RESULTS.HIT);
            });

            test("returns 'miss' when attacking empty water", () => {
                expect(gameboard.receiveAttack(5, 5)).toBe(ATTACK_RESULTS.MISS);
            });

            test("returns 'sunk' when ship is fully destroyed", () => {
                gameboard.receiveAttack(0, 0); // First hit
                expect(gameboard.receiveAttack(0, 1)).toBe(ATTACK_RESULTS.SUNK); // Sinks ship
            });

            test("returns 'sunk-all' when all ships destroyed", () => {
                gameboard.receiveAttack(0, 0); // Ship 1, hit 1
                gameboard.receiveAttack(0, 1); // Ship 1, sunk
                gameboard.receiveAttack(1, 0); // Ship 2, hit 1
                expect(gameboard.receiveAttack(1, 1)).toBe(ATTACK_RESULTS.SUNK_ALL); // All sunk
            });
        });
    });

    describe("ships Getter Tests", () => {
        test("returns empty array for new board", () => {
            const gameboard = new Gameboard(DEFAULT_BOARD_SIZE);
            expect(gameboard.ships).toEqual([]);
        });

        test("returns all placed ships", () => {
            const gameboard = new Gameboard(DEFAULT_BOARD_SIZE);
            gameboard.placeShip(0, 0, 2, DIRECTIONS.EAST);
            gameboard.placeShip(0, 1, 3, DIRECTIONS.EAST);

            expect(gameboard.ships).toHaveLength(2);
            expect(gameboard.ships[0].length).toBe(2);
            expect(gameboard.ships[1].length).toBe(3);
        });
    });
});
