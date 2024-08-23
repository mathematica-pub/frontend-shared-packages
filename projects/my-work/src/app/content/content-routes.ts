import { Routes, ROUTES } from '@angular/router';
import { manualDocumentationRoutesFactory } from 'projects/demo-app/src/app/manual-documentation/core/routing/manual-docs-routing-factory';
import { Library } from 'projects/demo-app/src/app/sidebar/lib-docs/libraries';
import { ManualDocumentationConfigService } from '../core/services/content-config.service';

const CONTENT_ROUTES: Routes = [
  {
    providers: [
      {
        provide: ROUTES,
        useFactory: manualDocumentationRoutesFactory(Library.VizComponents),
        deps: [ManualDocumentationConfigService],
        multi: true,
      },
    ],
  },
];
