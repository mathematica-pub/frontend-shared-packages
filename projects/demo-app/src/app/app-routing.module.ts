import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'shared-packages/overview',
    pathMatch: 'full',
  },
  {
    path: 'viz-components/content',
    loadChildren: () =>
      import(
        './manual-documentation/core/routing/viz-components-routing.module'
      ).then((m) => m.VizComponentsRoutingModule),
  },
  {
    path: ':lib',
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './manual-documentation/core/overview/overview.component'
          ).then((m) => m.OverviewComponent),
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
