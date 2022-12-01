import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { Subscription, takeUntil } from 'rxjs';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-render-file',
  templateUrl: './render-file.component.html',
  styleUrls: ['./render-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenderFileComponent
  extends Unsubscribe
  implements OnChanges, OnInit
{
  @Input() fileData: string;
  @ViewChild('fileDiv', { static: true }) fileDiv: ElementRef<HTMLDivElement>;
  private highlightService = inject(HighlightService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private documentationService = inject(DocumentationService);
  sanitizedDocumentation: SafeHtml;
  currentSubscription$: Subscription;

  ngOnInit(): void {
    if (this.router.url === '/overview') {
      const path = 'Overview.md';
      this.currentSubscription$ = this.documentationService
        .getDocumentation(path)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data: string) => {
          this.sanitizeAndHighlight(data);
        });
    } else {
      this.sanitizeAndHighlight(this.fileData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileData']) {
      this.sanitizeAndHighlight(this.fileData);
    }
  }

  sanitizeAndHighlight(data: string): void {
    this.sanitizedDocumentation = this.sanitizer.bypassSecurityTrustHtml(data);
    setTimeout(() => {
      this.highlightService.highlightAll();
    }, 0);
  }
}
