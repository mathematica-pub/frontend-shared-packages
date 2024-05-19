import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { RenderFileComponent } from './shared/render-file/render-file.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: RenderFileComponent,
  },
  {
    path: 'examples',
    children: [
      {
        path: 'bars',
        loadComponent: () =>
          import('./bars-example/bars-example.component').then(
            (m) => m.BarsExampleComponent
          ),
      },
      {
        path: 'geographies',
        loadComponent: () =>
          import('./geographies-example/geographies-example.component').then(
            (m) => m.GeographiesExampleComponent
          ),
      },
      {
        path: 'lines',
        loadComponent: () =>
          import('./lines-example/lines-example.component').then(
            (m) => m.LinesExampleComponent
          ),
      },
      {
        path: 'stacked-area',
        loadComponent: () =>
          import('./stacked-area-example/stacked-area-example.component').then(
            (m) => m.StackedAreaExampleComponent
          ),
      },
      {
        path: 'stacked-bars',
        loadComponent: () =>
          import('./stacked-bars-example/stacked-bars-example.component').then(
            (m) => m.StackedBarsExampleComponent
          ),
      },
    ],
  },
  {
    path: 'documentation',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import(
            './shared/component-documentation/component-documentation.component'
          ).then((m) => m.ComponentDocumentationComponent),
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
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
