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
      import('./content/routing/viz-components-routing.module').then(
        (m) => m.VizComponentsRoutingModule
      ),
  },
  {
    path: 'ui-components/content',
    loadChildren: () =>
      import('./content/routing/ui-components-routing.module').then(
        (m) => m.UiComponentsRoutingModule
      ),
  },
  {
    path: ':lib',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./platform/overview/overview.component').then(
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
                './platform/automated-documentation-display/automated-documentation-display.component'
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
