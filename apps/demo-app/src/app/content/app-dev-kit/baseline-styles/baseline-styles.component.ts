import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ContentContainerComponent } from '../../content-container/content-container.component';

@Component({
  selector: 'app-baseline-styles',
  imports: [CommonModule, ContentContainerComponent],
  templateUrl: './baseline-styles.component.html',
  styleUrl: './baseline-styles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BaselineStylesComponent {}
