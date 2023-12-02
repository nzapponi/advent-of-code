const { readFileSync } = require("fs");

const main = () => {
  const input = readFileSync("sample.txt", { encoding: "utf-8" });
  const cubes = input.split("\n").map((pos) => pos.split(",").map((coord) => +coord));
  console.log(cubes);
};

main();