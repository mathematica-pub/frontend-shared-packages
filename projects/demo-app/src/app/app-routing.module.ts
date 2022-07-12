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
    loadChildren: () =>
      import('./bars-demo/bars-demo.module').then((m) => m.BarsDemoModule),
  },
  {
    path: 'lines',
    loadChildren: () =>
      import('./lines-demo/lines-demo.module').then((m) => m.LinesDemoModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
