const { readFileSync } = require("fs");

const getStartOfPacket = (input, packetLength) => {
    let characters = [];
    for (let i = 0; i < input.length; i++) {
        if (characters.length < packetLength) {
            characters.push(input[i]);
        } else {
            characters.shift();
            characters.push(input[i]);

            const uniqueCharacters = [...new Set(characters)];
            if (uniqueCharacters.length === packetLength) {
                return i + 1;
            }
        }
    }
};

const main = () => {
    const input = readFileSync("input.txt", { encoding: "utf-8" });
    const startOne = getStartOfPacket(input, 4);
    console.log(`Part 1: ${startOne}`);
    const startTwo = getStartOfPacket(input, 14);
    console.log(`Part 2: ${startTwo}`);
};

main();