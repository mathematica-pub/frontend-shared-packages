import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { ComponentDocumentationComponent } from './shared/component-documentation/component-documentation.component';
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
        loadChildren: () =>
          import('./lines-example/lines-example.module').then(
            (m) => m.LinesModule
          ),
      },
      {
        path: 'stacked-area',
        loadChildren: () =>
          import('./stacked-area-example/stacked-area-example.module').then(
            (m) => m.StackedAreaModule
          ),
      },
      {
        path: 'stacked-bars',
        loadChildren: () =>
          import('./stacked-bars-example/stacked-bars-example.module').then(
            (m) => m.StackedBarsModule
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
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
