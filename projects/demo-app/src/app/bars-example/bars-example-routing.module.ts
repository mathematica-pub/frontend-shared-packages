import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarsExampleComponent } from './bars-example.component';

const routes: Routes = [{ path: '', component: BarsExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarsRoutingModule {}
