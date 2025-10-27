import { Injectable } from '@angular/core';
import {
  AdkDocumentationContentService,
  AdkNestedObject,
  AdkParsedDocumentation,
  ShikiTheme,
} from '@mathstack/app-kit';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ContentConfigService } from './content-config.service';
import { RouterStateService } from './router-state/router-state.service';
import { Library, Section } from './router-state/state';

@Injectable({ providedIn: 'root' })
export class ContentFilesService {
  contentPath$: Observable<string>;
  fileConfig$: Observable<{ config: AdkNestedObject; lib: Library }>;
  highlightTheme = ShikiTheme.CatppuccinLatte;
  content$: Observable<AdkParsedDocumentation>;

  constructor(
    private routerState: RouterStateService,
    public configsService: ContentConfigService,
    private adkContentService: AdkDocumentationContentService
  ) {}

  initialize(): void {
    this.setFileConfig();
    this.setContentPath();
    this.setContent();
  }

  setFileConfig(): void {
    this.fileConfig$ = combineLatest([
      this.configsService.config$.pipe(
        filter((config) => !!config),
        take(1)
      ),
      this.routerState.state$.pipe(
        map((state) => state.lib),
        distinctUntilChanged()
      ),
    ]).pipe(
      map(([config, lib]) => ({ config: config[lib].items, lib: lib })),
      shareReplay(1)
    );
  }

  setContentPath(): void {
    this.contentPath$ = this.routerState.state$.pipe(
      filter(
        (state) =>
          !!state.section &&
          state.section === Section.Content &&
          !!state.contentPath
      ),
      map((state) => state.contentPath),
      distinctUntilChanged()
    );
  }

  setContent(): void {
    this.content$ = this.fileConfig$.pipe(
      switchMap((config) =>
        this.adkContentService.getContentForCurrentContentPath(
          this.contentPath$,
          {
            fileConfig: config.config,
            basePath: `${config.lib}/content`,
            parsingOptions: {
              highlighter: {
                theme: this.highlightTheme,
              },
            },
          }
        )
      )
    );
  }
}
