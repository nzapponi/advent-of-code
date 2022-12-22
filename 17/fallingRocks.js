const { readFileSync } = require("fs");

const getRock = (n, highestPoint) => {
  const rockNumber = n % 5;
  const leftMargin = 2;
  const bottomMargin = 3 + 1;

  switch (rockNumber) {
    case 0:
      // ####
      return [
        [leftMargin, highestPoint + bottomMargin],
        [leftMargin + 1, highestPoint + bottomMargin],
        [leftMargin + 2, highestPoint + bottomMargin],
        [leftMargin + 3, highestPoint + bottomMargin],
      ];
      break;

    case 1:
      // .#.
      // ###
      // .#.
      return [
        [leftMargin + 1, highestPoint + bottomMargin],
        [leftMargin, highestPoint + bottomMargin + 1],
        [leftMargin + 1, highestPoint + bottomMargin + 1],
        [leftMargin + 2, highestPoint + bottomMargin + 1],
        [leftMargin + 1, highestPoint + bottomMargin + 2],
      ];
      break;

    case 2:
      // ..#
      // ..#
      // ###
      return [
        [leftMargin, highestPoint + bottomMargin],
        [leftMargin + 1, highestPoint + bottomMargin],
        [leftMargin + 2, highestPoint + bottomMargin],
        [leftMargin + 2, highestPoint + bottomMargin + 1],
        [leftMargin + 2, highestPoint + bottomMargin + 2],
      ];
      break;

    case 3:
      // #
      // #
      // #
      // #
      return [
        [leftMargin, highestPoint + bottomMargin],
        [leftMargin, highestPoint + bottomMargin + 1],
        [leftMargin, highestPoint + bottomMargin + 2],
        [leftMargin, highestPoint + bottomMargin + 3],
      ];
      break;

    case 4:
      // ##
      // ##
      return [
        [leftMargin, highestPoint + bottomMargin],
        [leftMargin + 1, highestPoint + bottomMargin],
        [leftMargin, highestPoint + bottomMargin + 1],
        [leftMargin + 1, highestPoint + bottomMargin + 1],
      ];
      break;
  }
};

let lastGasIndex = -1;
const getGasDirection = (input) => {
  lastGasIndex++;
  lastGasIndex = lastGasIndex % input.length;
  return input.slice(lastGasIndex, lastGasIndex + 1) === ">" ? "right" : "left";
};

const moveRock = (rock, direction, filledPoints, width) => {
  if (direction === "left") {
    const movedRock = rock.map((r) => [r[0] - 1, r[1]]);
    if (
      !movedRock.some(
        (p) =>
          p[0] < 0 ||
          filledPoints.some((fp) => fp[0] === p[0] && fp[1] === p[1])
      )
    ) {
      return movedRock;
    }
  }
  if (direction === "right") {
    const movedRock = rock.map((r) => [r[0] + 1, r[1]]);
    if (
      !movedRock.some(
        (p) =>
          p[0] > width - 1 ||
          filledPoints.some((fp) => fp[0] === p[0] && fp[1] === p[1])
      )
    ) {
      return movedRock;
    }
  }
  return rock;
};

const isRockTouching = (rock, filledPoints) => {
  return rock.some((rockPoint) =>
    filledPoints.some((p) => rockPoint[0] === p[0] && rockPoint[1] - p[1] === 1)
  );
};

const simulateRock = (n, filledPoints, maxY, gasDirection, width) => {
  let rock = getRock(n, maxY);
  let rest = false;
  while (!rest) {
    const dir = getGasDirection(gasDirection);
    rock = moveRock(rock, dir, filledPoints, width);
    if (isRockTouching(rock, filledPoints)) {
      rest = true;
    } else {
      rock = rock.map((r) => [r[0], r[1] - 1]);
    }
  }

  let newFilledPoints = [...filledPoints, ...rock];

  // clear useless points
  const highestPointsPerColumn = new Array(width)
    .fill(0)
    .map((_, x) =>
      Math.max(...newFilledPoints.filter((p) => p[0] === x).map((p) => p[1]))
    );
  const minimumHeight = Math.min(...highestPointsPerColumn) - 4;
  newFilledPoints = newFilledPoints.filter((p) => p[1] >= minimumHeight);

  return {
    filledPoints: newFilledPoints,
    maxY: Math.max(...rock.map((r) => r[1]), maxY),
  };
};

const simulateRocks = (count, width, gasDirection) => {
  let filledPoints = new Array(width).fill(0).map((_, index) => [index, 0]);
  let maxY = 0;
  console.log(`Simulating ${count} rocks...`);
  process.stdout.write("Starting...");
  for (let i = 0; i < count; i++) {
    process.stdout.write("\r\x1b[K");
    process.stdout.write(
      `${((i + 1) / count * 100).toString().padStart(3)}% (${i + 1})`
    );
    let result = simulateRock(i, filledPoints, maxY, gasDirection, width);
    filledPoints = result.filledPoints;
    maxY = result.maxY;
  }
  process.stdout.write("\n");
  console.log("Done");
  return { filledPoints, maxY };
};

const main = () => {
  const input = readFileSync("sample.txt", { encoding: "utf-8" }).trim();
  const chamberWidth = 7;
  let { filledPoints, maxY } = simulateRocks(2022, chamberWidth, input);
  // for (let y = maxY; y >= 0; y--) {
  //   process.stdout.write(y.toString().padStart(3) + " ");
  //   for (let x = 0; x < chamberWidth; x++) {
  //     const p = filledPoints.find((p) => p[0] === x && p[1] === y);
  //     process.stdout.write(p ? "#" : ".");
  //   }
  //   console.log("");
  // }
  console.log(`Part 1: ${maxY}`);
  let { newFilledPoints, newMaxY } = simulateRocks(
    1000000000000,
    chamberWidth,
    input
  );
  console.log(`Part 2: ${newMaxY}`);
};

main();
