import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShikiTheme } from '@mathstack/app-kit';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  withLatestFrom,
} from 'rxjs';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';
import { AutomatedDocumentationParser } from './automated-documentation-parser.service';

@Component({
  selector: 'app-automated-documentation-display',
  imports: [CommonModule],
  templateUrl: './automated-documentation-display.component.html',
  styleUrls: [
    './automated-documentation-display.component.scss',
    './styles/bootstrap-card.scss',
    './styles/bootstrap.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AutomatedDocumentationDisplayComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('docsDiv', { static: true }) docsDiv: ElementRef<HTMLDivElement>;
  sanitizedDocumentation: SafeHtml;
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  route: string;
  content$: Observable<SafeHtml>;
  contentPath$: Observable<string>;
  shikiTheme = ShikiTheme.GitHubLight;

  constructor(
    private routerState: RouterStateService,
    private automatedDocsParser: AutomatedDocumentationParser
  ) {}

  ngOnInit(): void {
    this.contentPath$ = this.routerState.state$.pipe(
      filter((state) => !!state.lib && !!state.contentPath),
      map((state) => ({ lib: state.lib, contentPath: state.contentPath })),
      distinctUntilChanged((prev, curr) => {
        // Don't make new API call if all that changed is the tab within the page, as indicated by the stuff after the hash
        return (
          prev.lib === curr.lib &&
          prev.contentPath.split('#')[0] === curr.contentPath.split('#')[0]
        );
      }),
      map((state) => {
        // strip off hash so that on reload, it just loads the front page
        return `${state.lib}/${Section.Documentation}/${state.contentPath}`;
      })
    );

    this.content$ = this.automatedDocsParser.getContentForCurrentContentPath(
      this.contentPath$,
      this.shikiTheme
    );
  }

  ngAfterViewInit(): void {
    this.content$
      .pipe(withLatestFrom(this.contentPath$))
      .subscribe(([, contentPath]) => {
        setTimeout(() => {
          this.addClickListenersToTabs(contentPath);
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
