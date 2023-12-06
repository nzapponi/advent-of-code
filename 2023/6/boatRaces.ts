import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");
const times = [...input[0].matchAll(/([0-9]+)/g)].map((v) => +v[1]);
const distances = [...input[1].matchAll(/([0-9]+)/g)].map((v) => +v[1]);

// distance = velocity x time_unpressed
// velocity = time_pressed
// time_unpressed = time_total - time_pressed

// distance = time_pressed * (time_total - time_pressed)
// time_pressed * (time_total - time_pressed) > record
// time_pressed^2 - time_total*time_pressed + record < 0

// Quadratic formula
// ax2 + bx + c = 0
// x = ( -b ± sqrt(b2 - 4ac) ) / 2a

// time_pressed in between ( time_total ± sqrt(time_total^2 - 4 * record)) / 2

function calculateMinPress(time: number, distance: number): [number, number] {
  return [
    (time + (time ** 2 - 4 * distance) ** 0.5) / 2,
    (time - (time ** 2 - 4 * distance) ** 0.5) / 2,
  ];
}

function stepsBetweenNumbers(n1: number, n2: number) {
  const min = Math.floor(Math.min(n1, n2)) + 1;
  const max = Math.ceil(Math.max(n1, n2)) - 1;

  return new Array(max - min + 1).fill(0).map((_, i) => min + i);
}

const races = times.map((time, i) => ({ time, distance: distances[i] }));
const waysToBeatRecord = races.map(
  (race) =>
    stepsBetweenNumbers(...calculateMinPress(race.time, race.distance)).length
);

const total = waysToBeatRecord.reduce((tot, w) => tot * w, 1);
console.log(total);

const newTime = +input[0].replaceAll(/[^0-9]/g, "");
const newDistance = +input[1].replaceAll(/[^0-9]/g, "");

const waysToWin = stepsBetweenNumbers(
  ...calculateMinPress(newTime, newDistance)
).length;
console.log(waysToWin);
