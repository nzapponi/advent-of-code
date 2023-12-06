import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");
const times = [...input[0].matchAll(/([0-9]+)/g)].map((v) => +v[1]);
const distances = [...input[1].matchAll(/([0-9]+)/g)].map((v) => +v[1]);

// d = v x tu
// v = tp
// tu = tt - tp
//
// d = tp * (tt - tp)
// tp * (tt - tp) > record
// tp^2 - tt*tp + record < 0
//

// ax2 + bx + c = 0
// x = ( -b ± sqrt(b2 - 4ac) ) / 2a

// tp = ( tt ± sqrt(tt2 - 4*record)) / 2

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

const waysToWin = stepsBetweenNumbers(...calculateMinPress(newTime, newDistance)).length;
console.log(waysToWin);
