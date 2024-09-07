export class Memory {
    private memory: Record<string, number[][]> = {};

    constructor() {
        this.memory = {};
    }

    set(value: number[][]) {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let key = "";

        for (let i = 0; i < letters.length; i++) {
            if (!Object.keys(this.memory).includes(letters[i])) {
                key = letters[i];
                break;
            }
        }

        this.memory[key] = value;
    }

    get(key: string): number[][] {
        return this.memory[key];
    }

    length(): number {
        return Object.keys(this.memory).length;
    }
}
