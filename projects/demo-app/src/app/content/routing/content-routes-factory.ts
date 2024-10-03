import { Routes } from '@angular/router';
import { Library } from '../../core/services/router-state/state';
import { ContentConfigService } from '../content-config.service';

export function contentRoutesFactory(lib: Library) {
  return (configService: ContentConfigService) => {
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
          .join('') + 'ContentComponent';
      routes[0].children.push({
        path: item,
        loadComponent: () =>
          import(
            `../../${lib}/${item}-content/${item}-content.component.ts`
          ).then((m) => m[componentName]),
      });
    });
    return routes;
  };
}
