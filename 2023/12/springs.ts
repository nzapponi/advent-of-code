import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

function getAllArrangements(input: string[]) {
  const arrangements = [];
  const damageIndexes = input
    .map((item, idx) => ({ item, idx }))
    .filter((v) => v.item === "?")
    .map((v) => v.idx);
  const numDamages = damageIndexes.length;
  const numCombinations = 2 ** numDamages;

  for (let i = 0; i < numCombinations; i++) {
    const arrangement = [...input];
    for (let j = 0; j < numDamages; j++) {
      arrangement[damageIndexes[j]] = (i >> j) % 2 === 0 ? "." : "#";
    }
    arrangements.push(arrangement);
  }

  return arrangements;
}

function getArrangementSections(input: string[]) {
  const sections = [...input.join("").matchAll(/(#+)/g)].map((i) => i[1]);
  return sections.map((sec) => sec.length);
}

function isArrangementValid(input: string[], test: number[]) {
  const sections = getArrangementSections(input);

  if (sections.length !== test.length) return false;

  for (let i = 0; i < sections.length; i++) {
    if (sections[i] !== test[i]) return false;
  }
  return true;
}

const validArrangements = input.map((line) => {
  const [input, testString] = line.split(" ");
  const test = testString.split(",").map((a) => +a);
  return getAllArrangements(input.split("")).filter((arr) => isArrangementValid(arr, test)).length;
});

const totalValidArrangements = validArrangements.reduce((tot, a) => tot + a);
console.log(totalValidArrangements);

const largerArrangements = input.map((line) => {
  const [input, testString] = line.split(" ");
  const largerInput = [input, input, input, input, input].join("?");
  const largerTestString = [testString, testString, testString, testString, testString].join(",");
  const test = largerTestString.split(",").map((a) => +a);
  return getAllArrangements(largerInput.split("")).filter((arr) => isArrangementValid(arr, test)).length;
});

const totalLargerArrangements = largerArrangements.reduce((tot, a) => tot + a);
console.log(totalLargerArrangements);