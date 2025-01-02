import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import(
        '../viz-components/overview-content/overview-content.component'
      ).then((m) => m.OverviewContentComponent),
  },
  {
    path: 'primary-marks',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import('../viz-components/bars-content/bars-content.component').then(
            (m) => m.BarsContentComponent
          ),
      },
      {
        path: 'dots',
        loadComponent: () =>
          import('../viz-components/dots-content/dots-content.component').then(
            (m) => m.DotsContentComponent
          ),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import(
            '../viz-components/geographies-content/geographies-content.component'
          ).then((m) => m.GeographiesContentComponent),
      },
      {
        path: 'grouped-bars',
        loadComponent: () =>
          import(
            '../viz-components/grouped-bars-content/grouped-bars-content.component'
          ).then((m) => m.GroupedBarsContentComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import(
            '../viz-components/lines-content/lines-content.component'
          ).then((m) => m.LinesContentComponent),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import(
            '../viz-components/stacked-area-content/stacked-area-content.component'
          ).then((m) => m.StackedAreaContentComponent),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import(
            '../viz-components/stacked-bars-content/stacked-bars-content.component'
          ).then((m) => m.StackedBarsContentComponent),
      },
    ],
  },
  {
    path: 'aux-marks',
    children: [
      {
        path: 'xy-axes',
        children: [
          {
            path: 'axes',
            loadComponent: () =>
              import(
                '../viz-components/axes-content/axes-content.component'
              ).then((m) => m.AxesContentComponent),
          },
          {
            path: 'labels',
            loadComponent: () =>
              import(
                '../viz-components/axes-content/axes-content.component'
              ).then((m) => m.AxesContentComponent),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../content-container/content-container.component').then(
        (m) => m.ContentContainerComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VizComponentsRoutingModule {}
