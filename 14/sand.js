const { readFileSync } = require("fs");

// point: { x: number; y: number; }

const calculateBoundaries = (rockPaths) => {
  const boundaries = [];
  for (const path of rockPaths) {
    const points = path.split(" -> ").map((point) => point.split(",").map((coordinate) => parseInt(coordinate)));
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i+1];
      const direction = start[0] === end[0] ? "y" : "x";
      const minPoint = direction === "y" ? Math.min(start[1], end[1]) : Math.min(start[0], end[0]);
      const maxPoint = direction === "y" ? Math.max(start[1], end[1]) : Math.max(start[0], end[0]);
      for (let p = minPoint; p <= maxPoint; p++) {
        const x = direction === "y" ? start[0] : p;
        const y = direction === "y" ? p : start[1];
        if (!boundaries.find((point) => point.x === x && point.y === y)) {
          boundaries.push({ x, y });
        }
      }
    }
  }
  return boundaries;
};

const isPositionRock = (boundaries, x, y) => {
  return boundaries.find((point) => point.x === x && point.y === y);
}

const getNextPosition = (boundaries, x, y) => {
  // return new position if there is one
  // return null if there isn't one

  // try down
  let newX = x;
  let newY = y + 1;
  if (!isPositionRock(boundaries, newX, newY)) {
    return { x: newX, y: newY };
  }

  // try diagonal left
  newX = x - 1;
  if (!isPositionRock(boundaries, newX, newY)) {
    return { x: newX, y: newY };
  }

  // try diagonal right
  newX = x + 1;
  if (!isPositionRock(boundaries, newX, newY)) {
    return { x: newX, y: newY };
  }

  return null;
};

const getSandPosition = (boundaries, startX, startY, minX, maxX, maxY) => {
  let newPosition = { x: startX, y: startY };
  let checkNextMove = true;
  while (checkNextMove) {
    const nextPosition = getNextPosition(boundaries, newPosition.x, newPosition.y);
    if (!nextPosition) {
      checkNextMove = false;
    } else if (nextPosition.x < minX || nextPosition.x > maxX || nextPosition.y > maxY) {
      // Sand is falling... return original position to signal we're done
      checkNextMove = false;
      newPosition = false;
    } else {
      newPosition = nextPosition;
    }
  }
  return newPosition;
};

const simulateFallingSand = (boundaries, startX, startY) => {
  const boundaryMinX = Math.min(...boundaries.map((point) => point.x));
  const boundaryMaxX = Math.max(...boundaries.map((point) => point.x));
  const boundaryMaxY = Math.max(...boundaries.map((point) => point.y));

  const filledBlocks = [...boundaries];
  let units = 0;
  let isFalling = true;
  while (isFalling) {
    const newUnit = getSandPosition(filledBlocks, startX, startY, boundaryMinX, boundaryMaxX, boundaryMaxY);
    if (newUnit === false) {
      isFalling = false;
    } else {
      units++;
      filledBlocks.push(newUnit);
      if (newUnit.x === startX && newUnit.y === startY) {
        isFalling = false;
      }
    }
  }
  return units;
}

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const rockPaths = input.split("\n");
  const boundaries = calculateBoundaries(rockPaths);
  const units = simulateFallingSand(boundaries, 500, 0);
  console.log(`Part 1: ${units}`);

  const floorWidth = (500 - Math.min(...boundaries.map((point) => point.x))) * 2 + 1000;
  const floorMinX = 500 - floorWidth / 2;
  const floorMaxX = 500 + floorWidth / 2;
  const floorY = Math.max(...boundaries.map((point) => point.y)) + 2;
  const boundariesWithFloor = calculateBoundaries([...rockPaths, `${floorMinX},${floorY} -> ${floorMaxX},${floorY}`]);
  const newUnits = simulateFallingSand(boundariesWithFloor, 500, 0);
  console.log(`Part 2: ${newUnits}`);
};

main();