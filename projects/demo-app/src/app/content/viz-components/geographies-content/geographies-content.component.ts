import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { GeographiesExampleComponent } from './geographies-example/geographies-example.component';

@Component({
  selector: 'app-geographies-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    GeographiesExampleComponent,
  ],
  templateUrl: './geographies-content.component.html',
  styleUrls: [
    '../../core/examples.scss',
    './geographies-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeographiesContentComponent {}
