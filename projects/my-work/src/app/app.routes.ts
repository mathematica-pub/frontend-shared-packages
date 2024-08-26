import { Routes } from '@angular/router';
import { Section } from './core/services/state/state';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'documentation/about',
    pathMatch: 'full',
  },
  {
    path: Section.Docs,
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./platform/documentation/documentation.component').then(
            (m) => m.DocumentationComponent
          ),
      },
    ],
  },
  {
    path: Section.Content,
    loadChildren: () =>
      import('./core/content-routing.module').then(
        (m) => m.ContentRoutingModule
      ),
  },
  {
    path: '**',
    redirectTo: 'documentation/about',
  },
];
