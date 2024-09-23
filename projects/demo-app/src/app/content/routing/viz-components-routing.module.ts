import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { ContentConfigService } from '../../core/services/content-config.service';
import { Library } from '../../core/services/router-state/state';
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
