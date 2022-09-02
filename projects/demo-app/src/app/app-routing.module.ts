import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { ComponentDocumentationComponent } from './shared/component-documentation/component-documentation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: ComponentDocumentationComponent,
  },
  {
    path: 'examples',
    children: [
      {
        path: 'bars',
        loadChildren: () =>
          import('./bars/bars.module').then((m) => m.BarsModule),
      },
      {
        path: 'lines',
        loadChildren: () =>
          import('./lines/lines.module').then((m) => m.LinesModule),
      },
      {
        path: 'stacked-area',
        loadChildren: () =>
          import('./stacked-area/stacked-area.module').then(
            (m) => m.StackedAreaModule
          ),
      },
    ],
  },
  {
    path: 'documentation',
    children: [
      {
        path: '**',
        component: ComponentDocumentationComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/overview',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
