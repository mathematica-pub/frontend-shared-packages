import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { AdkAssetsService } from 'projects/app-dev-kit/src/public-api';
import { APP_ROUTES } from './app.routes';
import { ContentConfigService } from './core/services/content-config.service';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideAnimationsAsync(),
    AdkAssetsService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ContentConfigService) => {
        return () => {
          config.initConfig();
        };
      },
      deps: [ContentConfigService],
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
};
