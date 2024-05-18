import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VicExportDataService } from 'projects/viz-components/src/lib/export-data/export-data.service';
import { VicImageService } from 'projects/viz-components/src/lib/image-download/image.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UndasherizePipe } from './core/pipes/undasherize.pipe';
import { NavbarFolderComponent } from './navbar-folder/navbar-folder.component';
import { NavbarComponent } from './navbar/navbar.component';

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
  providers: [VicExportDataService, VicImageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
