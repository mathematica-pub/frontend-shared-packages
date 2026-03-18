import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { AdkActiveHeadingTracker } from '../active-heading-tracker';
import { AdkHtmlHeader } from '../documentation-content-service';

@Component({
  selector: 'hsi-adk-document-index',
  imports: [CommonModule],
  templateUrl: './document-index.component.html',
  styleUrls: ['./document-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdkDocumentIndexComponent {
  @Input() headings: AdkHtmlHeader[] = [];
  @Output() activeHeading = new EventEmitter<{
    heading: AdkHtmlHeader;
    event: KeyboardEvent | PointerEvent | MouseEvent | Event;
  }>();

  public activeHeadingTracker = inject(AdkActiveHeadingTracker);

  setActiveHeading(
    event: KeyboardEvent | PointerEvent | MouseEvent | Event,
    heading: AdkHtmlHeader
  ): void {
    this.activeHeading.emit({ heading, event });
  }

  scrollToTop(): void {
    this.activeHeadingTracker.scrollToTop();
  }
}
