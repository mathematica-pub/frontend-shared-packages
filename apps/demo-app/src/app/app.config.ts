import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import {
  AdkDocumentationConfigParser,
  AdkDocumentationContentService,
  AdkMarkdownParser,
} from '@hsi/app-dev-kit';
import { APP_ROUTES } from './app.routes';
import { ContentConfigService } from './core/services/content-config.service';
import { ContentParser } from './core/services/content-parser.service';
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
    { provide: AdkMarkdownParser, useClass: ContentParser },
    AdkDocumentationContentService,
    AdkDocumentationConfigParser,
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
