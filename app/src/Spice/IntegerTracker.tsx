export default class IntegerTracker {
    start: number;
    head: number;
    freed: Array<number>;

    constructor(start: number = 1) {
        this.start = this.head = start;
        this.freed = [];
    }

    freeNumber(num: number) {
        if (this.freed.indexOf(num) >= 0) {
            console.log("Attempted to free freed number: " + num);
        }
        else {
            this.freed.push(num);
        }
    }

    newNumber(): number {
        if (!this.freed.length) {
            return this.head++;
        }
        else {
            this.freed.sort();
            return this.freed.pop() ?? -1;
        }
    }
    
}