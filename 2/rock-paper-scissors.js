const { readFileSync } = require("fs");

const CHOICE_VALUE = {
  X: 1,
  Y: 2,
  Z: 3,
};

const OUTCOME_VALUE = {
  win: 6,
  draw: 3,
  lose: 0,
};

const RESULTS_MAP = {
  A: {
    X: "draw",
    Y: "win",
    Z: "lose",
  },
  B: {
    X: "lose",
    Y: "draw",
    Z: "win",
  },
  C: {
    X: "win",
    Y: "lose",
    Z: "draw",
  },
};

const CHOICE_FOR_RESULT = {
  A: {
    X: "Z",
    Y: "X",
    Z: "Y",
  },
  B: {
    X: "X",
    Y: "Y",
    Z: "Z",
  },
  C: {
    X: "Y",
    Y: "Z",
    Z: "X",
  },
}

const getOutcome = (opponent, choice) => {
  return RESULTS_MAP[opponent][choice];
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const rounds = input.split("\n").map((line) => line.split(" "));

  const score = rounds.reduce((prev, curr) => {
    const opponent = curr[0];

    // Part 1 of the challenge
    // const choice = curr[1];
    // Part 2 of the challenge
    const choice = CHOICE_FOR_RESULT[curr[0]][curr[1]];
    
    const outcome = getOutcome(opponent, choice);
    return prev + CHOICE_VALUE[choice] + OUTCOME_VALUE[outcome];
  }, 0);

  console.log(score);
};

main();
