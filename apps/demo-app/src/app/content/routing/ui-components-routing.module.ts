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
    path: 'combobox',
    children: [
      {
        path: '**',
        loadComponent: () =>
          import(
            '../ui-components/combobox-content/combobox-content.component'
          ).then((m) => m.ComboboxContentComponent),
      },
    ],
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
