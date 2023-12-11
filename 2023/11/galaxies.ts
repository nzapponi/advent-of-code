import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

function getEmpty(rowsOrCols: string[][]) {
  const indices = rowsOrCols
    .map((row, i) => (row.every((item) => item === ".") ? i : -1))
    .filter((v) => v !== -1);
  return indices;
}

function transpose(array: string[][]) {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

function distanceBetweenTwoPointsWithExpansion(a: [number, number], b: [number, number], emptyRows: number[], emptyCols: number[], expansionSize: number) {
  const expandingCols = emptyCols.filter((c) => c > Math.min(a[0], b[0]) && c < Math.max(a[0], b[0]));
  const expandingRows = emptyRows.filter((r) => r > Math.min(a[1], b[1]) && r < Math.max(a[1], b[1]));
  return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + (expandingRows.length + expandingCols.length) * expansionSize;
  // return ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5;
}

const expansionSize = 999999;

const items = input.map((row) => row.split(""));

const emptyRows = getEmpty(items);
const emptyCols = getEmpty(transpose(items));

const galaxies: [number, number][] = [];
for (let r = 0; r < items.length; r++) {
  const row = items[r];
  for (let c = 0; c < row.length; c++) {
    const item = row[c];
    if (item === "#") {
      galaxies.push([c, r]);
    }
  }
}
const galaxyPairs = galaxies.flatMap((galaxy, i) =>
  galaxies.slice(i + 1).map((galaxy2) => [galaxy, galaxy2])
);

const galaxyDistances = [...galaxyPairs]
  .map((pair) => distanceBetweenTwoPointsWithExpansion(pair[0], pair[1], emptyRows, emptyCols, expansionSize));

console.log(galaxyDistances.reduce((tot, d) => tot + d));