import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ContentContainerComponent } from '../../content-container/content-container.component';

@Component({
  selector: 'app-no-examples-content',
  standalone: true,
  imports: [CommonModule, ContentContainerComponent],
  templateUrl: './no-examples-content.component.html',
  styleUrls: [
    '../../api-documentation.scss',
    './no-examples-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NoExamplesContentComponent {}
