/**
 * Returns a random number between min (inclusive) and max (exclusive).
 * 
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const equalCharactersLength = (original: string, copy: string) => {
    let idx = 0;

    for (let i = 0; i < copy.length; i++) {
        if (original[i] === copy[i]) {
            idx++;
            continue;
        } else {
            break;
        }
    }

    return idx;
};