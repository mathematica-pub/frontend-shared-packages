import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { ManualDocumentationConfigService } from './manual-documentation/core/routing/manual-documentation-config.service';
import { Library } from './sidebar/lib-docs/libraries';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ManualDocumentationConfigService) => {
        return () => {
          config.initConfigs([Library.UiComponents, Library.VizComponents]);
        };
      },
      deps: [ManualDocumentationConfigService],
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
};
