import { loadTextFile, transpose } from "../../utils";

const input = await loadTextFile("input.txt");

const grid = input.map((row) => row.split(""));

function tilt(grid: string[][], direction: "N" | "S" | "E" | "W") {
  let newGrid = grid;
  switch (direction) {
    case "N":
      newGrid = transpose(newGrid);
      break;

    case "W":
      break;

    case "E":
      newGrid = newGrid.map((row) => row.reverse());
      break;

    case "S":
      newGrid = transpose(newGrid).map((row) => row.reverse());
      break;
  }

  const tiltedGrid = newGrid.map((list) => {
    let newList = [...list];
    let firstAvailable = 0;
    let currentPosition = 0;

    for (const item of newList) {
      switch (item) {
        case "O":
          if (currentPosition > firstAvailable) {
            newList[currentPosition] = ".";
            newList[firstAvailable] = "O";
          }
          firstAvailable++;
          break;
        case "#":
          firstAvailable = currentPosition + 1;
          break;
        default:
          break;
      }

      currentPosition++;
    }
    return newList;
  });

  switch (direction) {
    case "N":
      return transpose(tiltedGrid);
      break;

    case "W":
      return tiltedGrid;
      break;

    case "E":
      return tiltedGrid.map((row) => row.reverse());
      break;

    case "S":
      return transpose(tiltedGrid.map((row) => row.reverse()));
      break;
  }
}

function calculateWeight(grid: string[][]) {
  return transpose(grid).flatMap((column) =>
    column.map((item, idx) => (item === "O" ? column.length - idx : 0))
  );
}

function runCycle(grid: string[][]) {
  return tilt(tilt(tilt(tilt(grid, "N"), "W"), "S"), "E");
}

const tiltedGridWeights = calculateWeight(tilt(grid, "N"));
const total = tiltedGridWeights.reduce((tot, v) => tot + v);

console.log(total);

const numCycles = 1000000000;
let cycledGrid = grid;
let cycle = 0;
const pastGrids: string[] = [];
while (cycle < numCycles) {
  const newGrid = runCycle(cycledGrid);
  const formattedGrid = newGrid.map((r) => r.join("")).join("\n");
  const foundIndex = pastGrids.indexOf(formattedGrid);
  if (foundIndex > -1) {
    const adjustedIndex = foundIndex + ((numCycles - foundIndex) % (cycle - foundIndex)) - 1;
    // console.log(`Cycle ${cycle}, found match at ${foundIndex}, returning ${adjustedIndex}`);
    cycledGrid = pastGrids[adjustedIndex].split("\n").map((r) => r.split(""));
    break;
  } else {
    pastGrids.push(formattedGrid);
  }
  
  cycledGrid = newGrid;
  cycle++;
}

const cycledGridWeights = calculateWeight(cycledGrid);
const cycledTotal = cycledGridWeights.reduce((tot, v) => tot + v);

console.log(cycledTotal);
