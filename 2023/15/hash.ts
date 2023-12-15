import { loadTextFile } from "../../utils";

type Lens = {
  label: string;
  focalLength: number;
};

const input = await loadTextFile("input.txt");

function hash(input: string) {
  return input
    .split("")
    .map((item) => item.charCodeAt(0))
    .reduce((tot, ascii) => ((tot + ascii) * 17) % 256, 0);
}

const items = input[0].split(",");
const hashedItems = items.map(hash);
const total = hashedItems.reduce((tot, v) => tot + v);

console.log(total);

const boxes: Lens[][] = new Array(256).fill(0).map((_) => []);
for (const item of items) {
  const data = item.match(/^([a-z]+)([=-])([0-9]+)?$/);
  if (!data) {
    continue;
  }
  const label = data[1];
  const op = data[2];
  const focalLength = +data[3];
  const boxNumber = hash(label);

  if (op === "-") {
    boxes[boxNumber] = boxes[boxNumber].filter((lens) => lens.label !== label);
  } else if (op === "=") {
    const index = boxes[boxNumber].findIndex((lens) => lens.label === label);
    if (index > -1) {
      boxes[boxNumber][index] = {
        label,
        focalLength,
      };
    } else {
      boxes[boxNumber].push({
        label,
        focalLength,
      });
    }
  }
}

const allLenses = boxes.flatMap((box, b) =>
  box.map((lens, i) => ({ ...lens, slot: i, box: b }))
);

const lensTotal = allLenses.reduce(
  (tot, lens) => tot + (1 + lens.box) * (1 + lens.slot) * lens.focalLength,
  0
);
console.log(lensTotal);
