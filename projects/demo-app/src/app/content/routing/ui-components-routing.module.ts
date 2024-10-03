import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: 'table',
    loadComponent: () =>
      import('../ui-components/table-content/table-content.component').then(
        (m) => m.TableContentComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../content-container/content-container.component').then(
        (m) => m.ContentContainerComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiComponentsRoutingModule {}
