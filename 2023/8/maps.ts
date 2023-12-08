import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

const directions = input[0].split("") as ("L" | "R")[];
const nodeList = input.slice(2).map((line) => {
  const parts = line.split(" = ");
  const dirs = [...parts[1].matchAll(/([0-9A-Z]{3})/g)].map((m) => m[1]);
  return {
    node: parts[0],
    dirs,
  };
});
const nodes: {
  [node: string]: {
    L: string;
    R: string;
  };
} = {};

for (const node of nodeList) {
  nodes[node.node] = {
    L: node.dirs[0],
    R: node.dirs[1],
  };
}

// Part I

const startNode = "AAA";
const endNode = "ZZZ";

let steps = 0;
let currentNode = startNode;

while (currentNode !== endNode) {
  const direction = directions[steps % directions.length];
  currentNode = nodes[currentNode][direction];
  steps++;
}

console.log(steps);

// Part II

const startingNodes = Object.keys(nodes).filter((node) => node.endsWith("A"));

const minSteps = startingNodes.map((sn) => {
  let newSteps = 0;
  let currentNode = sn;
  
  while (!currentNode.endsWith("Z")) {
    const direction = directions[newSteps % directions.length];
    currentNode = nodes[currentNode][direction];
    newSteps++;
  }

  return newSteps;
});

const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number) => a * b / gcd(a, b);

const totalSteps = minSteps.reduce(lcm);

console.log(totalSteps);
