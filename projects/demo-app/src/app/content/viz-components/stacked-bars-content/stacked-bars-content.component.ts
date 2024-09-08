import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { StackedBarsExampleComponent } from './stacked-bars-example/stacked-bars-example.component';

@Component({
  selector: 'app-stacked-bars-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    StackedBarsExampleComponent,
  ],
  templateUrl: './stacked-bars-content.component.html',
  styleUrls: ['../examples.scss', './stacked-bars-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedBarsContentComponent {}
