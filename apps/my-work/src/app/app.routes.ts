import { Routes } from '@angular/router';
import { Section } from './core/services/router-state/state';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'documentation/about-this-app',
    pathMatch: 'full',
  },
  {
    path: Section.Docs,
    children: [
      {
        path: '**',
        loadComponent: () =>
          import(
            './platform/documentation-container/documentation-container.component'
          ).then((m) => m.DocumentationContainerComponent),
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
    redirectTo: 'documentation/about-this-app',
  },
];
