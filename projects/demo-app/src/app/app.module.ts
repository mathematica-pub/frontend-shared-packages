import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DataService } from './core/services/data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { DocumentationService } from './core/services/documentation.service';
import { HighlightService } from './core/services/highlight.service';

@NgModule({
  declarations: [AppComponent, NavbarComponent],
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
      useFactory: (ds: DocumentationService) => () => {
        return ds.setDocumentationData();
      },
      deps: [DocumentationService],
      multi: true,
    },
    HighlightService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
