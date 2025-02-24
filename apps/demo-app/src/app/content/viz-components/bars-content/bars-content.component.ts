import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { BarsExampleComponent } from './bars-example/bars-example.component';
import { BarsSimpleStatesExampleComponent } from './bars-simple-states-example/bars-simple-states-example.component';
import { BarsSmallMultiplesExampleComponent } from './bars-small-multiples-example/bars-small-multiples-example.component';

@Component({
  selector: 'app-bars-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    BarsExampleComponent,
    BarsSimpleStatesExampleComponent,
    ContentContainerComponent,
    BarsSmallMultiplesExampleComponent,
  ],
  templateUrl: './bars-content.component.html',
  styleUrls: [
    '../../examples.scss',
    '../../api-documentation.scss',
    './bars-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BarsContentComponent {}
