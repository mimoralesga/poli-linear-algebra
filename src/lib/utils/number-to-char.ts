export const numberToChar = (num: number): string =>
    num === 26 ? "_" : String.fromCharCode((num % 26) + 65);
