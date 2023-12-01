const { readFileSync } = require("fs");

const findVisibleTrees = (grid) => {
    const numRows = grid.length;
    const numCols = grid[0].length;

    // init visible items
    const visibleTrees = grid.map((row) => new Array(row.length).fill(false));

    // Left to Right
    for (let row = 0; row < numRows; row++) {
        let highestTree = -1;
        for (let column = 0; column < numCols; column++) {
            const tree = grid[row][column]
            if (tree > highestTree) {
                visibleTrees[row][column] = true;
                highestTree = tree;
            }
        }
    }

    // Right to Left
    for (let row = 0; row < numRows; row++) {
        let highestTree = -1;
        for (let column = numCols - 1; column > -1; column--) {
            const tree = grid[row][column]
            if (tree > highestTree) {
                visibleTrees[row][column] = true;
                highestTree = tree;
            }
        }
    }

    // Top to Bottom
    for (let column = 0; column < numCols; column++) {
        let highestTree = -1;
        for (let row = 0; row < numRows; row++) {
            const tree = grid[row][column];
            if (tree > highestTree) {
                visibleTrees[row][column] = true;
                highestTree = tree;
            }
        }
    }

    // Bottom to Top
    for (let column = 0; column < numCols; column++) {
        let highestTree = -1;
        for (let row = numRows - 1; row > -1; row--) {
            const tree = grid[row][column];
            if (tree > highestTree) {
                visibleTrees[row][column] = true;
                highestTree = tree;
            }
        }
    }

    const totalVisible = visibleTrees.reduce((prevTotal, row) => prevTotal + row.filter((tree) => tree).length, 0);
    return totalVisible;
};

const getScenicScoreForTree = (grid, row, column) => {
    // Left
    let visibleLeft = 0;
    let highestTree = grid[row][column];
    for (let c = column - 1; c > -1; c--) {
        const tree = grid[row][c];
        visibleLeft++;
        if (tree >= highestTree) {
            break;
        }
    }

    // Right
    let visibleRight = 0;
    highestTree = grid[row][column];
    for (let c = column + 1; c < grid[row].length; c++) {
        const tree = grid[row][c];
        visibleRight++;
        if (tree >= highestTree) {
            break;
        }
    }

    // Top
    let visibleTop = 0;
    highestTree = grid[row][column];
    for (let r = row - 1; r > -1; r--) {
        const tree = grid[r][column];
        visibleTop++;
        if (tree >= highestTree) {
            break;
        }
    }

    // Bottom
    let visibleBottom = 0;
    highestTree = grid[row][column];
    for (let r = row + 1; r < grid.length; r++) {
        const tree = grid[r][column];
        visibleBottom++;
        if (tree >= highestTree) {
            break;
        }
    }

    return visibleBottom * visibleLeft * visibleRight * visibleTop;
};

const getHighestScenicScore = (grid) => {
    let highestScore = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const score = getScenicScoreForTree(grid, row, col);
            if (score > highestScore) {
                highestScore = score;
            }
        }
    }

    return highestScore;
};

const main = () => {
    const input = readFileSync("input.txt", { encoding: "utf-8" });
    const grid = input.split("\n").map((line) => line.split("").map((item) => parseInt(item)));
    const visibleTrees = findVisibleTrees(grid);
    console.log(`Part 1: ${visibleTrees}`);

    const highestScenicScore = getHighestScenicScore(grid);
    console.log(`Part 2: ${highestScenicScore}`);
};

main();