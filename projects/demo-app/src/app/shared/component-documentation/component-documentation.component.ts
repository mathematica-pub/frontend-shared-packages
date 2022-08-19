import { AfterViewChecked, Component, ElementRef, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-component-documentation',
  templateUrl: './component-documentation.component.html',
  styleUrls: ['./component-documentation.component.scss', 
    './styles/bootstrap-card.css', 
    './styles/bootstrap.min.css', 
    './styles/compodoc.css', 
    './styles/ionicons.min.css', 
    './styles/laravel.css', 
    './styles/reset.css', 
    // './styles/style.css', 
    './styles/tablesort.css', 
  ],
  encapsulation: ViewEncapsulation.None
})
export class ComponentDocumentationComponent implements OnInit, AfterViewChecked {
  documentation$: Observable<SafeHtml>;
  highlighted = false;

  constructor(private highlightService: HighlightService, private documentationService: DocumentationService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.documentation$ = this.documentationService.documentationData$.pipe(
      map((x) => this.sanitizer.bypassSecurityTrustHtml(x))
    );
  }

  ngAfterViewChecked() {
    if (this.documentation$ && !this.highlighted) {
      this.highlightService.highlightAll();
      this.highlighted = true;
    }
  }

  highlightMe() {
    console.log("yep i been clicked");
    this.highlightService.highlightAll();
  }
}
