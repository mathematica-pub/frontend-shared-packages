import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
import { takeUntil } from 'rxjs';
import { DocumentationService } from '../core/services/documentation.service';
import { HighlightService } from '../core/services/highlight.service';

@Component({
  selector: 'app-render-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './render-file.component.html',
  styleUrls: ['./render-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenderFileComponent
  extends Unsubscribe
  implements OnChanges, OnInit
{
  @Input() fileData: string;
  private highlightService = inject(HighlightService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private documentationService = inject(DocumentationService);
  sanitizedDocumentation: SafeHtml;
  class: string;

  ngOnInit(): void {
    if (this.router.url === '/overview') {
      const path = 'OVERVIEW.md';
      this.class = 'overview';
      this.documentationService
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
