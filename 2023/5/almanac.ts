import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

const seeds = [...input[0].matchAll(/([0-9]+)/g)].map((match) => +match[1]);

const mappings: {
  from: string;
  to: string;
  ranges: {
    from: number;
    to: number;
    offset: number;
  }[];
}[] = input
  .slice(2)
  .join("\n")
  .split("\n\n")
  .map((mapping) => {
    const m = mapping.split("\n");
    const header = m[0].match(/^(?<from>[a-z]+)-to-(?<to>[a-z]+) map:$/);
    const from = header?.groups?.from ?? "";
    const to = header?.groups?.to ?? "";
    const ranges = m.slice(1).map((r) => {
      const values = r.split(" ").map((v) => +v);
      return {
        from: values[1],
        to: values[1] + values[2] - 1,
        offset: values[0] - values[1],
      };
    });

    return {
      from,
      to,
      ranges,
    };
  });

function convert(from: string, to: string, value: number) {
  const mapping = mappings.find((m) => m.from === from && m.to === to);
  if (!mapping) {
    throw new Error("Mapping not found");
  }

  const range = mapping.ranges.find((range) => range.from <= value && range.to >= value);
  if (range) {
    return value + range.offset;
  }

  return value;
}

const finalType = "location";

function findSeedLocation(seed: number) {
  let currentType = "seed";
  let currentValue = seed;
  while (currentType !== finalType) {
    const nextConversion = mappings.find((m) => m.from === currentType);
    if (!nextConversion) {
      throw new Error("Could not convert any further");
    }
    currentType = nextConversion.to;
    currentValue = convert(nextConversion.from, nextConversion.to, currentValue);
  }
  return currentValue;
}

const locations = seeds.map(findSeedLocation);

const nearestLocation = Math.min(...locations);
console.log(nearestLocation);

let nearestLocationTwo;
for (let i = 0; i < seeds.length; i += 2) {
  const start = seeds[i];
  const length = seeds[i+1];

  for (let j = start; j < start + length; j++) {
    const location = findSeedLocation(j);
    if (!nearestLocationTwo || location < nearestLocationTwo) {
      nearestLocationTwo = location;
    }
  }
}

console.log(nearestLocationTwo);