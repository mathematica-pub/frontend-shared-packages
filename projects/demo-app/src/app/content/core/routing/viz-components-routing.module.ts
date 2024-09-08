import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { Library } from '../../../core/services/router-state/state';
import { ContentConfigService } from './content-config.service';
import { contentRoutesFactory } from './content-routes-factory';

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: contentRoutesFactory(Library.VizComponents),
      deps: [ContentConfigService],
      multi: true,
    },
  ],
})
export class VizComponentsRoutingModule {}
