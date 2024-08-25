import { Routes } from '@angular/router';
import { OverviewComponent } from './platform/overview/overview.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'content',
    loadChildren: () =>
      import('./core/content-routing.module').then(
        (m) => m.ContentRoutingModule
      ),
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
