export const numberToChar = (num: number): string =>
    num === 26 ? "-" : String.fromCharCode((num % 26) + 65);
