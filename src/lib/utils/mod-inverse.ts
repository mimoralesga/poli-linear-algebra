export const modInverse = (a: number, m: number): number => {
    a = a % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }

    throw new Error("There is no modular inverse for this determinant.");
};
