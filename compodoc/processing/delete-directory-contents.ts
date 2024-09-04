import { promises as fs } from 'fs';
import * as path from 'path';

export async function deleteDirectoryContents(
  dir: string,
  exclude: string[] = []
) {
  try {
    const dirExists = await fs
      .stat(dir)
      .then(() => true)
      .catch(() => false);

    if (!dirExists) {
      console.log(`Directory ${dir} does not exist.`);
      return;
    }

    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      if (exclude.includes(file)) {
        console.log(`Skipping excluded file: ${file}`);
        continue;
      }

      const stat = await fs.lstat(filePath);

      if (stat.isDirectory()) {
        await deleteDirectoryContents(filePath);
        await fs.rm(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }
    console.log(`All contents of directory ${dir} have been deleted.`);
  } catch (error) {
    console.error(`Error deleting directory contents: ${error}`);
  }
}
