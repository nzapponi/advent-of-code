const { readFileSync } = require("fs");

const ELEVATIONS = "abcdefghijklmnopqrstuvwxyz";
const START_POINT = "S";
const END_POINT = "E";

const calculateValidMoves = (grid, coords, endCoords, pastSteps) => {
  if (calculateDistance(coords, endCoords) === 0) {
    return [];
  }

  const up = grid.find(
    (point) =>
      point.x === coords.x &&
      point.y === coords.y - 1 &&
      point.elevation - coords.elevation <= 1
  );
  const down = grid.find(
    (point) =>
      point.x === coords.x &&
      point.y === coords.y + 1 &&
      point.elevation - coords.elevation <= 1
  );
  const left = grid.find(
    (point) =>
      point.x === coords.x - 1 &&
      point.y === coords.y &&
      point.elevation - coords.elevation <= 1
  );
  const right = grid.find(
    (point) =>
      point.x === coords.x + 1 &&
      point.y === coords.y &&
      point.elevation - coords.elevation <= 1
  );

  const valid = [up, down, left, right].filter(
    (coord) =>
      coord !== undefined &&
      !pastSteps.some((c) => c.x === coord.x && c.y === coord.y)
  );

  return valid;
};

const calculateDistance = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const stepsToEnd = (grid, coord, endCoords) => {

  let currentPositions = [coord];
  const pastSteps = [];
  let minDistance = calculateDistance(coord, endCoords);

  let numMoves = 0;
  while (minDistance > 0) {
    numMoves++;
    const newPositions = [];
    for (const position of currentPositions) {
      const validMoves = calculateValidMoves(grid, position, endCoords, pastSteps);
      for (const move of validMoves) {
        newPositions.push(move);
        pastSteps.push(move);
        minDistance = calculateDistance(move, endCoords);
        if (minDistance === 0) {
          break;
        }
      }

      if (minDistance === 0) {
        break;
      }
    }
    if (newPositions.length === 0) {
      return 9999999;
    }
    currentPositions = newPositions;
  }

  return numMoves;
};

const getMinSteps = (path) => {
  if (path.end) {
    return 1;
  }
  return 1 + Math.min(...path.paths.map(getMinSteps));
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const grid = input
    .split("\n")
    .map((row, rowIdx) =>
      row.split("").map((letter, colIdx) => ({
        x: colIdx,
        y: rowIdx,
        elevation:
          letter === START_POINT
            ? 0
            : letter === END_POINT
            ? 25
            : ELEVATIONS.indexOf(letter),
        start: letter === START_POINT,
        end: letter === END_POINT,
      }))
    )
    .flat();

  const startCoords = grid.find((point) => point.start === true);
  const endCoords = grid.find((point) => point.end === true);

  const steps = stepsToEnd(grid, startCoords, endCoords);
  console.log(`Part 1: ${steps}`);

  const potentialStartCoords = grid.filter((point) => point.elevation === 0);
  const stepsPerStartCoord = potentialStartCoords.map((startCoord) => stepsToEnd(grid, startCoord, endCoords));
  console.log(`Part 2: ${Math.min(...stepsPerStartCoord)}`);
};

main();
