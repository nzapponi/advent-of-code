export async function loadTextFile(path: string) {
  const inputFile = Bun.file(path);
  const input = await inputFile.text();
  return input.split("\n").map((line) => line.trim());
}