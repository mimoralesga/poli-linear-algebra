import { Input } from "../src/lib/input";
import { Matrix } from "../src/lib/matrix";
import { Memory } from "../src/lib/memory";
import { charToNumber } from "../src/lib/utils/char-to-number";
import { numberToChar } from "../src/lib/utils/number-to-char";
import { splitIntoBlocks } from "../src/lib/utils/split-into-blocks";
import { Vector } from "../src/lib/vector";
import { HillAction } from "../src/types/hill-action";

class HillMethodCLI {
    static async main(): Promise<void> {
        let exit = false;
        const memory = new Memory();

        while (!exit) {
            const action = await Input.list(
                "action",
                "What do you want to do?",
                Object.values(HillAction),
            );

            if (action === HillAction.EXIT) {
                exit = true;
                continue;
            }

            const text = await Input.text(
                "text",
                `Enter the text to ${action}:`,
            );

            const key = await Input.matrix(
                "key",
                memory,
            );

            switch (action) {
                case HillAction.ENCRYPT:
                    const encrypted = HillMethodCLI.encrypt(text, key);
                    console.log(encrypted);
                    break;
                case HillAction.DECRYPT:
                    const decrypted = HillMethodCLI.decrypt(text, key);
                    console.log(decrypted);
                    break;
            }
        }
    }

    static encrypt(text: string, key: Matrix): string {
        const blocks = splitIntoBlocks(text, key.rows);

        let result = "";

        blocks.forEach((block) => {
            const vector = new Vector(block.split("").map(charToNumber));

            const encrypted = key.multiplyByVector(vector);

            result += HillMethodCLI.parseToChars(encrypted.toArray());
        });

        return result;
    }

    static decrypt(text: string, key: Matrix): string {
        const inverse = Matrix.modInverseMatrix(key, 26);

        const blocks = splitIntoBlocks(text, inverse.rows);

        let result = "";

        blocks.forEach((block) => {
            const vector = new Vector(
                block.split("").map(charToNumber),
            );

            const encrypted = inverse.multiplyByVector(vector);

            result += HillMethodCLI.parseToChars(encrypted.toArray());
        });

        return result;
    }

    static parseToChars(numbers: number[]) {
        return numbers.map(numberToChar).join("").replaceAll("_", " ");
    }
}

HillMethodCLI.main();
