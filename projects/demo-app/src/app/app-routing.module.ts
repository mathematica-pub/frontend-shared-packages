import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview/shared-packages',
    pathMatch: 'full',
  },
  {
    path: 'overview/:lib',
    loadComponent: () =>
      import('./manual-documentation/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'viz-components',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import(
            './manual-documentation/viz-components/bars-documentation/bars-documentation.component'
          ).then((m) => m.BarsDocumentationComponent),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import(
            './manual-documentation/viz-components/geographies-documentation/geographies-documentation.component'
          ).then((m) => m.GeographiesDocumentationComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import(
            './manual-documentation/viz-components/lines-documentation/lines-documentation.component'
          ).then((m) => m.LinesDocumentationComponent),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import(
            './manual-documentation/viz-components/stacked-area-documentation/stacked-area-documentation.component'
          ).then((m) => m.StackedAreaDocumentationComponent),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import(
            './manual-documentation/viz-components/stacked-bars-documentation/stacked-bars-documentation.component'
          ).then((m) => m.StackedBarsDocumentationComponent),
      },
    ],
  },
  {
    path: 'automated-documentation',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import(
            './automated-documentation-display/automated-documentation-display.component'
          ).then((m) => m.AutomatedDocumentationDisplayComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/overview/shared-packages',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
