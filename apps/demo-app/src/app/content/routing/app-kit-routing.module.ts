import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'baseline-styles',
    loadComponent: () =>
      import('../app-kit/baseline-styles/baseline-styles.component').then(
        (m) => m.BaselineStylesComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDevKitRoutingModule {}
