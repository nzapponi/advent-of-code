const { readFileSync } = require("fs");

const getReadings = (input) => {
  const rows = input.split("\n");
  const regex = /Sensor at x=([0-9\-]+), y=([0-9\-]+): closest beacon is at x=([0-9\-]+), y=([0-9\-]+)/;
  return rows.map((row) => {
    const result = regex.exec(row);
    return {
      sensor: [+result[1], +result[2]],
      beacon: [+result[3], +result[4]],
    };
  });
};

const getDistance = (a, b) => {
  const xDistance = Math.abs(a[0] - b[0]);
  const yDistance = Math.abs(a[1] - b[1]);
  return xDistance + yDistance;
};

const getBeaconEmptySegments = (reading, rowNumber, minX, maxX) => {
  const totalDistance = getDistance(reading.beacon, reading.sensor);
  const minY = reading.sensor[1] - totalDistance;
  const maxY = reading.sensor[1] + totalDistance;
  if (rowNumber < minY || rowNumber > maxY) {
    return [];
  }
  const emptySegments = [];
  const xDistance = totalDistance - Math.abs(rowNumber - reading.sensor[1]);
  let colMinX = reading.sensor[0] - xDistance;
  let colMaxX = reading.sensor[0] + xDistance;
  if (colMinX < minX) {
    colMinX = minX;
  }
  if (colMaxX > maxX) {
    colMaxX = maxX;
  }
  emptySegments.push({
    y: rowNumber,
    x: [colMinX, colMaxX]
  });
  return emptySegments;
};

const getEmptySegments = (readings, rowNumber, minX, maxX) => {
  const segments = {};
  for (const reading of readings) {
    const newSegments = getBeaconEmptySegments(reading, rowNumber, minX, maxX);
    for (const newSegment of newSegments) {
      if (segments[newSegment.y]) {
        segments[newSegment.y].push(newSegment.x);
      } else {
        segments[newSegment.y] = [newSegment.x];
      }
    }
  }
  
  // dedupe
  for (const y in segments) {
    const sorted = [...segments[y]].sort((a, b) => a[0] - b[0]);
    const newSegments = [];
    for (const seg of sorted) {
      if (newSegments.length === 0) {
        newSegments.push(seg);
      } else {
        let appended = false;
        for (const newSeg of newSegments) {
          if (seg[0] <= newSeg[1] + 1) {
            appended = true;
            if (newSeg[1] < seg[1]) {
              newSeg[1] = seg[1];
            }
            break;
          }
        }
        if (!appended) {
          newSegments.push(seg);
        }
      }
    }
    segments[y] = newSegments;
  }

  return segments;
};

const countEmptySpotsInSegment = (segment) => {
  return segment.reduce((prev, seg) => prev + seg[1] - seg[0] + 1, 0);
};

const getUniqueBeacons = (readings) => {
  const beacons = [];
  for (const reading of readings) {
    if (!beacons.some((beacon) => beacon[0] === reading.beacon[0] && beacon[1] === reading.beacon[1])) {
      beacons.push(reading.beacon);
    }
  }
  return beacons;
};

const main = () => {
  const input = readFileSync("input.txt", { encoding: "utf-8" });
  const rowNumber = 2000000;
  const distressMinX = 0;
  const distressMaxX = 4000000;
  const distressMinY = 0;
  const distressMaxY = 4000000;

  const readings = getReadings(input);
  const emptySegments = getEmptySegments(readings, rowNumber);
  const count = countEmptySpotsInSegment(emptySegments[rowNumber]);
  const uniqueBeacons = getUniqueBeacons(readings);
  const filteredCount = count - uniqueBeacons.filter((reading) => reading[1] === rowNumber).length;
  console.log(`Part 1: ${filteredCount}`);

  for (let y = distressMinY; y <+ distressMaxY; y++) {
    const emptySegments = getEmptySegments(readings, y, distressMinX, distressMaxX);
    if (emptySegments[y].length > 1 && emptySegments[y][1][0] - emptySegments[y][0][1] === 2) {
      const distressX = emptySegments[y][1][0] - 1;
      const tuningFreq = distressX * 4000000 + y;
      console.log(`Part 2: ${tuningFreq}`);
    }
  }
};

main();