import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { ConfigsService } from './core/services/content-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ConfigsService) => {
        return () => {
          config.initConfigs();
        };
      },
      deps: [ConfigsService],
    },
  ],
};
