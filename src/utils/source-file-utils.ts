import { promises as fs } from "fs";
import * as path from "path";

export interface ReadSourceFileResult {
  sourceCode: string;
  extension: string;
}

export async function readSourceFileForTool(
  sourceFilePath: string,
  allowedExtensions: string[] = [".bas", ".bm", ".bi"],
): Promise<ReadSourceFileResult> {
  const extension = path.extname(sourceFilePath).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new Error(
      `Unsupported source file type: ${extension}. Allowed extensions: ${allowedExtensions.join(", ")}`,
    );
  }

  const sourceCode = await fs.readFile(sourceFilePath, "utf-8");
  return { sourceCode, extension };
}
