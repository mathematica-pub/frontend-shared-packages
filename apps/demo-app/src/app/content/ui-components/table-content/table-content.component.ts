import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { TanstackExampleComponent } from './tanstack-example/tanstack-example.component';

@Component({
  selector: 'app-table-content',
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    TanstackExampleComponent,
    ContentContainerComponent,
    TableExampleComponent,
  ],
  templateUrl: './table-content.component.html',
  styleUrls: [
    '../../examples.scss',
    '../../api-documentation.scss',
    './table-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableContentComponent {}
