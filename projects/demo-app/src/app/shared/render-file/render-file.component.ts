import {
  AfterViewInit,
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
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-render-file',
  templateUrl: './render-file.component.html',
  styleUrls: ['./render-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RenderFileComponent implements OnChanges, OnInit {
  @Input('filePath') filePath: string;
  @ViewChild('fileDiv', { static: true }) fileDiv: ElementRef<HTMLDivElement>;
  private highlightService = inject(HighlightService);
  private documentationService = inject(DocumentationService);
  private sanitizer = inject(DomSanitizer);
  sanitizedDocumentation: SafeHtml;
  currentSubscription$: Subscription;

  ngOnInit(): void {
    this.createOrUpdateSubscription();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filePath']) {
      this.createOrUpdateSubscription();
    }
  }

  createOrUpdateSubscription(): void {
    let path = this.filePath;
    if (this.filePath === undefined) {
      path = 'Overview.md';
    }
    if (this.currentSubscription$ !== undefined) {
      this.currentSubscription$.unsubscribe();
    }
    this.currentSubscription$ = this.documentationService
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
