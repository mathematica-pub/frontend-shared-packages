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
      import('./content/core/routing/viz-components-routing.module').then(
        (m) => m.VizComponentsRoutingModule
      ),
  },
  {
    path: ':lib',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./content/core/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'documentation',
        children: [
          {
            path: '**',
            loadComponent: () =>
              import(
                './automated-documentation/automated-documentation-display.component'
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
