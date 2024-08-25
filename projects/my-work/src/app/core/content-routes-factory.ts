import { Route, Routes } from '@angular/router';
import { ContentConfigService } from './services/content-config.service';

interface NestedStringObject {
  [key: string]: string[] | NestedStringObject;
}

interface ContentConfig {
  name: string;
  items: string[] | NestedStringObject;
}

export function contentRoutesFactory(
  configService: ContentConfigService
): Routes {
  const config = configService.config;
  const routes: Routes = [
    {
      path: '',
      children: constructRoutes(config.items, undefined),
    },
  ];
  return routes;
}

function constructRoutes(
  config: string[] | NestedStringObject,
  path: string
): Routes {
  console.log(config, path);
  const routes: Routes = [];
  if (Array.isArray(config)) {
    config.forEach((item) => routes.push(getFlatRoute(item, path)));
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

function getFlatRoute(item: string, path: string): Route {
  console.log('flat route', item, path);
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
