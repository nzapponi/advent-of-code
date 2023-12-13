import { loadTextFile } from "../../utils";

type Reflection = {
  dir: "row" | "col";
  index: number;
};

const input = await loadTextFile("input.txt");

function transpose(array: string[][]) {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

function findReflection(pattern: string[], smudgeLocation?: [number, number]) {
  let reflection: Reflection | null = null;

  // Rows
  let visitedSmudgeRow = false;
  for (let r = 0; r < pattern.length - 1; r++) {
    let offset = 1;
    let mismatch = false;
    while (r - offset + 1 >= 0 && r + offset < pattern.length) {
      if (pattern[r - offset + 1] !== pattern[r + offset]) {
        mismatch = true;
        break;
      }
      if (
        smudgeLocation &&
        (r - offset + 1 === smudgeLocation[0] ||
          r + offset === smudgeLocation[0])
      ) {
        visitedSmudgeRow = true;
      }
      offset++;
    }

    if (
      !mismatch &&
      (!smudgeLocation || (smudgeLocation && visitedSmudgeRow))
    ) {
      reflection = {
        dir: "row",
        index: r + 1,
      };
      break;
    }
  }

  // Cols
  if (!reflection) {
    const transposedPattern = transpose(pattern.map((r) => r.split(""))).map(
      (r) => r.join("")
    );
    let visitedSmudgeCol = false;
    for (let r = 0; r < transposedPattern.length - 1; r++) {
      let offset = 1;
      let mismatch = false;
      while (r - offset + 1 >= 0 && r + offset < transposedPattern.length) {
        if (
          transposedPattern[r - offset + 1] !== transposedPattern[r + offset]
        ) {
          mismatch = true;
          break;
        }
        if (
          smudgeLocation &&
          (r - offset + 1 === smudgeLocation[1] ||
            r + offset === smudgeLocation[1])
        ) {
          visitedSmudgeCol = true;
        }
        offset++;
      }

      if (
        !mismatch &&
        (!smudgeLocation || (smudgeLocation && visitedSmudgeCol))
      ) {
        reflection = {
          dir: "col",
          index: r + 1,
        };
        break;
      }
    }
  }

  return reflection;
}

const patterns = input
  .join("\n")
  .split("\n\n")
  .map((i) => i.split("\n"));

const reflections = patterns.map((r) => findReflection(r));

const total = reflections.reduce(
  (tot, r) => tot + (!!r ? (r.dir === "col" ? r.index : r.index * 100) : 0),
  0
);
console.log(total);

const smudgedReflections = patterns.map((pattern) => {
  let reflection: Reflection | null = null;

  const rows = pattern.length;
  const cols = pattern[0].length;

  const patternItems = pattern.flatMap((r) => r.split(""));

  let smudgedItem = 0;
  while (!reflection && smudgedItem < patternItems.length) {
    const smudgeRow = Math.floor(smudgedItem / cols);
    const smudgeCol = smudgedItem - smudgeRow * cols;
    const newItems = [...patternItems];
    newItems[smudgedItem] = newItems[smudgedItem] === "." ? "#" : ".";
    const smudgedPattern = new Array(rows)
      .fill(0)
      .map((_, r) => newItems.slice(r * cols, r * cols + cols).join(""));
    reflection = findReflection(smudgedPattern, [smudgeRow, smudgeCol]);
    smudgedItem++;
  }

  return reflection;
});
const smudgedTotal = smudgedReflections.reduce(
  (tot, r) => tot + (!!r ? (r.dir === "col" ? r.index : r.index * 100) : 0),
  0
);
console.log(smudgedTotal);
