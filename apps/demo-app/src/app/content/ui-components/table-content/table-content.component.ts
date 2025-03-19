import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { TableExampleComponent } from './table-example/table-example.component';

@Component({
  selector: 'app-table-content',
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    TableExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './table-content.component.html',
  styleUrls: ['../../examples.scss', './table-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContentComponent {}
