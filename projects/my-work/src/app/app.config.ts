import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   useFactory: (config: ) => {
    //     return () => {
    //       config.initConfigs([Library.UiComponents, Library.VizComponents]);
    //     };
    //   },
    // },
  ],
};
