export default class Ship {
    constructor(length = 2) {
        if (length < 2 || length > 5) {
            throw new RangeError("Ship must have length between 2 and 5 inclusive");
        }
        this._length = length;
        this._timesHit = 0;
    }

    hit() {
        if (!this.isSunk()) this._timesHit++;
        return this._timesHit;
    }

    isSunk() {
        return this._timesHit >= this._length;
    }
}
