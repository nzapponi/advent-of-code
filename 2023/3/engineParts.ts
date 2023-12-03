import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

type Part = {
  value: number;
  row: number;
  start: number;
  end: number;
};

type Symbol = {
  symbol: string;
  row: number;
  pos: number;
};

const parts: Part[] = [];
const symbols: Symbol[] = [];

function isAdjacent(part: Part, symbol: Symbol) {
  return (
    symbol.row >= part.row - 1 &&
    symbol.row <= part.row + 1 &&
    symbol.pos <= part.end + 1 &&
    symbol.pos >= part.start - 1
  );
}

const numberRegex = /([0-9]+)/g;
const symbolRegex = /([^0-9\.])/g;
for (let i = 0; i < input.length; i++) {
  const row = input[i];
  const matches = [...row.matchAll(numberRegex)].map((match) => ({
    value: +match[1],
    row: i,
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[1].length - 1,
  }));
  parts.push(...matches);

  const symbolMatches = [...row.matchAll(symbolRegex)].map((match) => ({
    symbol: match[1],
    row: i,
    pos: match.index ?? 0,
  }));
  symbols.push(...symbolMatches);
}

const actualParts = parts.filter((part) =>
  symbols.some((symbol) => isAdjacent(part, symbol))
);

const partsSum = actualParts.reduce((tot, part) => tot + part.value, 0);
console.log(partsSum);

const gears = symbols
  .filter((s) => s.symbol === "*")
  .map((gear) => ({
    ...gear,
    parts: parts.filter((part) => isAdjacent(part, gear)),
  }))
  .filter((gear) => gear.parts.length === 2);

const gearRatioSum = gears.reduce((tot, gear) => tot + (gear.parts[0].value * gear.parts[1].value), 0);

console.log(gearRatioSum);
