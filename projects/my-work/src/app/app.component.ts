import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  HsiAdkDocumentationDisplayService,
  ShikiHighlighterService,
  ShikiTheme,
} from 'projects/app-dev-kit/src/public-api';
import { distinctUntilChanged, filter, map, take } from 'rxjs';
import { DirectoryConfigService } from './core/services/directory-config.service';
import { RouterStateService } from './core/services/router-state/router-state.service';
import { Section } from './core/services/router-state/state';
import { SidebarComponent } from './platform/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AsyncPipe],
  providers: [HsiAdkDocumentationDisplayService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'HSI Static Charts';

  constructor(
    public routerState: RouterStateService,
    private highlighter: ShikiHighlighterService,
    private documentationService: HsiAdkDocumentationDisplayService,
    private configService: DirectoryConfigService
  ) {}

  ngOnInit(): void {
    this.routerState.initialize();
    this.highlighter.initialize([ShikiTheme.CatppuccinLatte]);
    this.initDocumentationService();
  }

  initDocumentationService(): void {
    const contentPath$ = this.routerState.state$.pipe(
      filter(
        (state) =>
          !!state.section &&
          state.section === Section.Docs &&
          !!state.contentPath
      ),
      map((state) => state.contentPath),
      distinctUntilChanged()
    );

    this.configService.docsConfig$
      .pipe(
        filter((config) => !!config),
        take(1)
      )
      .subscribe((config) => {
        this.documentationService.initialize(
          contentPath$,
          config,
          ShikiTheme.CatppuccinLatte
        );
      });
  }
}
