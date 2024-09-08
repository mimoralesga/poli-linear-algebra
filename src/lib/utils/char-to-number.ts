export const charToNumber = (char: string): number => {
    const upperChar = char.toUpperCase();
    if (upperChar === "_") {
        return 26;
    } else {
        const charCode = upperChar.charCodeAt(0);
        return charCode >= 65 && charCode <= 90
            ? charCode - 65
            : (charCode - 65) % 26 + 26;
    }
};
