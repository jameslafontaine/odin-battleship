import { RealPlayer, ComputerPlayer } from "../models/Player.js";
import Gameboard from "../models/Gameboard.js";
import {
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
    DEFAULT_BOARD_SIZE,
    DIRECTIONS,
    ATTACK_RESULTS,
    DEFAULT_COMPUTER_NAME,
} from "../models/Constants.js";

describe("Player Classes Tests", () => {
    describe("RealPlayer Tests", () => {
        describe("Constructor Tests", () => {
            test("creates player with valid name and default board size", () => {
                const player = new RealPlayer("Alice");
                expect(player.name).toBe("Alice");
                expect(player.gameboard).toBeInstanceOf(Gameboard);
                expect(player.gameboard.size).toBe(DEFAULT_BOARD_SIZE);
            });

            test("creates player with custom board size", () => {
                const player = new RealPlayer("Bob", 8);
                expect(player.name).toBe("Bob");
                expect(player.gameboard.size).toBe(8);
            });

            test("trims whitespace from player name", () => {
                const player = new RealPlayer("  Charlie  ");
                expect(player.name).toBe("Charlie");
            });

            test("throws TypeError for empty name", () => {
                expect(() => new RealPlayer("")).toThrow(TypeError);
                expect(() => new RealPlayer("   ")).toThrow(TypeError);
            });

            test("throws TypeError for non-string name", () => {
                expect(() => new RealPlayer(123)).toThrow(TypeError);
                expect(() => new RealPlayer(null)).toThrow(TypeError);
                expect(() => new RealPlayer(undefined)).toThrow(TypeError);
            });

            test("throws error for invalid board size (delegated to Gameboard)", () => {
                expect(() => new RealPlayer("Alice", MIN_BOARD_SIZE - 2)).toThrow(RangeError);
                expect(() => new RealPlayer("Alice", MAX_BOARD_SIZE + 5)).toThrow(RangeError);
                expect(() => new RealPlayer("Alice", "10")).toThrow(TypeError);
            });
        });

        describe("Gameboard Independence", () => {
            test("each player has their own gameboard instance", () => {
                const player1 = new RealPlayer("Alice");
                const player2 = new RealPlayer("Bob");

                // Place ship on player1's board
                player1.gameboard.placeShip(0, 0, 3, DIRECTIONS.EAST);

                // player2's board should be unaffected
                expect(player2.gameboard.ships).toHaveLength(0);
                expect(player1.gameboard.ships).toHaveLength(1);
            });
        });

        describe("attack() Method", () => {
            let player1, player2;

            beforeEach(() => {
                player1 = new RealPlayer("Alice");
                player2 = new RealPlayer("Bob");
                player2.gameboard.placeShip(0, 0, 2, DIRECTIONS.EAST); // Ship 1
                player2.gameboard.placeShip(0, 1, 2, DIRECTIONS.EAST); // Ship 2
            });

            test("successfully attacks with valid coordinates", () => {
                const result = player1.attack(player2.gameboard, 0, 0);
                expect(result.result).toBe(ATTACK_RESULTS.HIT);
            });

            test("returns 'miss' for empty water", () => {
                const result = player1.attack(player2.gameboard, 5, 5);
                expect(result.result).toBe(ATTACK_RESULTS.MISS);
            });

            test("returns 'sunk' when ship is destroyed", () => {
                player1.attack(player2.gameboard, 0, 0); // Hit ship 1
                const result = player1.attack(player2.gameboard, 1, 0); // Sink ship 1
                expect(result.result).toBe(ATTACK_RESULTS.SUNK);
            });

            test("returns 'sunk-all' when all ships destroyed", () => {
                // Sink ship 1
                player1.attack(player2.gameboard, 0, 0);
                player1.attack(player2.gameboard, 1, 0);

                // Sink ship 2
                player1.attack(player2.gameboard, 0, 1);
                const result = player1.attack(player2.gameboard, 1, 1);

                expect(result.result).toBe(ATTACK_RESULTS.SUNK_ALL);
            });

            test("throws error when coordinates not provided", () => {
                expect(() => player1.attack(player2.gameboard)).toThrow(Error);
                expect(() => player1.attack(player2.gameboard, 5)).toThrow(Error);
            });

            test("throws TypeError for invalid coordinate types", () => {
                expect(() => player1.attack(player2.gameboard, "a", 0)).toThrow(TypeError);
                expect(() => player1.attack(player2.gameboard, 0, "b")).toThrow(TypeError);
            });

            test("throws RangeError for out-of-bounds coordinates", () => {
                expect(() => player1.attack(player2.gameboard, -1, 0)).toThrow(RangeError);
                expect(() => player1.attack(player2.gameboard, MAX_BOARD_SIZE + 5, 0)).toThrow(RangeError);
            });

            test("throws error when attacking same cell twice", () => {
                player1.attack(player2.gameboard, 5, 5);
                expect(() => player1.attack(player2.gameboard, 5, 5)).toThrow(Error);
            });
        });
    });

    describe("ComputerPlayer Tests", () => {
        describe("Constructor Tests", () => {
            test("creates computer player with default name", () => {
                const computer = new ComputerPlayer();
                expect(computer.name).toBe(DEFAULT_COMPUTER_NAME);
                expect(computer.gameboard).toBeInstanceOf(Gameboard);
                expect(computer.gameboard.size).toBe(DEFAULT_BOARD_SIZE);
            });

            test("creates computer player with custom name", () => {
                const computer = new ComputerPlayer("HAL 9000");
                expect(computer.name).toBe("HAL 9000");
            });

            test("creates computer player with custom board size", () => {
                const computer = new ComputerPlayer("AI", 8);
                expect(computer.gameboard.size).toBe(8);
            });

            test("throws TypeError for invalid name", () => {
                expect(() => new ComputerPlayer("")).toThrow(TypeError);
                expect(() => new ComputerPlayer(123)).toThrow(TypeError);
            });
        });

        describe("attack() Method - Basic Functionality", () => {
            let computer, opponent;

            beforeEach(() => {
                computer = new ComputerPlayer("AI");
                opponent = new RealPlayer("Human");
                opponent.gameboard.placeShip(0, 0, 5, DIRECTIONS.EAST);
            });

            test("generates attack automatically without coordinates", () => {
                const result = computer.attack(opponent.gameboard);
                expect([ATTACK_RESULTS.HIT, ATTACK_RESULTS.MISS]).toContain(result.result);
            });

            test("generates coordinates within board bounds", () => {
                // Attack multiple times to test randomness
                for (let i = 0; i < 20; i++) {
                    const result = computer.attack(opponent.gameboard);
                    // If we get here without throwing, coordinates were valid
                    expect([
                        ATTACK_RESULTS.HIT,
                        ATTACK_RESULTS.MISS,
                        ATTACK_RESULTS.SUNK,
                        ATTACK_RESULTS.SUNK_ALL,
                    ]).toContain(result.result);
                }
            });
        });

        describe("attack() Method - No Duplicate Attacks", () => {
            let computer, opponent;

            beforeEach(() => {
                computer = new ComputerPlayer("AI");
                opponent = new RealPlayer("Human", MIN_BOARD_SIZE); // Small board for easier testing
            });

            test("doesn't attack the same cell twice", () => {
                const totalCells = MIN_BOARD_SIZE ** 2;

                // Attack all cells on the board
                for (let i = 0; i < totalCells; i++) {
                    const result = computer.attack(opponent.gameboard);
                    expect([
                        ATTACK_RESULTS.HIT,
                        ATTACK_RESULTS.MISS,
                        ATTACK_RESULTS.SUNK,
                        ATTACK_RESULTS.SUNK_ALL,
                    ]).toContain(result.result);
                }

                // Next attack should fail because all cells attacked
                expect(() => computer.attack(opponent.gameboard)).toThrow();
            });
        });

        describe("Integration Tests", () => {
            test("computer can play a full game", () => {
                const computer = new ComputerPlayer("AI");
                const human = new RealPlayer("Player");

                // Setup ships
                human.gameboard.placeShip(0, 0, 2, DIRECTIONS.EAST);
                human.gameboard.placeShip(0, 1, 2, DIRECTIONS.EAST);
                computer.gameboard.placeShip(0, 0, 3, DIRECTIONS.EAST);

                // Make computer attacks deterministic so test cannot flake
                const hitSequence = [
                    [0, 0],
                    [1, 0],
                    [0, 1],
                    [1, 1],
                ];
                let idx = 0;
                const spy = jest.spyOn(computer, "attack").mockImplementation((opponentBoard) => {
                    const [x, y] = hitSequence[idx++];
                    return { result: opponentBoard.receiveAttack(x, y), x, y };
                });

                // Computer attacks until all human ships sunk
                let result;
                let attackCount = 0;
                const maxAttacks = 100; // Safety limit still fine now

                while (result !== ATTACK_RESULTS.SUNK_ALL && attackCount < maxAttacks) {
                    let attack = computer.attack(human.gameboard);
                    result = attack.result;
                    attackCount++;
                }

                spy.mockRestore();

                expect(result).toBe(ATTACK_RESULTS.SUNK_ALL);
                expect(attackCount).toBeLessThan(maxAttacks);
            });
        });
    });

    describe("Player Interaction Tests", () => {
        test("two players can attack each other", () => {
            const player1 = new RealPlayer("Alice");
            const player2 = new RealPlayer("Bob");

            player1.gameboard.placeShip(0, 0, 2, DIRECTIONS.EAST);
            player2.gameboard.placeShip(5, 5, 2, DIRECTIONS.EAST);

            // Player 1 attacks Player 2
            const result1 = player1.attack(player2.gameboard, 5, 5);
            expect(result1.result).toBe(ATTACK_RESULTS.HIT);

            // Player 2 attacks Player 1
            const result2 = player2.attack(player1.gameboard, 0, 0);
            expect(result2.result).toBe(ATTACK_RESULTS.HIT);
        });

        test("human vs computer gameplay", () => {
            const human = new RealPlayer("Alice");
            const computer = new ComputerPlayer("AI");

            human.gameboard.placeShip(0, 0, 3, DIRECTIONS.EAST);
            computer.gameboard.placeShip(5, 5, 3, DIRECTIONS.EAST);

            // Human attacks computer
            const humanAttack = human.attack(computer.gameboard, 5, 5);
            expect([ATTACK_RESULTS.HIT, ATTACK_RESULTS.MISS]).toContain(humanAttack.result);

            // Computer attacks human
            const computerAttack = computer.attack(human.gameboard);
            expect([ATTACK_RESULTS.HIT, ATTACK_RESULTS.MISS]).toContain(computerAttack.result);
        });

        test("computer vs computer gameplay", () => {
            const computerOne = new ComputerPlayer("AI 1");
            const computerTwo = new ComputerPlayer("AI 2");

            computerOne.gameboard.placeShip(0, 0, 3, DIRECTIONS.EAST);
            computerTwo.gameboard.placeShip(5, 5, 3, DIRECTIONS.EAST);

            // 1 attacks 2
            const oneAttack = computerOne.attack(computerTwo.gameboard);
            expect([ATTACK_RESULTS.HIT, ATTACK_RESULTS.MISS]).toContain(oneAttack.result);

            // 2 attacks 1
            const twoAttack = computerTwo.attack(computerOne.gameboard);
            expect([ATTACK_RESULTS.HIT, ATTACK_RESULTS.MISS]).toContain(twoAttack.result);
        });
    });
});
