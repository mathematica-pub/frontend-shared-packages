import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('../viz/overview-content/overview-content.component').then(
        (m) => m.OverviewContentComponent
      ),
  },
  {
    path: 'primary-marks',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import('../viz/bars-content/bars-content.component').then(
            (m) => m.BarsContentComponent
          ),
      },
      {
        path: 'dots',
        loadComponent: () =>
          import('../viz/dots-content/dots-content.component').then(
            (m) => m.DotsContentComponent
          ),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import(
            '../viz/geographies-content/geographies-content.component'
          ).then((m) => m.GeographiesContentComponent),
      },
      {
        path: 'grouped-bars',
        loadComponent: () =>
          import(
            '../viz/grouped-bars-content/grouped-bars-content.component'
          ).then((m) => m.GroupedBarsContentComponent),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('../viz/lines-content/lines-content.component').then(
            (m) => m.LinesContentComponent
          ),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import(
            '../viz/stacked-area-content/stacked-area-content.component'
          ).then((m) => m.StackedAreaContentComponent),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import(
            '../viz/stacked-bars-content/stacked-bars-content.component'
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
              import('../viz/axes-content/axes-content.component').then(
                (m) => m.AxesContentComponent
              ),
          },
          {
            path: 'baseline',
            loadComponent: () =>
              import('../viz/axes-content/axes-content.component').then(
                (m) => m.AxesContentComponent
              ),
          },
          {
            path: 'grid',
            loadComponent: () =>
              import('../viz/axes-content/axes-content.component').then(
                (m) => m.AxesContentComponent
              ),
          },
          {
            path: 'labels',
            loadComponent: () =>
              import('../viz/axes-content/axes-content.component').then(
                (m) => m.AxesContentComponent
              ),
          },
          {
            path: 'tick-wrap',
            loadComponent: () =>
              import('../viz/axes-content/axes-content.component').then(
                (m) => m.AxesContentComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../viz/default-content/default-content.component').then(
        (m) => m.DefaultContentComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VizComponentsRoutingModule {}
