import { Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DocumentationTypeOption } from '../../core/enums/documentation.enums';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-component-documentation',
  templateUrl: './component-documentation.component.html',
  styleUrls: ['./component-documentation.component.scss', 
    './styles/bootstrap-card.css', 
    './styles/bootstrap.min.css', 
    './styles/compodoc.scss', 
    './styles/ionicons.min.css', 
    './styles/laravel.scss', 
    './styles/reset.css', 
    // './styles/style.css', 
    './styles/tablesort.css', 
  ],
  encapsulation: ViewEncapsulation.None
})
export class ComponentDocumentationComponent implements OnInit {
  @Input() documentation: DocumentationTypeOption;
  sanitizedDocumentation: SafeHtml;

  constructor(
    private highlightService: HighlightService, 
    private documentationService: DocumentationService, 
    private sanitizer: DomSanitizer,
    private zone: NgZone) { }

  ngOnInit(): void {
    this.documentationService.getDocumentationByName(this.documentation).subscribe((data: string) => {
      this.sanitizedDocumentation = this.sanitizer.bypassSecurityTrustHtml(data);
      setTimeout(() => {
        this.highlightService.highlightAll();
        this.addClickListenersToTabs();
        this.addClickListenersToCodeLinks();
      }, 0);
      
    });
  }

  addClickListenersToTabs(): void {
    document.querySelectorAll("[role=tab]").forEach((element) => element.addEventListener("click", this.activateTab.bind(this)))
  }

  addClickListenersToCodeLinks(): void {
    document.querySelectorAll(".link-to-prism").forEach((element) => element.addEventListener("click", this.activateCodeTab.bind(this)))
  }

  activateTab(event): void {
    this.activateTabUsingElement(event.target);
  }

  activateTabUsingElement(element): void {
    document.querySelectorAll("[role=tab]").forEach((element) => 
      element.parentElement.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach((element) => 
      element.classList.remove("active", "in"));
    element.parentElement.classList.add("active"); // activate current tab! 
    var id: string = element.id;
    id = "c-" + id.replace("-tab", "");
    document.getElementById(id).classList.add("active", "in");
  }

  activateCodeTab(event): void {
    event.preventDefault();
    this.activateTabUsingElement(document.getElementById('source-tab'));
  }
}
