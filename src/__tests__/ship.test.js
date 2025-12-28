// Jest globals (describe, test, expect) are automatically available!
// No need to import them thanks to jest.config.js

import Ship from "../models/Ship.js";

describe("Ship Class Tests", () => {
    describe("Constructor Tests", () => {
        test("length < 2 throws RangeError", () => {
            expect(() => new Ship(1)).toThrow(RangeError);
        });
        test("length > 5 throws RangeError", () => {
            expect(() => new Ship(6)).toThrow(RangeError);
        });
        test("default length assigned correctly", () => {
            expect(new Ship()).toEqual({
                _length: 2,
                _timesHit: 0,
            });
        });
        test("ship of length 2 created correctly", () => {
            expect(new Ship(2)).toEqual({
                _length: 2,
                _timesHit: 0,
            });
        });
        test("ship of length 3 created correctly", () => {
            expect(new Ship(3)).toEqual({
                _length: 3,
                _timesHit: 0,
            });
        });
        test("ship of length 5 created correctly", () => {
            expect(new Ship(5)).toEqual({
                _length: 5,
                _timesHit: 0,
            });
        });
    });

    describe("hit() and isSunk() Tests", () => {
        let ship;
        beforeEach(() => {
            ship = new Ship(3);
        });
        test("hit() function correctly increments", () => {
            expect(ship.hit()).toBe(1);
            expect(ship.hit()).toBe(2);
            expect(ship.hit()).toBe(3);
        });

        test("hit() function stops incrementing when ship has sunk", () => {
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hit()).toBe(3);
            expect(ship.hit()).toBe(3);
            expect(ship.hit()).toBe(3);
        });

        test("isSunk() function works", () => {
            expect(ship.isSunk()).toBe(false);
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(false);
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });
    });
});
