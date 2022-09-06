import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeographiesExampleComponent } from './geographies-example.component';

const routes: Routes = [{ path: '', component: GeographiesExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeographiesExampleRoutingModule {}
