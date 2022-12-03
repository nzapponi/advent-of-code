const { readFileSync } = require("fs");

const PRIORITY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getMatchingTypes = (rucksackContents) => {
  const numItemsPerPack = rucksackContents.length / 2;
  const firstHalf = rucksackContents.slice(0, numItemsPerPack).split("");
  const secondHalf = rucksackContents.slice(numItemsPerPack).split("");

  const matches = firstHalf.filter((item) => secondHalf.includes(item));
  const uniqueMatches = [];
  for (const match of matches) {
    if (!uniqueMatches.includes(match)) {
      uniqueMatches.push(match);
    }
  }
  return uniqueMatches;
};

const getPriorityForType = (type) => {
  return PRIORITY.indexOf(type) + 1;
};

const getBadgeForGroup = (rucksacks) => {
  const firstRucksack = rucksacks[0];
  for (const item of firstRucksack) {
    if (rucksacks[1].includes(item) && rucksacks[2].includes(item)) {
      return item;
    }
  }

  return null;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const rucksacks = input.split("\n");
  const matches = rucksacks.flatMap((rucksack) => getMatchingTypes(rucksack));
  const prioritySum = matches.reduce((prev, match) => prev + getPriorityForType(match), 0);
  console.log(`Part 1: ${prioritySum}`);

  let badgePrioritySum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const rucksackGroup = rucksacks.slice(i, i + 3);
    const badge = getBadgeForGroup(rucksackGroup);
    badgePrioritySum += getPriorityForType(badge);
  }
  console.log(`Part 2: ${badgePrioritySum}`);
};

main();