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
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { AssetsService } from '../core/services/assets.service';
import { HighlightService } from '../core/services/highlight.service';
import { RouterStateService } from '../core/services/router-state/router-state.service';
import { Section } from '../core/services/router-state/state';

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
  private assetsService = inject(AssetsService);
  private sanitizer = inject(DomSanitizer);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  route: string;

  constructor(private routerState: RouterStateService) {}

  ngOnInit(): void {
    this.routerState.state$
      .pipe(
        filter((state) => !!state.lib && !!state.contentPath),
        map((state) => ({ lib: state.lib, contentPath: state.contentPath })),
        distinctUntilChanged((prev, curr) => {
          // Don't make new API call if all that changed is the tab within the page, as indicated by the stuff after the hash
          return (
            prev.lib === curr.lib &&
            prev.contentPath.split('#')[0] === curr.contentPath.split('#')[0]
          );
        }),
        switchMap((state) => {
          // strip off hash so that on reload, it just loads the front page
          const path = `${state.lib}/${Section.Documentation}/${state.contentPath.split('#')[0]}.html`;
          return this.assetsService.getAsset(path);
        }),
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.routerState.state$)
      )
      .subscribe(([data, state]) => {
        this.sanitizedDocumentation =
          this.sanitizer.bypassSecurityTrustHtml(data);
        setTimeout(() => {
          this.highlightService.highlightAll();
          this.addClickListenersToTabs(state.contentPath);
          this.addClickListenersToCodeLinks();
        }, 0);
      });
  }

  addClickListenersToTabs(contentPath: string): void {
    this.docsDiv.nativeElement
      .querySelectorAll('[role=tab]')
      .forEach((element) =>
        element.addEventListener('click', this.activateTab.bind(this))
      );

    if (contentPath.includes('#')) {
      const id = `${contentPath.split('#')[1]}-tab`;
      this.activateTabUsingElement(
        this.docsDiv.nativeElement.querySelectorAll(`[role=tab]#${id}`)[0]
      );
    } else {
      Array.from(
        this.docsDiv.nativeElement.querySelectorAll('[role=tab]')
      )[0].parentElement.classList.add('active');
    }
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
