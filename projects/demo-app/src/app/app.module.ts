import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BasemapService } from './core/services/basemap.service';
import { DataService } from './core/services/data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { DownloadPlaygroundComponent } from './download-playground/download-playground.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, DownloadPlaygroundComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: DataService) => () => {
        return ds.initData();
      },
      deps: [DataService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (ms: BasemapService) => () => {
        return ms.initMap();
      },
      deps: [BasemapService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
