import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdkShikiHighlighter, ShikiTheme } from '@mathstack/app-kit';
import { BasemapService } from './core/services/basemap.service';
import { ContentFilesService } from './core/services/content-files.service';
import { DataService } from './core/services/data.service';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'demo-app';
  private basemap = inject(BasemapService);
  private dataService = inject(DataService);
  public routerState = inject(RouterStateService);
  private highlighting = inject(AdkShikiHighlighter);
  private contentService = inject(ContentFilesService);

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighting.initialize([
      ShikiTheme.GitHubLight,
      ShikiTheme.CatppuccinLatte,
    ]);
    this.contentService.initialize();
  }

  ngAfterViewInit(): void {
    this.dataService.initData();
    this.basemap.initMap();
  }
}
