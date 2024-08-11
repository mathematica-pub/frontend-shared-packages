import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../example-display/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../example-display/split-panel-example-display/split-panel-example-display.component';
import { StackedBarsExampleComponent } from './stacked-bars-example/stacked-bars-example.component';

@Component({
  selector: 'app-stacked-bars-documentation',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    StackedBarsExampleComponent,
  ],
  templateUrl: './stacked-bars-documentation.component.html',
  styleUrls: [
    '../examples.scss',
    './stacked-bars-documentation.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedBarsDocumentationComponent {}
