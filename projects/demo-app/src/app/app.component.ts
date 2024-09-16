import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AdkDocumentationConfigParser,
  AdkDocumentationDisplayService,
  ShikiHighlighterService,
  ShikiTheme,
} from 'projects/app-dev-kit/src/public-api';
import { BasemapService } from './core/services/basemap.service';
import { DataService } from './core/services/data.service';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  providers: [AdkDocumentationDisplayService, AdkDocumentationConfigParser],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'demo-app';

  constructor(
    private basemap: BasemapService,
    private dataService: DataService,
    public routerState: RouterStateService,
    private documentationService: AdkDocumentationDisplayService,
    private highlighter: ShikiHighlighterService
  ) {}

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighter.initialize([ShikiTheme.CatppuccinLatte]);
    this.documentationService.initialize({
      shikiTheme: ShikiTheme.CatppuccinLatte,
    });
  }

  ngAfterViewInit(): void {
    this.dataService.initData();
    this.basemap.initMap();
  }
}
