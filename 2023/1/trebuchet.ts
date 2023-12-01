const inputFile = Bun.file("input.txt");
const input = await inputFile.text();

const numberMap: { [key: string]: string } = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const allNumbers = Object.keys(numberMap);

const lines = input.split("\n").map((line) => line.trim());
const digits = lines
  .map((line) => {
    const replacements = allNumbers
      .flatMap((n) =>
        [...line.matchAll(new RegExp(n, "gi"))].map((a) => ({
          value: a[0],
          index: a.index as number,
        }))
      )
      .sort((a, b) => a.index - b.index);

    let newLine = line;
    for (const replacement of replacements) {
      newLine = [
        newLine.slice(0, replacement.index),
        numberMap[replacement.value],
        newLine.slice(replacement.index + 1),
      ].join("");
    }
    return newLine;
  })
  .map((line) => line.replaceAll(/[^0-9]/g, ""));

const values = digits.map((d) => parseInt(d.slice(0, 1)[0] + d.slice(-1)[0]));
const result = values.reduce((total, v) => total + v, 0);

console.log(result);
