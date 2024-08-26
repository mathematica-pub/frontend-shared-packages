import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { FileResource } from '../../core/resources/file.resource';
import {
  ConfigsService,
  FilesItem,
} from '../../core/services/content-config.service';
import { StateService } from '../../core/services/state/state.service';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationComponent implements OnInit {
  docsPath = '/assets/documentation/';
  html$: Observable<SafeHtml>;

  constructor(
    private routerState: StateService,
    private files: FileResource,
    private destroyRef: DestroyRef,
    private sanitizer: DomSanitizer,
    private configService: ConfigsService
  ) {}

  ngOnInit(): void {
    this.html$ = this.routerState.state$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((state) => !!state.section && !!state.contentPath),
      map((state) => state.contentPath),
      withLatestFrom(this.configService.docsConfig$),
      switchMap(([contentPath, config]) => {
        const pathParts = contentPath.split('/');
        const fileName = this.getFileNameFromConfig(config.items, pathParts);
        const path = `${this.docsPath}${fileName}`;
        return this.files.getMarkdownFile(path);
      }),
      map((content) => this.sanitizer.bypassSecurityTrustHtml(content))
    );
  }

  getFileNameFromConfig(config: FilesItem, pathParts: string[]): string {
    const fileName = pathParts.reduce((acc, part) => {
      const level = acc[part];
      acc = level;
      return acc;
    }, config);
    return fileName as string;
  }
}
