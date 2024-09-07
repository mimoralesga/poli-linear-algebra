import { modInverse } from "./utils/mod-inverse";
import { Vector } from "./vector";

export class Matrix {
    private data: number[][];
    public rows: number;
    public cols: number;

    constructor(matrix: number[][]) {
        this.data = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;
    }

    add(matrix: Matrix): Matrix {
        return new Matrix(
            this.data.map((row, i) =>
                row.map((value, j) => value + matrix.data[i][j])
            ),
        );
    }

    multiplyByMatrix(matrix: Matrix): Matrix {
        return new Matrix(
            this.data.map((row) =>
                matrix.data[0].map((_, j) =>
                    row.reduce(
                        (acc, value, k) => acc + value * matrix.data[k][j],
                        0,
                    )
                )
            ),
        );
    }

    multiplyByVector(vector: Vector): Vector {
        return new Vector(
            this.data.map((row) =>
                row.reduce(
                    (acc, value, k) => acc + value * vector.data[k] % 26,
                    0,
                )
            ),
        );
    }

    static inverse(matrix: Matrix): Matrix {
        const det = Matrix.determinant(matrix);
        if (det === 0) {
            throw new Error(
                "The matrix is not invertible (the determinant is 0).",
            );
        }

        const adj = Matrix.adjugate(matrix);
        const transposedAdj = Matrix.transpose(adj);

        return transposedAdj;
    }

    static determinant(matrix: Matrix): number {
        const data = matrix.toArray();
        if (matrix.rows === 1) return data[0][0];

        if (matrix.rows === 2) {
            return data[0][0] * data[1][1] - data[0][1] * data[1][0];
        }

        // Aplicar el desarrollo de cofactores para matrices mayores
        return data[0].reduce((det, val, j) => {
            const subMatrix = Matrix.cofactor(matrix, 0, j);
            return det +
                val * Matrix.determinant(subMatrix) * (j % 2 === 0 ? 1 : -1);
        }, 0);
    }

    static cofactor(matrix: Matrix, row: number, col: number): Matrix {
        return new Matrix(
            matrix
                .toArray()
                .filter((_, i) => i !== row)
                .map((row) => row.filter((_, j) => j !== col)),
        );
    }

    static minor(matrix: Matrix): number {
        /* return matrix.toArray().reduce(
            (acc, row, i) =>
                acc +
                row.reduce(
                    (acc, value, j) => acc + value * Matrix.cofactor(i, j),
                    0,
                ),
            0,
        ); */
        return 0;
    }

    static adjugate(matrix: Matrix): Matrix {
        return new Matrix(
            matrix
                .toArray()
                .map((row, i) =>
                    row.map((_, j) => {
                        const minor = Matrix.determinant(
                            Matrix.cofactor(matrix, i, j),
                        );

                        return (i + j) % 2 === 0 ? minor : -minor;
                    })
                ),
        );
    }

    static transpose(matrix: Matrix): Matrix {
        return new Matrix(
            matrix.toArray()[0].map((_, i) =>
                matrix.toArray().map((row) => row[i])
            ),
        );
    }

    static modInverseMatrix(matrix: Matrix, mod: number): Matrix {
        const det = Matrix.determinant(matrix);
        const detMod = ((det % mod) + mod) % mod;
        if (detMod === 0) {
            throw new Error("La matriz no es invertible (determinante es 0).");
        }

        const invDet = modInverse(detMod, mod);

        const adj = Matrix.adjugate(matrix);
        const transposed = Matrix.transpose(adj);

        const inverse = transposed.toArray().map((row) =>
            row.map((value) => (invDet * value + mod) % mod)
        );
        return new Matrix(inverse);
    }

    toArray(): number[][] {
        return this.data;
    }
}
