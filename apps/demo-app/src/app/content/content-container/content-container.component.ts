import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Inject,
  NgZone,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AdkActiveHeadingTracker,
  AdkDocumentationDisplayComponent,
  AdkHtmlHeader,
  AdkParsedDocumentation,
  DocumentIndexComponent,
} from '@hsi/app-dev-kit';
import { Observable } from 'rxjs';
import { ContentFilesService } from '../../core/services/content-files.service';

@Component({
  selector: 'app-content-container',
  standalone: true,
  imports: [
    CommonModule,
    AdkDocumentationDisplayComponent,
    DocumentIndexComponent,
    ContentContainerComponent,
  ],
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContentContainerComponent implements AfterViewInit {
  @ViewChild('file') file: ElementRef<HTMLDivElement>;
  content$: Observable<AdkParsedDocumentation>;
  @ContentChild('escapedContent', { static: false })
  escapedContentTemplateRef: TemplateRef<unknown>;

  constructor(
    public contentService: ContentFilesService,
    private activeHeading: AdkActiveHeadingTracker,
    private zone: NgZone,
    private destroyRef: DestroyRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    this.activeHeading.initScrollListener(
      this.file.nativeElement,
      this.destroyRef
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
}
