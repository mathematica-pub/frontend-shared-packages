import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { DocumentationFilesService } from '../core/services/documentation-files.service';
import { HighlightService } from '../core/services/highlight.service';
import { RouterStateService } from '../core/services/router-state/router-state.service';

@Component({
  selector: 'app-automated-documentation-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automated-documentation-display.component.html',
  styleUrls: [
    './automated-documentation-display.component.scss',
    './styles/bootstrap-card.scss',
    './styles/bootstrap.scss',
    './styles/compodoc.scss',
    './styles/reset.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AutomatedDocumentationDisplayComponent implements OnInit {
  @ViewChild('docsDiv', { static: true }) docsDiv: ElementRef<HTMLDivElement>;
  sanitizedDocumentation: SafeHtml;
  private highlightService = inject(HighlightService);
  private filesService = inject(DocumentationFilesService);
  private sanitizer = inject(DomSanitizer);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  route: string;

  constructor(private routerState: RouterStateService) {}

  ngOnInit(): void {
    this.routerState.state$
      .pipe(
        switchMap((state) => {
          const path = `/documentation/${state.lib}/${state.contentPath}`;
          return this.filesService.getDocumentation(path);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
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

    Array.from(
      this.docsDiv.nativeElement.querySelectorAll('[role=tab]')
    )[0].parentElement.classList.add('active');
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
    const id = element.id.replace('-tab', '');
    document.getElementById(id).classList.add('active', 'in');
  }

  activateCodeTab(event): void {
    event.preventDefault();
    this.activateTabUsingElement(document.getElementById('source-tab'));
  }
}
