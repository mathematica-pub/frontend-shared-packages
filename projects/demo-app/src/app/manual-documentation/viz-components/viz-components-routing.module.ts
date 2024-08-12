import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const vizComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import('./bars-documentation/bars-documentation.component').then(
            (m) => m.BarsDocumentationComponent
          ),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import(
            './geographies-documentation/geographies-documentation.component'
          ).then((m) => m.GeographiesDocumentationComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('./lines-documentation/lines-documentation.component').then(
            (m) => m.LinesDocumentationComponent
          ),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import(
            './stacked-area-documentation/stacked-area-documentation.component'
          ).then((m) => m.StackedAreaDocumentationComponent),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import(
            './stacked-bars-documentation/stacked-bars-documentation.component'
          ).then((m) => m.StackedBarsDocumentationComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vizComponentsRoutes)],
  exports: [RouterModule],
})
export class VizComponentsRoutingModule {}
