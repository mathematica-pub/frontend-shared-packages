import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// tree is virtual representation of files on disc (does it virtually before doing it physically)
// context provides logging, debugging functionality
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Installing dependencies...');
    context.addTask(
      new NodePackageInstallTask({
        packageManager: 'npm',
      })
    );
    return tree;
  };
}
