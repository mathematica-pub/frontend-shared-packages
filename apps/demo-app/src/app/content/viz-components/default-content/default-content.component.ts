import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ContentContainerComponent } from '../../content-container/content-container.component';

@Component({
  selector: 'app-default-content',
  imports: [CommonModule, ContentContainerComponent],
  templateUrl: './default-content.component.html',
  styleUrls: [
    '../../api-documentation.scss',
    './default-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DefaultContentComponent {}
