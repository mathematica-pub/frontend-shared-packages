import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.OverviewComponent),
  },
  {
    path: 'examples',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import('./examples/bars-example/bars-example.component').then(
            (m) => m.BarsExampleComponent
          ),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import(
            './examples/geographies-example/geographies-example.component'
          ).then((m) => m.GeographiesExampleComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('./examples/lines-example/lines-example.component').then(
            (m) => m.LinesExampleComponent
          ),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import(
            './examples/stacked-area-example/stacked-area-example.component'
          ).then((m) => m.StackedAreaExampleComponent),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import(
            './examples/stacked-bars-example/stacked-bars-example.component'
          ).then((m) => m.StackedBarsExampleComponent),
      },
    ],
  },
  {
    path: 'documentation',
    loadComponent: () =>
      import('./documentation-display/documentation-display.component').then(
        (m) => m.DocumentationDisplayComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/overview',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
