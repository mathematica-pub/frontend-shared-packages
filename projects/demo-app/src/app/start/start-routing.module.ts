import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent,
  },
  {
    path: 'bars',
    loadChildren: () => import('../bars/bars.module').then((m) => m.BarsModule),
  },
  {
    path: 'line',
    loadChildren: () =>
      import('../lines/lines.module').then((m) => m.LinesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRoutingModule {}
