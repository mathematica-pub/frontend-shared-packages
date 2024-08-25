import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { ContentConfigService } from '../services/content-config.service';
import { contentRoutesFactory } from './content-routes-factory';

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: contentRoutesFactory,
      deps: [ContentConfigService],
      multi: true,
    },
  ],
})
export class ContentRoutingModule {}
