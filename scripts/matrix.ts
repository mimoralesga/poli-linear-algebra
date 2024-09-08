import { Input } from "../src/lib/input";
import { MatrixAction } from "../src/types/matrix";
import { Memory } from "../src/lib/memory";
import { Matrix } from "../src/lib/matrix";

class MatrixCLI {
    static async main(): Promise<void> {
        let exit = false;
        const memory: Memory = new Memory();

        while (!exit) {
            const action = await Input.list(
                "action",
                "What do you want to do?",
                Object.values(MatrixAction),
            );

            if (action === MatrixAction.EXIT) {
                exit = true;
                continue;
            }

            const a = await Input.matrix(
                "a",
                memory,
            );
            let b: Matrix = new Matrix([[]]);

            if (
                action !== MatrixAction.DETERMINANT &&
                action !== MatrixAction.INVERSE
            ) {
                b = await Input.matrix(
                    "b",
                    memory,
                );
            }

            switch (action) {
                case MatrixAction.ADD:
                    console.log(a.add(b).toArray());
                    break;
                case MatrixAction.MULTIPLY:
                    console.log(a.multiplyByMatrix(b).toArray());
                    break;
                case MatrixAction.DETERMINANT:
                    console.log(Matrix.determinant(a));
                    break;
                case MatrixAction.INVERSE:
                    console.log(Matrix.inverse(a).toArray());
                    break;
                case MatrixAction.FIND_MATRIX_WITH_DETERMINANT_1:
                    Matrix.findMatrixWithDeterminant1(1);
                    break;
            }
        }
    }
}

MatrixCLI.main();
