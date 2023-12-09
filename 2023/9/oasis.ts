import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

function getDeltas(list: number[]) {
  return list.slice(1).map((item, i) => item - list[i]);
}

function getExtrapolatedLastValue(history: number[]) {
  let deltas: number[][] = [history];
  while (deltas.slice(-1)[0].some((item) => item !== 0)) {
    deltas.push(getDeltas(deltas.slice(-1)[0]));
  }
  let n = 0;
  while (deltas.length > 0) {
    const d = deltas.pop() as number[];
    n += d.slice(-1)[0];
  }
  return n;
}

function getExtrapolatedFirstValue(history: number[]) {
  let deltas: number[][] = [history];
  while (deltas.slice(-1)[0].some((item) => item !== 0)) {
    deltas.push(getDeltas(deltas.slice(-1)[0]));
  }
  let n = 0;
  while (deltas.length > 0) {
    const d = deltas.pop() as number[];
    n = d.slice(0, 1)[0] - n;
  }
  return n;
}

const data = input.map((line) => line.split(" ").map((n) => +n));
const newLastValues = data.map(getExtrapolatedLastValue);

const lastTotal = newLastValues.reduce((tot, v) => tot + v);
console.log(lastTotal);


const newFirstValues = data.map(getExtrapolatedFirstValue);

const firstTotal = newFirstValues.reduce((tot, v) => tot + v);
console.log(firstTotal);

