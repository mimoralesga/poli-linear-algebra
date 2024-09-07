import inquirer from "inquirer";

import { Matrix } from "./matrix";
import { Memory } from "./memory";

export class Input {
    static async list(
        name: string,
        message: string,
        choices: string[],
    ): Promise<string> {
        const { [name]: action } = await inquirer.prompt({
            name,
            type: "list",
            message,
            choices,
        });

        return action;
    }

    static async text(name: string, message: string): Promise<string> {
        const { [name]: text } = await inquirer.prompt({
            name,
            type: "input",
            message,
        });

        return text;
    }

    static async matrix(
        name: string,
        memory: Memory,
    ): Promise<Matrix> {
        let useCache = false;
        let matrix: number[][] = [];

        if (memory.length() > 0) {
            const { useCache: useCacheResponse } = await inquirer.prompt({
                name: "useCache",
                type: "confirm",
                message: "Do you want to use a matrix from memory?",
                default: false,
            });

            useCache = useCacheResponse;
        }

        if (useCache && memory.length() > 0) {
            const { matrixKey } = await inquirer.prompt({
                name: "matrixKey",
                type: "list",
                message: `Select matrix ${name} from memory:`,
                choices: Object.keys(memory),
            });

            return new Matrix(memory.get(matrixKey));
        }

        const { rows } = await inquirer.prompt({
            name: "rows",
            type: "number",
            message: `How many rows does the ${name} matrix have?`,
        });

        for (let row = 0; row < rows; row++) {
            const { row: rowValues } = await inquirer.prompt({
                name: "row",
                type: "input",
                message: `Enter the values of the row ${
                    row + 1
                } (separated by commas):`,
            });

            matrix.push(rowValues.split(",").map(Number));
        }

        return new Matrix(matrix);
    }
}
