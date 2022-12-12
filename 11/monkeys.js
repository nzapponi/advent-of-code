const { readFileSync } = require("fs");

const parseInput = (input) => {
  const monkeyData = input.split("\n\n");
  return monkeyData.map((data) => {
    const lines = data.split("\n").map((line) => line.trim());

    const id = parseInt(/Monkey ([0-9]+):/.exec(lines[0])[1]);
    const items = /Starting items: ([0-9,\s]+)/.exec(lines[1])[1].split(", ").map((item) => parseInt(item));
    const opData = /Operation: new = old ([\+\*]) (old|[0-9]+)/.exec(lines[2]);
    const testDivision = /Test: divisible by ([0-9]+)/.exec(lines[3])[1];
    const trueMonkey = parseInt(/If true: throw to monkey ([0-9]+)/.exec(lines[4])[1]);
    const falseMonkey = parseInt(/If false: throw to monkey ([0-9]+)/.exec(lines[5])[1]);

    return {
      id,
      items,
      operation: {
        op: opData[1],
        rhs: opData[2] === "old" ? "self" : parseInt(opData[2])
      },
      test: {
        division: testDivision,
        true: trueMonkey,
        false: falseMonkey,
      }
    };
  });
};

const main = () => {
  const input = readFileSync("sample.txt", { encoding: "utf-8" });
  const monkeys = parseInput(input);
  console.log(monkeys);
};

main();
