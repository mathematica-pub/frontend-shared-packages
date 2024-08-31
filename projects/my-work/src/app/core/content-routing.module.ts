import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { contentRoutesFactory } from './content-routes-factory';
import { DirectoryConfigService } from './services/directory-config.service';

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: contentRoutesFactory,
      deps: [DirectoryConfigService],
      multi: true,
    },
  ],
})
export class ContentRoutingModule {}
