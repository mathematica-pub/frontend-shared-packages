import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { Library } from '../../../sidebar/lib-docs/libraries';
import { manualDocumentationRoutesFactory } from './manual-docs-routing-factory';
import { ManualDocumentationConfigService } from './manual-documentation-config.service';

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: manualDocumentationRoutesFactory(Library.VizComponents),
      deps: [ManualDocumentationConfigService],
      multi: true,
    },
  ],
})
export class VizComponentsRoutingModule {}
