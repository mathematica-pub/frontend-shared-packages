import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';

import { Schema as ExtendSchema } from './schema';

export function extendCustom(options: ExtendSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info(options.extends);
    context.logger.info(options.name);
    tree.create('src/app/gotcha.html', '<div> hello world </div>');
    return tree;
  };
}
