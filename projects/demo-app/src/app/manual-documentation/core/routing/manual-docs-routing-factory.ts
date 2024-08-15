import { Routes } from '@angular/router';
import { Library } from '../../../sidebar/lib-docs/libraries';
import { ManualDocumentationConfigService } from './manual-documentation-config.service';

// Any component that is provided this way must be explicitly added to files array in tsconfig.app.json
export function manualDocumentationRoutesFactory(lib: Library) {
  return (configService: ManualDocumentationConfigService) => {
    const config = configService.configs[lib];
    const routes: Routes = [
      {
        path: '',
        children: [],
      },
    ];
    config.items.forEach((item: string) => {
      const componentName =
        item
          .split('-')
          .map((word: string) => word[0].toUpperCase() + word.slice(1))
          .join('') + 'DocumentationComponent';
      routes[0].children.push({
        path: item,
        loadComponent: () =>
          import(
            `../../${lib}/${item}-documentation/${item}-documentation.component`
          ).then((m) => m[componentName]),
      });
    });
    return routes;
  };
}
