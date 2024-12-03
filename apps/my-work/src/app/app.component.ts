import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AdkAssetsService,
  AdkDocumentationConfigParser,
  AdkDocumentationContentService,
  AdkMarkdownParser,
  AdkShikiHighlighter,
  ShikiTheme,
} from '@hsi/app-dev-kit';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  providers: [
    AdkDocumentationContentService,
    AdkAssetsService,
    AdkDocumentationConfigParser,
    AdkMarkdownParser,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  constructor(
    public routerState: RouterStateService,
    private highlighting: AdkShikiHighlighter
  ) {}

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighting.initialize([
      ShikiTheme.CatppuccinLatte,
      ShikiTheme.GitHubLight,
    ]);
  }
}
