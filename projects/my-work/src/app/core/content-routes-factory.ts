import { Route, Routes } from '@angular/router';
import {
  AngularComponentsConfig,
  DirectoryConfigsService,
} from './services/directory-config.service';

export function contentRoutesFactory(
  configService: DirectoryConfigsService
): Routes {
  const config = configService.contentConfig;
  const routes: Routes = [
    {
      path: '',
      children: constructRoutes(config.items, undefined),
    },
  ];
  return routes;
}

function constructRoutes(
  config: string[] | AngularComponentsConfig,
  path: string
): Routes {
  const routes: Routes = [];
  if (Array.isArray(config)) {
    config.forEach((item) => routes.push(getComponentRoute(item, path)));
  } else {
    Object.entries(config).forEach(([key, value]) => {
      const nextPath = path ? `${path}/${key}` : `/${key}`;
      routes.push({
        path: key,
        children: constructRoutes(value, nextPath),
      });
    });
  }
  return routes;
}

function getComponentRoute(item: string, path: string): Route {
  return {
    path: item,
    loadComponent: () =>
      import(`../content${path}/${item}/${item}.component.ts`).then(
        (m) => m[getComponentName(item)]
      ),
  };
}

function getComponentName(item: string): string {
  return (
    item
      .split('-')
      .map((word: string) => word[0].toUpperCase() + word.slice(1))
      .join('') + 'Component'
  );
}
