import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveHeadingService } from '../../core/services/active-heading.service';
import { DirectoryConfigService } from '../../core/services/directory-config.service';
import { ShikiTheme } from '../../core/services/shiki-highligher';
import { DocumentIndexComponent } from './document-index/document-index.component';
import {
  DocumentationHtmlService,
  GfmHeader,
  ParsedDocumentation,
} from './documentation.service';
import { NavigationSiblingsComponent } from './navigation-siblings/navigation-siblings.component';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, DocumentIndexComponent, NavigationSiblingsComponent],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentationComponent implements OnInit, AfterViewInit {
  @ViewChild('file') file: ElementRef<HTMLDivElement>;
  docsPath = '/assets/documentation/';
  content$: Observable<ParsedDocumentation>;

  constructor(
    private docsService: DocumentationHtmlService,
    public configsService: DirectoryConfigService,
    private activeHeadingService: ActiveHeadingService,
    private destroyRef: DestroyRef,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngAfterViewInit(): void {
    this.activeHeadingService.initScrollListener(this.destroyRef);
  }

  setContent(): void {
    this.content$ = this.docsService.getContentForCurrentContentPath({
      theme: ShikiTheme.CatppuccinLatte,
    });
  }

  scrollToHeading(update: {
    heading: GfmHeader;
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
}
