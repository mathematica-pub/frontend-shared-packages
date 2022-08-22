import { AfterViewChecked, ApplicationRef, Component, ElementRef, Input, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { DocumentationTypeOption } from '../../core/enums/documentation.enums';
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
export class ComponentDocumentationComponent implements OnInit {
  @Input() documentation: DocumentationTypeOption;
  sanitizedDocumentation: SafeHtml;

  constructor(private highlightService: HighlightService, private documentationService: DocumentationService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.documentationService.getDocumentationByName(this.documentation).subscribe((data: string) => {
      this.sanitizedDocumentation = this.sanitizer.bypassSecurityTrustHtml(data);
      setTimeout(() => {
        this.highlightService.highlightAll();
      }, 100);
    });
  }
}
