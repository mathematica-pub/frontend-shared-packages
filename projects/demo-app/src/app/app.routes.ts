import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'shared-packages/overview',
    pathMatch: 'full',
  },
  {
    path: 'viz-components/content',
    loadChildren: () =>
      import(
        './manual-documentation/core/routing/viz-components-routing.module'
      ).then((m) => m.VizComponentsRoutingModule),
  },
  {
    path: ':lib',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './manual-documentation/core/overview/overview.component'
          ).then((m) => m.OverviewComponent),
      },
      {
        path: 'documentation',
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
    ],
  },
  {
    path: '**',
    redirectTo: 'shared-packages/overview',
  },
];
