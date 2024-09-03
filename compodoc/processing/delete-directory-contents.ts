import { promises as fs } from 'fs';
import * as path from 'path';

export async function deleteDirectoryContents(dir: string) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.lstat(filePath);

      if (stat.isDirectory()) {
        await fs.rm(filePath, { recursive: true });
      } else {
        await fs.unlink(filePath);
      }
    }
    console.log(`All contents of directory ${dir} have been deleted.`);
  } catch (error) {
    console.error(`Error deleting directory contents: ${error}`);
  }
}
