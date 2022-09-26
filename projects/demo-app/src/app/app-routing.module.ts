import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadChildren: () =>
      import('./start/start.module').then((m) => m.StartModule),
  },
  {
    path: 'bars',
    loadChildren: () => import('./bars/bars.module').then((m) => m.BarsModule),
  },
  {
    path: 'lines',
    loadChildren: () =>
      import('./lines/lines.module').then((m) => m.LinesModule),
  },
  {
    path: 'geographies',
    loadChildren: () =>
      import('./geographies-example/geographies-example.module').then(
        (m) => m.GeographiesExampleModule
      ),
  },
  {
    path: 'stacked-area',
    loadChildren: () =>
      import('./stacked-area/stacked-area.module').then(
        (m) => m.StackedAreaModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
