import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { HighlightService } from '../core/services/highlight.service';
import { OverviewResource } from './overview.resource';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  html$: Observable<SafeHtml>;

  constructor(
    private resource: OverviewResource,
    private sanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
    private highlight: HighlightService
  ) {}

  ngOnInit(): void {
    this.setHtml();
    this.html$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.activateCodeHighlighting();
    });
  }

  setHtml(): void {
    this.html$ = this.resource
      .getOverviewHtml()
      .pipe(map((html) => this.sanitizer.bypassSecurityTrustHtml(html)));
  }

  activateCodeHighlighting(): void {
    setTimeout(() => {
      this.highlight.highlightAll();
    }, 0);
  }
}
