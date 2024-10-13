import { TitleCasePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
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
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: DirectoryConfigsService) => {
        return () => {
          config.initConfigs();
        };
      },
      deps: [DirectoryConfigsService],
    },
  ],
};
