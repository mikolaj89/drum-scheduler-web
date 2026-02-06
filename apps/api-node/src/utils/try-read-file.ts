import { readFile } from "node:fs/promises";

export const tryReadFile = async (path: string): Promise<string | null> => {
  try {
    return await readFile(path, "utf8");
  } catch (_e) {
    return null;
  }
};
