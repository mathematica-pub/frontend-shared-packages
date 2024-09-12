import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActiveHeadingService } from '../active-heading.service';
import { GfmHeader } from '../documentation-display.service';

@Component({
  selector: 'hsi-adk-document-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-index.component.html',
  styleUrls: ['./document-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentIndexComponent {
  @Input() headings: GfmHeader[] = [];
  @Output() activeHeading = new EventEmitter<{
    heading: GfmHeader;
    event: KeyboardEvent | PointerEvent | MouseEvent | Event;
  }>();

  constructor(public activeHeadingService: ActiveHeadingService) {}

  setActiveHeading(
    event: KeyboardEvent | PointerEvent | MouseEvent | Event,
    heading: GfmHeader
  ): void {
    this.activeHeading.emit({ heading, event });
  }

  scrollToTop(): void {
    this.activeHeadingService.scrollToTop();
  }
}
