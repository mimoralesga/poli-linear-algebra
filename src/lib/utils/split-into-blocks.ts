export const splitIntoBlocks = (text: string, size: number): string[] => {
    const paddedText = text.replaceAll(" ", "_").padEnd(
        Math.ceil(text.length / size) * size,
        "_",
    );

    const blocks: string[] = [];

    for (let i = 0; i < paddedText.length; i += size) {
        blocks.push(paddedText.slice(i, i + size));
    }

    return blocks;
};
