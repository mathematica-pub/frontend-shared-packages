import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UndasherizePipe } from './core/pipes/undasherize.pipe';
import { BasemapService } from './core/services/basemap.service';
import { DataService } from './core/services/data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { UndasherizePipe } from './core/pipes/undasherize.pipe';
import { NavbarFolderComponent } from './navbar-folder/navbar-folder.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UndasherizePipe,
    NavbarFolderComponent,
  ],
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
