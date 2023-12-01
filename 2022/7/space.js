const { readFileSync } = require("fs");

const getFolderSizes = (commands) => {
  const files = {}; // store the full file path as the key and file size as the value
  const directories = new Set();

  let currentPath = [];
  let dirPath = "";
  let listMode = false;
  for (const line of commands) {
    if (line.startsWith("$")) {
      // command
      const commandRegex = /\$ ([a-z]+)\s?(.*)/;
      const lineParts = commandRegex.exec(line);
      const command = lineParts[1];
      const arg = lineParts[2];
      if (command === "ls") {
        listMode = true;
      } else {
        listMode = false;
        if (command === "cd") {
          if (arg === "/") {
            currentPath = [];
          } else if (arg === "..") {
            currentPath.pop();
          } else {
            currentPath.push(arg);
          }
          if (currentPath.length === 0) {
            dirPath = "";
            directories.add("/");
          } else {
            dirPath = `/${currentPath.join("/")}`;
            directories.add(dirPath);
          }
        }
      }
    } else if (listMode) {
      const lsRegex = /(dir|[0-9]+) (.+)/;
      const lsParts = lsRegex.exec(line);
      const fileSizeOrDir = lsParts[1];
      const fileName = lsParts[2];
      if (fileSizeOrDir !== "dir") {
        const fullPath = `${dirPath}/${fileName}`;
        files[fullPath] = parseInt(fileSizeOrDir);
      }
    }
  }
  
  const folderSizes = {};
  directories.forEach((directory) => {
    const filesInFolder = Object.keys(files).filter((filePath) => filePath.startsWith(directory));
    const folderSize = filesInFolder.reduce((prevValue, filePath) => prevValue + files[filePath], 0);
    folderSizes[directory] = folderSize;
  });

  return folderSizes;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const rows = input.split("\n");
  const folderSizes = getFolderSizes(rows);
  
  // Filter folder sizes under 100000 in size and add
  const folderSizesSum = Object.values(folderSizes).filter((size) => size < 100000).reduce((prev, size) => prev + size, 0);
  console.log(`Part 1: ${folderSizesSum}`);

  console.log("Part 2");
  const FS_SIZE = 70000000;
  const STORAGE_REQUIRED = 30000000;

  const spaceToFreeUp = STORAGE_REQUIRED - (FS_SIZE - folderSizes["/"]);
  if (spaceToFreeUp < 0) {
    console.log("Enough space is already available");
  } else {
    console.log(`We need to free up ${spaceToFreeUp} space`);
    const filteredSizes = Object.values(folderSizes).filter((size) => size >= spaceToFreeUp);
    const sortedSizes = [...filteredSizes].sort((a, b) => a - b);
    console.log(sortedSizes[0]);
  }
};

main();