import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { contentRoutesFactory } from './content-routes-factory';
import { ContentConfigService } from './services/content-config.service';

// @NgModule({
//   imports: [RouterModule.forChild(CONTENT_ROUTES)],
//   exports: [RouterModule],
// })
// export class ContentRoutingModule {}

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
