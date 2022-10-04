import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinesExampleComponent } from './lines-example.component';

const routes: Routes = [{ path: '', component: LinesExampleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinesRoutingModule {}
