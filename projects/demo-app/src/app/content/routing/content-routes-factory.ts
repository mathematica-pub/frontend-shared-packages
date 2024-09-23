import { Routes } from '@angular/router';
import { ContentConfigService } from '../../core/services/content-config.service';
import { Library } from '../../core/services/router-state/state';

export function contentRoutesFactory(lib: Library) {
  return (configService: ContentConfigService) => {
    const config = configService.getConfig(lib);
    const routes: Routes = [
      {
        path: '',
        children: [],
      },
    ];
    Object.keys(config.items).forEach((item: string) => {
      const componentName =
        item
          .split('-')
          .map((word: string) => word[0].toUpperCase() + word.slice(1))
          .join('') + 'ContentComponent';
      routes[0].children.push({
        path: item,
        loadComponent: () =>
          import(`../${lib}/${item}-content/${item}-content.component.ts`).then(
            (m) => m[componentName]
          ),
      });
    });
    return routes;
  };
}
