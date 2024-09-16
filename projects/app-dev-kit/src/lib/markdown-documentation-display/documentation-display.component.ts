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
import { ActiveHeadingService } from './active-heading.service';
import { DocumentIndexComponent } from './document-index/document-index.component';
import { AdkNestedObject } from './documentation-config-parser.service';
import {
  AdkDocumentationDisplayService,
  HtmlHeader,
  ParsedDocumentation,
} from './documentation-display.service';
import { NavigationSiblingsComponent } from './navigation-siblings/navigation-siblings.component';

@Component({
  selector: 'hsi-adk-documentation-display',
  standalone: true,
  imports: [CommonModule, DocumentIndexComponent, NavigationSiblingsComponent],
  templateUrl: './documentation-display.component.html',
  styleUrls: ['./documentation-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AdkDocumentationDisplayComponent implements OnInit, AfterViewInit {
  @Input() contentPath$: Observable<string>;
  @Input() fileConfig: AdkNestedObject;
  @Input() pathFromAssetsToFile: string;
  @Output() nextDoc: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('file') file: ElementRef<HTMLDivElement>;
  content$: Observable<ParsedDocumentation>;
  @ContentChild('component', { static: false })
  componentTemplateRef: TemplateRef<unknown>;

  constructor(
    private docsService: AdkDocumentationDisplayService,
    private activeHeadingService: ActiveHeadingService,
    private destroyRef: DestroyRef,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngAfterViewInit(): void {
    this.activeHeadingService.initScrollListener(
      this.file.nativeElement,
      this.destroyRef
    );
  }

  setContent(): void {
    this.content$ = this.docsService.getContentForCurrentContentPath(
      this.contentPath$,
      this.fileConfig,
      this.pathFromAssetsToFile
    );
  }

  scrollToHeading(update: {
    heading: HtmlHeader;
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
    this.activeHeadingService.setActiveHeading(item as HTMLHeadingElement);
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
