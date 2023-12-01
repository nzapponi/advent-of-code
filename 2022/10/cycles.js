const { readFileSync } = require("fs");

const getCycleValues = (commands) => {
  const values = [1];
  let latestValue = 1;
  for (const command of commands) {
    if (command.startsWith("addx")) {
      const commandsParts = /addx ([0-9\-]+)/.exec(command);
      const amount = parseInt(commandsParts[1]);
      values.push(latestValue);
      latestValue += amount;
      values.push(latestValue);
    } else if (command.startsWith("noop")) {
      values.push(latestValue);
    }
  }
  return values;
};

const getSignalStrength = (values, cycle) => {
  return cycle * values[cycle - 1];
};

const getCRTpixels = (values) => {
  const crt = [];
  for (let i = 0; i < values.length; i++) {
    const delta = (i % 40) - values[i];
    if (delta <= 1 && delta >= -1) {
      crt.push("#");
    } else {
      crt.push(".");
    }
  }
  return crt;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const commands = input.split("\n");
  const values = getCycleValues(commands);

  const signalStrengths = [20, 60, 100, 140, 180, 220].map((cycle) => getSignalStrength(values, cycle));
  const signalStrengthSum = signalStrengths.reduce((prev, strength) => prev + strength);
  console.log(`Part 1: ${signalStrengthSum}`);
  console.log(values.length);
  
  const pixels = getCRTpixels(values);
  for (let row = 0; row < 6; row++) {
    const rowPixels = pixels.slice(row * 40, (row + 1) * 40);
    console.log(rowPixels.join(""));
  }
};

main();