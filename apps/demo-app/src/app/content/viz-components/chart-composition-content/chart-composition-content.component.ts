import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { SmallMultiplesBarsExampleComponent } from './small-multiples-bars-example/small-multiples-bars-example.component';

@Component({
  selector: 'app-chart-composition-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    SmallMultiplesBarsExampleComponent,
  ],
  templateUrl: './chart-composition-content.component.html',
  styleUrls: [
    '../../examples.scss',
    '../../api-documentation.scss',
    './chart-composition-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChartCompositionContentComponent {}
