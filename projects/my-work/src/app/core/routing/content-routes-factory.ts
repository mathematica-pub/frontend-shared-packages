import { Routes } from '@angular/router';
import { ContentConfigService } from '../services/content-config.service';

export function contentRoutesFactory(
  configService: ContentConfigService
): Routes {
  const config = configService.config;
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
        .join('') + 'Component';
    routes[0].children.push({
      path: item,
      loadComponent: () =>
        import(`../../content/${item}/${item}.component`).then(
          (m) => m[componentName]
        ),
    });
  });
  return routes;
}
