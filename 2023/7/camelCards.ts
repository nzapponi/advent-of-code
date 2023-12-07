import { loadTextFile } from "../../utils";

const input = await loadTextFile("input.txt");

const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const CARD_VALUE: { [key: string]: number } = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  "T": 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

function getCardsValue(hand: [string, string, string, string, string]) {
  // console.log(CARD_VALUE[hand[0]] * 5, CARD_VALUE[hand[1]] * 4, CARD_VALUE[hand[2]] * 3, CARD_VALUE[hand[3]] * 2, CARD_VALUE[hand[4]]);
  return (
    CARD_VALUE[hand[0]] * 13**5 +
    CARD_VALUE[hand[1]] * 13**4 +
    CARD_VALUE[hand[2]] * 13**3 +
    CARD_VALUE[hand[3]] * 13**2 +
    CARD_VALUE[hand[4]]
  );
}

const maxCardValue = getCardsValue(["A","A","A","A","A"]);

// unique score for each hand
function getHandScore(hand: [string, string, string, string, string]) {
  // check type of hand, add [0...6]*max, then add cards value
  // console.log(hand.join(""));
  
  // card counts
  const cardCounts = CARDS.map((card) => hand.filter((h) => card === h).length);
  
  let multiplier = 0;
  if (cardCounts.some((count) => count === 5)) {
    // poker
    // console.log("poker");
    multiplier = 6;
  } else if (cardCounts.some((count) => count === 4)) {
    // four of a kind
    // console.log("4-of-a-kind");
    multiplier = 5;
  } else if (cardCounts.some((count) => count === 3) && cardCounts.some((count) => count === 2)) {
    // full house
    // console.log("full house");
    multiplier = 4;
  } else if (cardCounts.some((count) => count === 3)) {
    // three of a kind
    // console.log("3-of-a-kind");
    multiplier = 3;
  } else if (cardCounts.filter((count) => count === 2).length === 2) {
    // two pair
    // console.log("two pair");
    multiplier = 2;
  } else if (cardCounts.filter((count) => count === 2).length === 1) {
    // one pair
    // console.log("one pair");
    multiplier = 1;
  }

  return multiplier * maxCardValue + getCardsValue(hand);
}

const handsAndBids = input.map((line) => {
  const parts = line.split(" ");
  return {
    hand: parts[0].split("") as [string, string, string, string, string],
    bid: +parts[1],
  }
});

const rankedHands = [...handsAndBids].sort((a, b) => getHandScore(a.hand) - getHandScore(b.hand));
const totalWinnings = rankedHands.reduce((tot, hand, rank) => tot + (rank + 1) * hand.bid, 0);
console.log(totalWinnings);
