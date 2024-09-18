import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { TableExampleComponent } from './table-example/table-example.component';

@Component({
  selector: 'app-table-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    TableExampleComponent,
  ],
  templateUrl: './table-content.component.html',
  styleUrls: ['../examples.scss', './table-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContentComponent {}
