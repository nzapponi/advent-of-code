const { readFileSync } = require("fs");

const getValves = (input) => {
  const rows = input.split("\n");
  const regex =
    /Valve ([A-Z]+) has flow rate=([0-9]+); tunnels* leads* to valves* ([A-Z,\s]+)$/;
  const valves = {};
  for (const row of rows) {
    const rowData = regex.exec(row);
    valves[rowData[1]] = {
      rate: +rowData[2],
      to: rowData[3].split(", "),
    };
  }

  return valves;
};

const getPressureRelease = (moves, valves) => {
  const valvePressures = [];
  for (let i = 0; i < moves.length; i++) {
    const valveRate = valves[moves[i]].rate;
    if (i === 0) {
      valvePressures.push(valveRate);
    } else if (moves[i] === moves[i - 1]) {
      valvePressures.push(valveRate);
    } else {
      valvePressures.push(0);
    }
  }

  return valvePressures.reduce(
    (total, pressure, index) => total + pressure * (30 - index),
    0
  );
};

const findMaxPressure = (valves, startPosition, maxMoves) => {
  const openValves = [];
  const findPressure = (valves, currentPosition, moves) => {
    if (moves.length < maxMoves) {
      const valve = valves[currentPosition];
      let options;
      if (!openValves.includes(currentPosition)) {
        openValves.push(currentPosition);
        options = [
          findPressure(valves, currentPosition, [...moves, currentPosition]),
          ...valve.to.map((nextValve) =>
            findPressure(valves, nextValve, [...moves, nextValve])
          ),
        ];
      } else {
        options = valve.to.map((nextValve) =>
          findPressure(valves, nextValve, [...moves, nextValve])
        );
      }

      const pressures = options.map((moves) => ({
        moves,
        pressure: getPressureRelease(moves, valves),
      }));
      const maxPress = Math.max(...pressures.map((p) => p.pressure));
      return pressures.find((p) => p.pressure === maxPress).moves;
    } else {
      return moves;
    }
  };

  return findPressure(valves, startPosition, [startPosition]);
};

const main = () => {
  const input = readFileSync("sample.txt", { encoding: "utf-8" });
  const valves = getValves(input);
  const moves = findMaxPressure(valves, "AA", 30);
  console.log(moves, getPressureRelease(moves, valves));
  // console.log(getPressureRelease(["AA", "DD", "DD", "CC", "BB", "BB", "AA", "II", "JJ", "JJ", "II", "AA", "DD", "EE", "FF", "GG", "HH", "HH", "GG", "FF", "EE", "EE", "DD", "CC", "CC"], valves));
};

main();
