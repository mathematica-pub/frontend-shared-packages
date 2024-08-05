import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VicDataExport } from 'projects/viz-components/src/lib/data-export/data-export';
import { VicImageDownload } from 'projects/viz-components/src/lib/image-download/image-download';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarFolderComponent } from './navbar-folder/navbar-folder.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NavbarComponent,
    NavbarFolderComponent,
  ],
  providers: [VicDataExport, VicImageDownload],
  bootstrap: [AppComponent],
})
export class AppModule {}
