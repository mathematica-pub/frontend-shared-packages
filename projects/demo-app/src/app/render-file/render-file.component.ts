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
import { Unsubscribe } from 'projects/viz-components/src/lib/shared/unsubscribe.class';
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
  sanitizedDocumentation: SafeHtml;
  class: string;

  ngOnInit(): void {
    this.sanitizeAndHighlight(this.fileData);
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
