const { readFileSync } = require("fs");

const isFullyContained = (pairOne, pairTwo) => {
  const [startOne, endOne] = pairOne.split("-").map((parts) => parseInt(parts));
  const [startTwo, endTwo] = pairTwo.split("-").map((parts) => parseInt(parts));

  if (startOne >= startTwo && endOne <= endTwo) {
    return true;
  }
  if (startTwo >= startOne && endTwo <= endOne) {
    return true;
  }

  return false;
};

const isOverlapping = (pairOne, pairTwo) => {
  const [startOne, endOne] = pairOne.split("-").map((parts) => parseInt(parts));
  const [startTwo, endTwo] = pairTwo.split("-").map((parts) => parseInt(parts));

  if (startOne >= startTwo && startOne <= endTwo) {
    return true;
  }
  if (endOne >= startTwo && endOne <= endTwo) {
    return true;
  }
  if (startTwo >= startOne && startTwo <= endOne) {
    return true;
  }
  if (endTwo >= startOne && endTwo <= endOne) {
    return true;
  }

  return false;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const pairs = input.split("\n");

  const fullyContainedPairs = pairs.filter((pair) => isFullyContained(...pair.split(",")));
  console.log(`Part 1: ${fullyContainedPairs.length}`);

  const overlappingPairs = pairs.filter((pair) => isOverlapping(...pair.split(",")));
  console.log(`Part 2: ${overlappingPairs.length}`);
};

main();