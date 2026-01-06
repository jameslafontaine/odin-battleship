import Ship from "../models/Ship.js";
import { MIN_SHIP_LENGTH, MAX_SHIP_LENGTH, DEFAULT_SHIP_LENGTH } from "../models/Constants.js";

describe("Ship Class Tests", () => {
    describe("Constructor", () => {
        test("throws TypeError for non-integer length", () => {
            expect(() => new Ship("1")).toThrow(TypeError);
            expect(() => new Ship(1.1)).toThrow(TypeError);
            expect(() => new Ship(false)).toThrow(TypeError);
        });

        test("throws RangeError for length below minimum", () => {
            expect(() => new Ship(MIN_SHIP_LENGTH - 1)).toThrow(RangeError);
        });

        test("throws RangeError for length above maximum", () => {
            expect(() => new Ship(MAX_SHIP_LENGTH + 1)).toThrow(RangeError);
        });

        test("uses default length when no argument provided", () => {
            const ship = new Ship();
            expect(ship.length).toBe(DEFAULT_SHIP_LENGTH);
        });

        test.each([
            [MIN_SHIP_LENGTH, "minimum"],
            [3, "middle"],
            [MAX_SHIP_LENGTH, "maximum"],
        ])("creates ship with length %i (%s valid value)", (length) => {
            const ship = new Ship(length);
            expect(ship.length).toBe(length);
        });
    });

    describe("Damage and Sinking", () => {
        let ship;

        beforeEach(() => {
            ship = new Ship(3);
        });

        test("sinks after receiving hits equal to length", () => {
            expect(ship.isSunk()).toBe(false);

            ship.hit();
            expect(ship.isSunk()).toBe(false);

            ship.hit();
            expect(ship.isSunk()).toBe(false);

            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });

        test("cannot take damage after sinking", () => {
            // Sink the ship
            ship.hit();
            ship.hit();
            ship.hit();

            // Further hits don't increase damage
            expect(ship.hit()).toBe(3);
            expect(ship.hit()).toBe(3);
            expect(ship.isSunk()).toBe(true);
        });
    });
});
