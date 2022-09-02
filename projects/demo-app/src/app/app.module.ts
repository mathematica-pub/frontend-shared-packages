import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DataService } from './core/services/data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { UndasherizePipe } from './core/pipes/undasherize.pipe';

@NgModule({
  declarations: [AppComponent, NavbarComponent, UndasherizePipe],
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
