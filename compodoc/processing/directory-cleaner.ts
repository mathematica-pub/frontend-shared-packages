import minimist from 'minimist';
import { deleteDirectoryContents } from './delete-directory-contents';

interface Arguments {
  lib: string;
}

export class CompodocDirectoryCleaner {
  lib: string;
  compodocPath: string;

  constructor(lib: string) {
    this.lib = lib;
    this.compodocPath = `./compodoc/docs/${lib}`;
  }

  clean(): void {
    deleteDirectoryContents(`./compodoc/docs/${this.lib}`);
  }
}

function getArgs(): Arguments {
  const args: Arguments = minimist(process.argv.slice(2));
  if (!args.lib) {
    console.error('Please provide a library name');
    process.exit(1);
  }
  return args;
}

const args = getArgs();
const documentationParser = new CompodocDirectoryCleaner(args.lib);
documentationParser.clean();
