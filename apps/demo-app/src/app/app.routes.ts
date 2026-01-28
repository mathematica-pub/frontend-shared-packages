import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'shared-packages/overview',
    pathMatch: 'full',
  },
  {
    path: 'app-kit/content',
    loadChildren: () =>
      import('./content/routing/app-kit-routing.module').then(
        (m) => m.AppDevKitRoutingModule
      ),
  },
  {
    path: 'ui/content',
    loadChildren: () =>
      import('./content/routing/ui-routing.module').then(
        (m) => m.UiComponentsRoutingModule
      ),
  },
  {
    path: 'viz/content',
    loadChildren: () =>
      import('./content/routing/viz-routing.module').then(
        (m) => m.VizComponentsRoutingModule
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
