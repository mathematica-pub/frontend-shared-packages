import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { FileResource } from '../../../core/resources/file.resource';
import { HighlightService } from '../../../core/services/highlight.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit, OnChanges {
  // passed in with routerBinding;
  @Input() lib: string;
  html$: Observable<SafeHtml>;
  route: string;

  constructor(
    private files: FileResource,
    private sanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
    private highlight: HighlightService
  ) {}

  ngOnInit(): void {
    this.html$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.activateCodeHighlighting();
    });
  }

  ngOnChanges(): void {
    this.setHtml();
  }

  setHtml(): void {
    const filePath = `assets/${this.lib}/content/overview.md`;
    this.html$ = this.files
      .getMarkdownFile(filePath)
      .pipe(map((html) => this.sanitizer.bypassSecurityTrustHtml(html)));
  }

  activateCodeHighlighting(): void {
    setTimeout(() => {
      this.highlight.highlightAll();
    }, 0);
  }
}
