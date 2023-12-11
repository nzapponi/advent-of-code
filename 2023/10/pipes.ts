import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

const items = input.map((row) => row.split(""));
const grid: { [key: number]: string } = {};

const validConnections = [
  ["-", "L", "F"], // L
  ["|", "7", "F"], // U
  ["-", "7", "J"], // R
  ["|", "J", "L"], // D
];

const validDirections: { [key: string]: number[] } = {
  "-": [0, 2],
  "|": [1, 3],
  J: [0, 1],
  "7": [0, 3],
  F: [2, 3],
  L: [1, 2],
  S: [0, 1, 2, 3],
};

function coordsToKey(x: number, y: number, maxX: number) {
  return y * maxX + x;
}

function getConnectedNodes(
  node: [number, number],
  grid: { [key: number]: string },
  maxX: number,
  maxY: number
): [number, number][] {
  const currentNode = grid[coordsToKey(node[0], node[1], maxX)];

  const potentialNodes = [
    [node[0] - 1, node[1], 0], // L
    [node[0], node[1] - 1, 1], // U
    [node[0] + 1, node[1], 2], // R
    [node[0], node[1] + 1, 3], // D
  ];

  const nearbyNodes = validDirections[currentNode]
    .map((i) => potentialNodes[i])
    .filter(
      (coords) =>
        coords[0] >= 0 && coords[0] < maxX && coords[1] >= 0 && coords[1] < maxY
    )
    .map((coords) => {
      const item = grid[coordsToKey(coords[0], coords[1], maxX)];
      if (item === ".") {
        return null;
      }

      if (
        validConnections[coords[2]].includes(item)
      ) {
        return [coords[0], coords[1]];
      }
    })
    .filter((coords) => !!coords);

  return nearbyNodes as [number, number][];
}

let startingPoint: [number, number] | null = null;
const numRows = items[0].length;
const numCols = items.length;
for (let r = 0; r < items.length; r++) {
  const row = items[r];
  for (let c = 0; c < row.length; c++) {
    if (row[c] === "S") {
      startingPoint = [c, r];
    }
    grid[coordsToKey(c, r, numRows)] = row[c];
  }
}

if (!startingPoint) {
  throw new Error("No starting point");
}

const visitedNodes: number[] = [
  coordsToKey(startingPoint[0], startingPoint[1], numRows),
];
let steps = 0;
let currentNodes: [number, number][] = [startingPoint];

while (true) {
  // console.log(steps, currentNodes);
  steps++;
  const newNodes = currentNodes
    .flatMap((node) => getConnectedNodes(node, grid, numRows, numCols))
    .filter(
      (node) => !visitedNodes.includes(coordsToKey(node[0], node[1], numRows))
    );

  // console.log(newNodes);

  for (const newNode of newNodes) {
    if (visitedNodes.includes(coordsToKey(newNode[0], newNode[1], numRows))) {
      break;
    }
  }
  if (
    coordsToKey(newNodes[0][0], newNodes[0][1], numRows) ===
    coordsToKey(newNodes[1][0], newNodes[1][1], numRows)
  ) {
    break;
  }

  for (const newNode of newNodes) {
    visitedNodes.push(coordsToKey(newNode[0], newNode[1], numRows));
  }

  currentNodes = newNodes;
}
console.log(steps);
