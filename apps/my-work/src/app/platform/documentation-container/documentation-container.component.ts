import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AdkDocumentationDisplayComponent,
  AdkNestedObject,
  ShikiTheme,
} from '@mathstack/app-kit';
import { distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { DirectoryConfigsService } from '../../core/services/directory-config.service';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';

@Component({
  selector: 'app-documentation',
  imports: [CommonModule, AdkDocumentationDisplayComponent],
  templateUrl: './documentation-container.component.html',
  styleUrls: ['./documentation-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationContainerComponent implements OnInit {
  contentPath$: Observable<string>;
  fileConfig: AdkNestedObject;
  highlightTheme = ShikiTheme.CatppuccinLatte;
  pathFromAssetsToFile = 'documentation';

  constructor(
    private routerState: RouterStateService,
    public configsService: DirectoryConfigsService
  ) {}

  ngOnInit(): void {
    this.setFileConfig();
    this.setContentPath();
  }

  setFileConfig(): void {
    this.configsService.docsConfig$
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
