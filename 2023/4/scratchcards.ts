import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");
const cards = input.map((line) => {
  const lineParts = line.split(":");
  const id = +lineParts[0].slice(5);
  const numberParts = lineParts[1].split("|");
  const winners = numberParts[0].trim().split(/\s+/g).map((n) => +(n.trim()));
  const numbers = numberParts[1].trim().split(/\s+/g).map((n) => +(n.trim()));
  const winningNumbers = numbers.filter((n) => winners.includes(n));

  return {
    id,
    winners,
    numbers,
    winningNumbers,
  }
});

function getPointsPerWinnings(numbers: number[]) {
  if (numbers.length === 0) {
    return 0;
  }

  return 2**(numbers.length - 1);
}

const pointsSum = cards.reduce((tot, card) => tot + getPointsPerWinnings(card.winningNumbers), 0);
console.log(pointsSum);

const cardsToProcess = [...cards];
while (cardsToProcess.length > 0) {
  const card = cardsToProcess.shift();
  if (!card) {
    break;
  }
  const winnings = card.winningNumbers.length;
  if (winnings > 0) {
    // console.log(`* Card ${card.id} has ${winnings} winnings`);
    for (let i = 0; i < winnings; i++) {
      const cardToCopy = cards.find((c) => c.id === card.id + i + 1);
      if (!cardToCopy) {
        continue;
      }
      // console.log(`* * Copying card ${cardToCopy.id}`);
      cardsToProcess.push(cardToCopy);
      cards.push(cardToCopy);
    }
  }
}

console.log(cards.length);