import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapExampleComponent } from './map-example.component';

const routes: Routes = [{ path: '', component: MapExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapExampleRoutingModule {}
