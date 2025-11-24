import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { GeographiesExampleComponent } from './geographies-example/geographies-example.component';

@Component({
  selector: 'app-geographies-content',
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    GeographiesExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './geographies-content.component.html',
  styleUrls: ['../../examples.scss', './geographies-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeographiesContentComponent {}
