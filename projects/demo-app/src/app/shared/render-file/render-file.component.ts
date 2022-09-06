import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-render-file',
  templateUrl: './render-file.component.html',
  styleUrls: ['./render-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenderFileComponent implements AfterViewInit {
  @Input('filePath') filePath: string;
  @ViewChild('fileDiv', { static: true }) fileDiv: ElementRef<HTMLDivElement>;
  private highlightService = inject(HighlightService);
  private documentationService = inject(DocumentationService);
  private sanitizer = inject(DomSanitizer);
  sanitizedDocumentation: SafeHtml;
  // if filePath is null, grab the overview
  // else we expect parent to give us a path like:
  // src/bars/bars.component.ts
  ngAfterViewInit(): void {
    let path = this.filePath;
    if (this.filePath === undefined) {
      path = 'Overview.md';
    }
    this.documentationService
      .getDocumentation(path)
      .subscribe((data: string) => {
        this.sanitizedDocumentation =
          this.sanitizer.bypassSecurityTrustHtml(data);
        setTimeout(() => {
          this.highlightService.highlightAll();
        }, 0);
      });
  }
}
