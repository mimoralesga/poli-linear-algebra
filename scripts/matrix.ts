import inquirer from "inquirer";
import { Matrix } from "../src/types/matrix";

enum MatrixAction {
    ADD = "Add",
    MULTIPLY = "Multiply",
    DETERMINANT = "Determinant",
    INVERSE = "Inverse",
    EXIT = "Exit",
}

const add = (...args: Matrix[]) => {
    const [a, b] = args;

    if (a.length !== b.length) {
        throw new Error("Matrices must have the same number of rows");
    }

    if (a[0].length !== b[0].length) {
        throw new Error("Matrices must have the same number of columns");
    }

    for (let row = 0; row < a.length; row++) {
        for (let col = 0; col < a[row].length; col++) {
            a[row][col] += b[row][col];
        }
    }

    return a;
};

const multiply = (...args: Matrix[]) => {
    const [a, b] = args;

    // Verificamos que las matrices sean compatibles para la multiplicación
    if (a[0].length !== b.length) {
        throw new Error(
            "The number of columns of the first matrix must be equal to the number of rows of the second matrix.",
        );
    }

    const result: Matrix = [];

    for (let row = 0; row < a.length; row++) {
        result.push([]);

        for (let col = 0; col < b[0].length; col++) {
            result[row][col] = 0;
        }
    }

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
            for (let k = 0; k < b.length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
};

const input = async (name: string, memory: Record<string, Matrix>) => {
    let useCache = false;
    const matrix: number[][] = [];

    if (Object.keys(memory).length > 0) {
        const { useCache: useCacheResponse } = await inquirer.prompt({
            name: "useCache",
            type: "confirm",
            message: "Do you want to use a matrix from memory?",
            default: false,
        });

        useCache = useCacheResponse;
    }

    if (useCache && Object.keys(memory).length > 0) {
        const { matrixKey } = await inquirer.prompt({
            name: "matrixKey",
            type: "list",
            message: `Select matrix ${name} from memory:`,
            choices: Object.keys(memory),
        });

        return memory[matrixKey];
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

    const key = generateRandomKey(memory);
    memory[key] = matrix;
    console.log(`${key} = `, matrix);

    return matrix;
};

const determinant = (a: Matrix, b: Matrix): number => {
    if (a.length === 1) return a[0][0];
    if (a.length === 2) {
        return a[0][0] * a[1][1] - a[0][1] * a[1][0];
    }

    return a[0].reduce((det, val, i) => {
        const subMatrix = a.slice(1).map((row) =>
            row.filter((_, j) => j !== i)
        );
        return det + val * determinant(subMatrix, b) * (i % 2 === 0 ? 1 : -1);
    }, 0);
};

// Función para calcular la cofactor de una matriz
const cofactor = (matrix: number[][], row: number, col: number): number[][] => {
    return matrix
        .filter((_, i) => i !== row)
        .map((row) => row.filter((_, j) => j !== col));
};

// Función para calcular la adjunta de una matriz
const adjugate = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    return matrix.map((row, i) =>
        row.map((_, j) => {
            const minor = determinant(cofactor(matrix, i, j), []);
            return (i + j) % 2 === 0 ? minor : -minor;
        })
    );
};

// Función para transponer una matriz
const transpose = (matrix: number[][]): number[][] =>
    matrix[0].map((_, i) => matrix.map((row) => row[i]));

// Función para calcular la inversa de una matriz
const inverseMatrix = (matrix: number[][]): number[][] => {
    const det = determinant(matrix, []);
    if (det === 0) {
        throw new Error("The matrix is not invertible (the determinant is 0).");
    }

    const adj = adjugate(matrix);
    const transposedAdj = transpose(adj); // Aplicar la transposición
    return transposedAdj.map((row) =>
        row.map((value) => parseFloat((value / det).toFixed(4)))
    );
};

const generateRandomKey = (memory: Record<string, Matrix>) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let key = "";
    for (let i = 0; i < letters.length; i++) {
        if (!Object.keys(memory).includes(letters[i])) {
            key = letters[i];
            break;
        }
    }
    return key || "No available letters";
};

const OPERATION_MAP = {
    [MatrixAction.ADD]: add,
    [MatrixAction.MULTIPLY]: multiply,
    [MatrixAction.DETERMINANT]: determinant,
    [MatrixAction.INVERSE]: inverseMatrix,
    [MatrixAction.EXIT]: null,
};

const main = async () => {
    let memory: Record<string, Matrix> = {};
    let exit = false;

    while (!exit) {
        try {
            const { action } = await inquirer.prompt({
                name: "action",
                type: "list",
                message: "What do you want to do?",
                choices: [
                    MatrixAction.ADD,
                    MatrixAction.MULTIPLY,
                    MatrixAction.DETERMINANT,
                    MatrixAction.INVERSE,
                    MatrixAction.EXIT,
                ],
            });

            const operation = OPERATION_MAP[action as MatrixAction];

            if (!operation) {
                exit = true;
                continue;
            }

            const a: Matrix = await input("a", memory);
            let b: Matrix = [];

            if (
                action !== MatrixAction.DETERMINANT &&
                action !== MatrixAction.INVERSE
            ) {
                b = await input("b", memory);
            }

            const result = operation(a, b);

            if (typeof result === "number") {
                console.log("Result:", result);
            } else {
                const key: string = generateRandomKey(memory);
                memory[key] = result;

                console.log("Result:");
                console.log(`${key} = `, result);
            }
        } catch (error) {
            console.error(
                error instanceof Error ? error.message : String(error),
            );
        }
    }
};

main();
