import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'content',
    loadChildren: () =>
      import('./core/routing/content-routing.module').then(
        (m) => m.ContentRoutingModule
      ),
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
