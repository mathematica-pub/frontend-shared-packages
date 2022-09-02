import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  Documentation,
  DocumentationType,
} from '../../core/enums/documentation.enums';
import { DocumentationService } from '../../core/services/documentation.service';
import { HighlightService } from '../../core/services/highlight.service';

@Component({
  selector: 'app-component-documentation',
  templateUrl: './component-documentation.component.html',
  styleUrls: [
    './component-documentation.component.scss',
    './styles/bootstrap-card.scss',
    './styles/bootstrap.scss',
    './styles/compodoc.scss',
    './styles/reset.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentDocumentationComponent implements OnInit {
  @ViewChild('docsDiv', { static: true }) docsDiv: ElementRef<HTMLDivElement>;

  sanitizedDocumentation: SafeHtml;
  private highlightService = inject(HighlightService);
  private documentationService = inject(DocumentationService);
  private sanitizer = inject(DomSanitizer);
  router = inject(Router);
  route: string;

  ngOnInit(): void {
    this.route = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.documentationService
      .getDocumentation(Documentation.Bars)
      .subscribe((data: string) => {
        this.sanitizedDocumentation =
          this.sanitizer.bypassSecurityTrustHtml(data);
        setTimeout(() => {
          this.highlightService.highlightAll();
          this.addClickListenersToTabs();
          this.addClickListenersToCodeLinks();
        }, 0);
      });
  }

  addClickListenersToTabs(): void {
    this.docsDiv.nativeElement
      .querySelectorAll('[role=tab]')
      .forEach((element) =>
        element.addEventListener('click', this.activateTab.bind(this))
      );
  }

  addClickListenersToCodeLinks(): void {
    this.docsDiv.nativeElement
      .querySelectorAll('.link-to-prism')
      .forEach((element) =>
        element.addEventListener('click', this.activateCodeTab.bind(this))
      );
  }

  activateTab(event): void {
    this.activateTabUsingElement(event.target);
  }

  activateTabUsingElement(element): void {
    this.docsDiv.nativeElement
      .querySelectorAll('[role=tab]')
      .forEach((element) => element.parentElement.classList.remove('active'));
    this.docsDiv.nativeElement
      .querySelectorAll('.tab-pane')
      .forEach((element) => element.classList.remove('active', 'in'));
    element.parentElement.classList.add('active');
    const id = 'c-' + element.id.replace('-tab', '');
    document.getElementById(id).classList.add('active', 'in');
  }

  activateCodeTab(event): void {
    event.preventDefault();
    this.activateTabUsingElement(document.getElementById('source-tab'));
  }
}
