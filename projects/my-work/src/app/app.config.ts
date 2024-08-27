import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { DirectoryConfigService } from './core/services/directory-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: DirectoryConfigService) => {
        return () => {
          config.initConfigs();
        };
      },
      deps: [DirectoryConfigService],
    },
  ],
};
