import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActiveHeadingService } from '../active-heading.service';
import { HtmlHeader } from '../documentation-display.service';

@Component({
  selector: 'hsi-adk-document-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-index.component.html',
  styleUrls: ['./document-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentIndexComponent {
  @Input() headings: HtmlHeader[] = [];
  @Output() activeHeading = new EventEmitter<{
    heading: HtmlHeader;
    event: KeyboardEvent | PointerEvent | MouseEvent | Event;
  }>();

  constructor(public activeHeadingService: ActiveHeadingService) {}

  setActiveHeading(
    event: KeyboardEvent | PointerEvent | MouseEvent | Event,
    heading: HtmlHeader
  ): void {
    this.activeHeading.emit({ heading, event });
  }

  scrollToTop(): void {
    this.activeHeadingService.scrollToTop();
  }
}
