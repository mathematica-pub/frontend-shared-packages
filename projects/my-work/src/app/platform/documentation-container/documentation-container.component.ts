import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AdkDocumentationDisplayComponent,
  AdkNestedObject,
} from 'projects/app-dev-kit/src/public-api';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { DirectoryConfigService } from '../../core/services/directory-config.service';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';

@Component({
  selector: 'app-documentation-container',
  standalone: true,
  imports: [CommonModule, AdkDocumentationDisplayComponent],
  templateUrl: './documentation-container.component.html',
  styleUrl: './documentation-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationContainerComponent implements OnInit {
  contentPath$: Observable<string>;
  fileConfig: AdkNestedObject;

  constructor(
    private routerState: RouterStateService,
    private configService: DirectoryConfigService
  ) {}

  ngOnInit(): void {
    this.setFileConfig();
    this.setContentPath();
  }

  setFileConfig(): void {
    this.configService.docsConfig$
      .pipe(
        filter((config) => !!config),
        take(1)
      )
      .subscribe((config) => {
        this.fileConfig = config.items;
      });
  }

  setContentPath(): void {
    this.contentPath$ = this.routerState.state$.pipe(
      filter(
        (state) =>
          !!state.section &&
          state.section === Section.Docs &&
          !!state.contentPath
      ),
      map((state) => state.contentPath),
      distinctUntilChanged()
    );
  }

  navigateToDoc(path: string): void {
    this.routerState.update({ section: Section.Docs, contentPath: path });
  }
}
