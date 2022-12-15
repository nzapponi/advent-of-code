const { readFileSync } = require("fs");

const checkPairOrder = (pair) => {
  const left = pair[0];
  const right = pair[1];

  const maxLength = Math.max(left.length, right.length);

  // console.log(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);

  for (let i = 0; i < maxLength; i++) {
    // console.log(`- Compare ${JSON.stringify(left[i])} vs ${JSON.stringify(right[i])}`);

    if (left[i] === undefined) {
      // console.log("  - Left side ran out of items, right order");
      return true;
    }
    if (right[i] === undefined) {
      // console.log("  - Right side ran out of items, wrong order");
      return false;
    }

    if (typeof left[i] === "number" && typeof right[i] === "number") {
      if (left[i] < right[i]) {
        // console.log("  - Left side is smaller, right order");
        return true;
      }
      if (left[i] > right[i]) {
        // console.log("  - Right side is smaller, wrong order");
        return false;
      }
    } else if (typeof left[i] === "object" && typeof right[i] === "object") {
      const pairCheck = checkPairOrder([left[i], right[i]]);
      if (pairCheck !== null) {
        return pairCheck;
      }
    } else {
      // console.log("  - Mixed types; convert and retry comparison");
      const correctLeft = typeof left[i] === "object" ? left[i] : [left[i]];
      const correctRight = typeof right[i] === "object" ? right[i] : [right[i]];
      const pairCheck = checkPairOrder([correctLeft, correctRight]);
      if (pairCheck !== null) {
        return pairCheck;
      }
    }
  }

  return null;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const signalPairs = input.split("\n\n").map((pairs) => pairs.split("\n").map((signal) => JSON.parse(signal)));
  const correctOrders = signalPairs.map((pair) => checkPairOrder(pair));
  const sumIndices = correctOrders.reduce((prev, correct, index) => correct ? prev + index + 1 : prev, 0);
  console.log(`Part 1: ${sumIndices}`);

  const allSignals = signalPairs.flat();
  const sortedSignals = [...allSignals].sort((a, b) => checkPairOrder([a, b]) ? -1 : 1);
  const startSignalIndex = sortedSignals.findIndex((signal) => typeof signal === "object" && signal.length > 0 && typeof signal[0] === "object" && signal[0].length > 0 && signal[0][0] === 2);
  const endSignalIndex = sortedSignals.findIndex((signal) => typeof signal === "object" && signal.length > 0 && typeof signal[0] === "object" && signal[0].length > 0 && signal[0][0] === 6);
  console.log(`Part 2: ${(startSignalIndex + 1) * (endSignalIndex + 1)}`);
};

main();