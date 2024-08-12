import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview/shared-packages',
    pathMatch: 'full',
  },
  {
    path: 'overview/:lib',
    loadComponent: () =>
      import('./manual-documentation/core/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'viz-components',
    loadChildren: () =>
      import(
        './manual-documentation/core/routing/viz-components-routing.module'
      ).then((m) => m.VizComponentsRoutingModule),
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
  {
    path: '**',
    redirectTo: '/overview/shared-packages',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
