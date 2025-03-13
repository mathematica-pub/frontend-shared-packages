import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { CustomSortIconExampleTableComponent } from './custom-sort-table-example/custom-sort-table-example.component';
import { TableExampleComponent } from './table-example/table-example.component';

@Component({
  selector: 'app-table-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    CustomSortIconExampleTableComponent,
    TableExampleComponent,
    ContentContainerComponent,
    CustomSortIconExampleTableComponent,
  ],
  templateUrl: './table-content.component.html',
  styleUrls: ['../../examples.scss', './table-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContentComponent {}
