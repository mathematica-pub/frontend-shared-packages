import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AdkAssetsService,
  AdkDocumentationConfigParser,
  AdkDocumentationContentService,
  AdkMarkdownParser,
  AdkShikiHighlighter,
  ShikiTheme,
} from '@mathstack/app-kit';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  providers: [
    AdkDocumentationContentService,
    AdkAssetsService,
    AdkDocumentationConfigParser,
    AdkMarkdownParser,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  public routerState = inject(RouterStateService);
  private highlighting = inject(AdkShikiHighlighter);

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighting.initialize([
      ShikiTheme.CatppuccinLatte,
      ShikiTheme.GitHubLight,
    ]);
  }
}
