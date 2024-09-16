import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AdkAssetsService,
  AdkDocumentationConfigParser,
  AdkDocumentationDisplayService,
  ShikiHighlighterService,
  ShikiTheme,
} from 'projects/app-dev-kit/src/public-api';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  providers: [
    AdkDocumentationDisplayService,
    AdkAssetsService,
    AdkDocumentationConfigParser,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  constructor(
    public routerState: RouterStateService,
    private highlighter: ShikiHighlighterService,
    private documentationService: AdkDocumentationDisplayService
  ) {}

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighter.initialize([ShikiTheme.CatppuccinLatte]);
    this.documentationService.initialize({
      shikiTheme: ShikiTheme.CatppuccinLatte,
    });
  }
}
