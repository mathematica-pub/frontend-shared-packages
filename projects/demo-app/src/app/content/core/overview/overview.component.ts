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
import { AssetsService } from '../../../core/services/assets.service';
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
    private sanitizer: DomSanitizer,
    private destroyRef: DestroyRef,
    private highlight: HighlightService,
    private assets: AssetsService
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
    const filePath = `${this.lib}/content/overview.md`;
    this.html$ = this.assets
      .getAsset(filePath, 'md')
      .pipe(map((html) => this.sanitizer.bypassSecurityTrustHtml(html)));
  }

  activateCodeHighlighting(): void {
    setTimeout(() => {
      this.highlight.highlightAll();
    }, 0);
  }
}
