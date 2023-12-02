import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");
const max = [12, 13, 14];

const games = input.map((line) => {
  const id = parseInt(line.split("Game ")[1].split(":")[0]);
  const sets = line
    .split(": ")[1]
    .split("; ")
    .map((set) => {
      const balls = set.split(", ");
      const rgb = [0, 0, 0];
      for (const ball of balls) {
        if (ball.includes("red")) {
          rgb[0] = parseInt(ball.split(" ")[0]);
        }
        if (ball.includes("green")) {
          rgb[1] = parseInt(ball.split(" ")[0]);
        }
        if (ball.includes("blue")) {
          rgb[2] = parseInt(ball.split(" ")[0]);
        }
      }
      return rgb;
    });
  return {
    id,
    sets,
  };
});

const possibleGames = games.filter((game) =>
  game.sets.every(
    (set) => set[0] <= max[0] && set[1] <= max[1] && set[2] <= max[2]
  )
);

const total = possibleGames.reduce((prev, game) => prev + game.id, 0);
console.log(total);

const gamePowers = games.map((game) => {
  const minCubes = game.sets.reduce(
    (prev, rgb) => [
      Math.max(prev[0], rgb[0]),
      Math.max(prev[1], rgb[1]),
      Math.max(prev[2], rgb[2]),
    ],
    [0, 0, 0]
  );
  return minCubes[0] * minCubes[1] * minCubes[2];
});

const powerTotal = gamePowers.reduce((prev, power) => prev + power, 0);
console.log(powerTotal);
