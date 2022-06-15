import {
  Rule,
  Tree,
  SchematicContext,
  mergeWith,
  SchematicsException,
  chain,
  forEach,
  FileEntry,
  url,
  apply,
  move,
  externalSchematic,
  MergeStrategy,
} from '@angular-devkit/schematics';

import {
  normalize,
  strings,
  virtualFs,
  workspaces,
} from '@angular-devkit/core';

import { Schema as ExtendSchema } from './schema';

export function extendCustom(options: ExtendSchema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    if (!options.name || !options.extends) {
      throw new SchematicsException(
        'Options name and extends are both required.'
      );
    }

    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    const project =
      options.project != null ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    const projectType =
      project.extensions['projectType'] === 'application' ? 'app' : 'lib';

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    }

    const htmlSource = apply(url('./raw-html'), [
      forEach((fileEntry: FileEntry) => {
        if (fileEntry.path == normalize(`/${options.extends}.component.html`))
          return fileEntry;
        return null;
      }),
      move(normalize(`${options.path}/${strings.dasherize(options.name)}`)),
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'component', {
        name: strings.dasherize(options.name),
        path: options.path,
      }),
      mergeWith(htmlSource, MergeStrategy.Overwrite),
    ]);
  };
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}
