const { readFileSync } = require("fs");

const getCalories = () => {
  const inputData = readFileSync("input.txt", { encoding: "utf-8"} );
  const caloriesList = inputData.split("\n");
  const caloriesPerElf = [];
  let currentElf = 0;
  for (const caloryValue of caloriesList) {
    if (caloryValue.trim().length === 0) {
      caloriesPerElf.push(currentElf);
      currentElf = 0;
    } else {
      currentElf += parseInt(caloryValue.trim());
    }
  }

  caloriesPerElf.push(currentElf);
  const maxCalories = Math.max(...caloriesPerElf);
  console.log(`Max calories: ${maxCalories}`);

  const topThree = [...caloriesPerElf].sort((a, b) => a - b).slice(-3);
  console.log(`Top 3 elves: ${topThree}`);

  const sumTopThree = topThree.reduce((prev, val) => prev + val);
  console.log(`Sum of top 3: ${sumTopThree}`);
};

getCalories();