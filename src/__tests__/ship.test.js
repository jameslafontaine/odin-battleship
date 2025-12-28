// Jest globals (describe, test, expect) are automatically available!
// No need to import them thanks to jest.config.js

import Ship from "../models/Ship.js";

describe("Ship Class Tests", () => {
    describe("Constructor", () => {
        test("throws RangeError for length < 2", () => {
            expect(() => new Ship(1)).toThrow(RangeError);
        });

        test("throws RangeError for length > 5", () => {
            expect(() => new Ship(6)).toThrow(RangeError);
        });

        test("uses default length when no argument provided", () => {
            const ship = new Ship();
            expect(ship).toMatchObject({
                _length: 2,
                _timesHit: 0,
            });
        });

        test.each([
            [2, "minimum"],
            [3, "middle"],
            [5, "maximum"],
        ])("creates ship with length %i (%s valid value)", (length) => {
            const ship = new Ship(length);
            expect(ship).toMatchObject({
                _length: length,
                _timesHit: 0,
            });
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
