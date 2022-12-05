const { readFileSync } = require("fs");

const readStacks = (crates) => {
    const rows = crates.split("\n");
    const numStacks = parseInt(rows.slice(-1)[0].trim().split("").slice(-1));
    const stacks = [];

    // Initialize empty stacks
    for (let stack = 0; stack < numStacks; stack++) {
        stacks.push([]);
    }

    for (const row of rows.slice(0, -1)) {
        for (let stack = 0; stack < numStacks; stack++) {
            const item = row[stack * 4 + 1];
            if (item !== " ") {
                stacks[stack].push(item);
            }
        }
    }

    return stacks;
};

const makeStackMove = (stacks, instruction) => {
    const instructionRegex = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;
    const instructionParts = instructionRegex.exec(instruction);
    const moveQuantity = parseInt(instructionParts[1]);
    const from = parseInt(instructionParts[2]);
    const to = parseInt(instructionParts[3]);

    // Part 1
    // const movingCrates = stacks[from - 1].splice(0, moveQuantity).reverse();

    // Part 2
    const movingCrates = stacks[from - 1].splice(0, moveQuantity);
    stacks[to - 1].unshift(...movingCrates);

    return stacks;
};

const main = () => {
    const input = readFileSync("input.txt", { encoding: "utf-8" });
    const [cratesInput, instructionsInput] = input.split("\n\n");
    let stacks = readStacks(cratesInput);

    console.log(stacks);

    const instructions = instructionsInput.split("\n");
    for (const instruction of instructions) {
        stacks = makeStackMove(stacks, instruction);
        // console.log(instruction);
        // console.log(stacks);
    }
    const topCrates = stacks.map((crates) => crates[0]).join("");
    console.log(topCrates);
};

main();