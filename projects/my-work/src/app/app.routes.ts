import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'content',
    loadChildren: () =>
      import(
        './manual-documentation/core/routing/viz-components-routing.module'
      ).then((m) => m.VizComponentsRoutingModule),
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
