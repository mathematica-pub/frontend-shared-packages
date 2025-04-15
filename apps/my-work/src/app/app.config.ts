import { TitleCasePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { DirectoryConfigsService } from './core/services/directory-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    TitleCasePipe,
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideAppInitializer(() => {
      const initializerFn = ((config: DirectoryConfigsService) => {
        return () => {
          config.initConfigs();
        };
      })(inject(DirectoryConfigsService));
      return initializerFn();
    }),
  ],
};
