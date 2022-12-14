const { readFileSync } = require("fs");

const parseInput = (input) => {
  const monkeyData = input.split("\n\n");
  return monkeyData.map((data) => {
    const lines = data.split("\n").map((line) => line.trim());

    const id = parseInt(/Monkey ([0-9]+):/.exec(lines[0])[1]);
    const items = /Starting items: ([0-9,\s]+)/.exec(lines[1])[1].split(", ").map((item) => BigInt(item));
    const opData = /Operation: new = old ([\+\*]) (old|[0-9]+)/.exec(lines[2]);
    const testDivision = parseInt(/Test: divisible by ([0-9]+)/.exec(lines[3])[1]);
    const trueMonkey = parseInt(/If true: throw to monkey ([0-9]+)/.exec(lines[4])[1]);
    const falseMonkey = parseInt(/If false: throw to monkey ([0-9]+)/.exec(lines[5])[1]);

    return {
      id,
      items,
      operation: {
        op: opData[1],
        rhs: opData[2] === "old" ? "self" : BigInt(opData[2])
      },
      test: {
        division: testDivision,
        true: trueMonkey,
        false: falseMonkey,
      }
    };
  });
};

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

const mod = (num, a) => {
  let powersOf10Modn = 1;
  let answer = 0;
  const revNum = num.split("").reverse();
  for (let i = 0; i < revNum.length; i++) {
    answer = (answer + powersOf10Modn * parseInt(revNum[i])) % a;
    powersOf10Modn = (powersOf10Modn * 10) % a;
  }

  return answer;
};

const calculateRound = (monkeys, worryDivider, worryModulo = 1) => {
  const sortedMonkeys = [...monkeys].sort((a, b) => a.id - b.id);
  const evaluations = new Array(sortedMonkeys.length).fill(0);
  for (const monkey of sortedMonkeys) {
    while (monkey.items.length > 0) {
      const item = monkey.items.shift();
      let worryLevel = monkey.operation.op === "+" ? (monkey.operation.rhs === "self" ? item + item : item + monkey.operation.rhs) : (monkey.operation.op === "*" ? (monkey.operation.rhs === "self" ? item * item : item * monkey.operation.rhs) : 0);
      if (worryDivider !== 1) {
        worryLevel /= BigInt(worryDivider);
      }
      if (worryModulo !== 1) {
        worryLevel = worryLevel % BigInt(worryModulo);
      }
      let monkeyIndex = -1;
      if (mod(worryLevel.toString(), monkey.test.division) === 0) {
        monkeyIndex = sortedMonkeys.findIndex((m) => m.id === monkey.test.true);
      } else {
        monkeyIndex = sortedMonkeys.findIndex((m) => m.id === monkey.test.false);
      }
      sortedMonkeys[monkeyIndex].items.push(worryLevel);
      evaluations[monkey.id] += 1;
    }
  }

  return {
    monkeys: sortedMonkeys,
    evaluations
  };
};

const calculateMonkeysRounds = (monkeys, numRounds) => {
  let monkeyRounds = [...monkeys];
  const evaluations = new Array(monkeys.length).fill(0);
  for (let i = 0; i < numRounds; i++) {
    const { monkeys: newMonkeys, evaluations: newEvals } = calculateRound(monkeyRounds, 3);
    monkeyRounds = newMonkeys;
    for (const id in newEvals) {
      evaluations[id] += newEvals[id];
    }
  }

  return { monkeys: monkeyRounds, evaluations };
};

const calculateMonkeysRoundsWithModulo = (monkeys, numRounds, worryModulo) => {
  let monkeyRounds = [...monkeys];
  const evaluations = new Array(monkeys.length).fill(0);
  for (let i = 0; i < numRounds; i++) {
    const { monkeys: newMonkeys, evaluations: newEvals } = calculateRound(monkeyRounds, 1, worryModulo);
    monkeyRounds = newMonkeys;
    for (const id in newEvals) {
      evaluations[id] += newEvals[id];
    }
  }

  return { monkeys: monkeyRounds, evaluations };
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  let monkeys = parseInput(input);
  const { monkeys: newMonkeys, evaluations } = calculateMonkeysRounds(monkeys, 20);
  const topEvaluations = [...evaluations].sort((a, b) => b - a);
  console.log(`Part 1: ${topEvaluations[0] * topEvaluations[1]}`);

  monkeys = parseInput(input);
  const modulos = monkeys.map((monkey) => monkey.test.division);
  const modulo = modulos.reduce((prev, m) => prev > 0 ? lcm(prev, m) : m, 0);

  const { monkeys: newMonkeysTwo, evaluations: evaluationsTwo } = calculateMonkeysRoundsWithModulo(monkeys, 10000, modulo);
  const topEvaluationsTwo = [...evaluationsTwo].sort((a, b) => b - a);
  console.log(`Part 2: ${topEvaluationsTwo[0] * topEvaluationsTwo[1]}`);
};

main();
