export function contentRoutesFactory() {
  // return (configService: ContentConfigService) => {
  //   const config = configService.configs[lib];
  //   const routes: Routes = [
  //     {
  //       path: '',
  //       children: [],
  //     },
  //   ];
  //   config.items.forEach((item: string) => {
  //     const componentName =
  //       item
  //         .split('-')
  //         .map((word: string) => word[0].toUpperCase() + word.slice(1))
  //         .join('') + 'DocumentationComponent';
  //     routes[0].children.push({
  //       path: item,
  //       loadComponent: () =>
  //         import(
  //           `../../${lib}/${item}-documentation/${item}-documentation.component`
  //         ).then((m) => m[componentName]),
  //     });
  //   });
  //   return routes;
  // };
}
