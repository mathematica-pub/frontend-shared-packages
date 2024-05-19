import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { Observable, map } from 'rxjs';
import { DocumentationService } from '../core/services/documentation.service';
import { HighlightService } from '../core/services/highlight.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent extends Unsubscribe implements OnInit {
  private documentationService = inject(DocumentationService);
  private highlightService = inject(HighlightService);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);
  sanitizedDocumentation$: Observable<SafeHtml>;

  ngOnInit(): void {
    this.sanitizedDocumentation$ = this.documentationService
      .getOverview()
      .pipe(
        map((data: string) => this.sanitizer.bypassSecurityTrustHtml(data))
      );

    this.sanitizedDocumentation$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        setTimeout(() => {
          this.highlightService.highlightAll();
        });
      });
  }
}
