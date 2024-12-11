import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ShikiTheme } from '../content-parsing';
import { AdkActiveHeadingTracker } from './active-heading-tracker';
import { AdkDocumentIndexComponent } from './document-index/document-index.component';
import { AdkNestedObject } from './documentation-config-parser';
import {
  AdkDocumentationContentService,
  AdkHtmlHeader,
  AdkParsedDocumentation,
} from './documentation-content-service';
import { NavigationSiblingsComponent } from './navigation-siblings/navigation-siblings.component';

@Component({
  selector: 'hsi-adk-documentation-display',
  standalone: true,
  imports: [
    CommonModule,
    AdkDocumentIndexComponent,
    NavigationSiblingsComponent,
  ],
  templateUrl: './documentation-display.component.html',
  styleUrls: ['./documentation-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AdkDocumentationDisplayComponent implements OnInit, AfterViewInit {
  /**
   * Observable that emits the current content path
   */
  @Input() contentPath$: Observable<string>;
  @Input() fileConfig: AdkNestedObject;
  @Input() highlightTheme: ShikiTheme;
  @Input() pathFromAssetsToFile: string;
  @Input() showPrevNextNavigation = true;
  @Output() nextDoc: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('file') file: ElementRef<HTMLDivElement>;
  content$: Observable<AdkParsedDocumentation>;
  @ContentChild('escapedContent', { static: false })
  escapedContentTemplateRef: TemplateRef<unknown>;

  constructor(
    private content: AdkDocumentationContentService,
    private activeHeading: AdkActiveHeadingTracker,
    private destroyRef: DestroyRef,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngAfterViewInit(): void {
    this.activeHeading.initScrollListener(
      this.file.nativeElement,
      this.destroyRef
    );
  }

  setContent(): void {
    this.content$ = this.content.getContentForCurrentContentPath(
      this.contentPath$,
      {
        fileConfig: this.fileConfig,
        basePath: this.pathFromAssetsToFile,
        parsingOptions: {
          highlighter: {
            theme: this.highlightTheme,
          },
        },
      }
    );
  }

  scrollToHeading(update: {
    heading: AdkHtmlHeader;
    event: KeyboardEvent | PointerEvent | MouseEvent | Event;
  }): void {
    const targetHeading = this.file.nativeElement.querySelector(
      `#${update.heading.id}`
    ) as HTMLHeadingElement;
    targetHeading.focus();
    this.scrollToItemById(
      targetHeading,
      (update.event as KeyboardEvent).key === 'Enter'
    );
  }

  scrollToItemById(
    item: HTMLHeadingElement,
    needsChangeDetection = false
  ): void {
    this.activeHeading.setActiveHeading(item as HTMLHeadingElement);
    const currentOffset = item.offsetTop;
    if (needsChangeDetection) {
      this.zone.run(() => {
        this.scrollToItem(currentOffset);
      });
    } else {
      this.scrollToItem(currentOffset);
    }
  }

  scrollToItem(top: number): void {
    this.document.getElementsByTagName('HTML')[0].scrollTo({
      top,
      behavior: 'smooth',
    });
  }

  navigateToDoc(sibling: string): void {
    this.nextDoc.emit(sibling);
  }
}
