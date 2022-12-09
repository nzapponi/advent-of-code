const { readFileSync } = require("fs");

const calculateNewKnotPosition = (head, tail) => {
  const xDistance = head[0] - tail[0];
  const yDistance = head[1] - tail[1];

  let xMove = 0;
  let yMove = 0;

  if (xDistance !== 0 && yDistance !== 0) {
    // Diagonal moves
    if (xDistance < -1 || xDistance > 1 || yDistance < -1 || yDistance > 1) {
      xMove = xDistance < 0 ? -1 : 1;
      yMove = yDistance < 0 ? -1 : 1;
    }
  } else {
    // Lateral moves
    if (yDistance < -1) {
      yMove = -1;
    }
    if (yDistance > 1) {
      yMove = 1;
    }

    if (xDistance < -1) {
      xMove = -1;
    }
    if (xDistance > 1) {
      xMove = 1;
    }
  }

  return [tail[0] + xMove, tail[1] + yMove];
};

const calculateMoves = (moves, knots) => {
  // Position: [x, y]
  const tailPositions = [[0, 0]];
  const ropePositions = new Array(knots).fill([0, 0]);

  for (const move of moves) {
    for (let i = 0; i < move.steps; i++) {
      let newHeadPosition;
      switch (move.dir) {
        case "R":
          newHeadPosition = [ropePositions[0][0] + 1, ropePositions[0][1]];
          break;
        case "L":
          newHeadPosition = [ropePositions[0][0] - 1, ropePositions[0][1]];
          break;
        case "D":
          newHeadPosition = [ropePositions[0][0], ropePositions[0][1] - 1];
          break;
        case "U":
          newHeadPosition = [ropePositions[0][0], ropePositions[0][1] + 1];
          break;
      }
      ropePositions[0] = newHeadPosition;
      for (let knot = 0; knot < knots - 1; knot++) {
        const nextKnotPosition = calculateNewKnotPosition(ropePositions[knot], ropePositions[knot + 1]);
        ropePositions[knot + 1] = nextKnotPosition;
      }
      tailPositions.push(ropePositions[knots - 1]);
    }
  }

  return tailPositions;
};

const getUniquePositions = (positions) => {
  return positions
  .map((pos) => pos.join(","))
  .filter((value, index, self) => self.indexOf(value) === index);
}

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const moves = input.split("\n").map((instruction) => {
    const data = instruction.split(" ");
    return {
      dir: data[0],
      steps: parseInt(data[1]),
    };
  });

  // Part 1
  const twoKnotPositions = calculateMoves(moves, 2);
  // Filter unique positions out
  const uniqueTwoKnotPositions = getUniquePositions(twoKnotPositions);
  console.log(`Part 1: ${uniqueTwoKnotPositions.length}`);

  // Part 2
  const tenKnotPositions = calculateMoves(moves, 10);
  // Filter unique positions out
  const uniqueTenKnotPositions = getUniquePositions(tenKnotPositions);
  console.log(`Part 2: ${uniqueTenKnotPositions.length}`);
};

main();
