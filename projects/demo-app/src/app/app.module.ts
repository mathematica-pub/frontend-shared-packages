import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManualDocumentationConfigService } from './manual-documentation/core/routing/manual-documentation-config.service';
import { DocsDirectoryComponent } from './sidebar/lib-docs/docs-directory/docs-directory.component';
import { Library } from './sidebar/lib-docs/libraries';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SidebarComponent,
    DocsDirectoryComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (config: ManualDocumentationConfigService) => {
        return () => {
          config.initConfigs([Library.UiComponents, Library.VizComponents]);
        };
      },
      deps: [ManualDocumentationConfigService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
