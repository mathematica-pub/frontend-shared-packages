import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { StackedAreaExampleComponent } from './stacked-area-example/stacked-area-example.component';

@Component({
  selector: 'app-stacked-area-documentation',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    StackedAreaExampleComponent,
  ],
  templateUrl: './stacked-area-documentation.component.html',
  styleUrls: [
    '../examples.scss',
    './stacked-area-documentation.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedAreaDocumentationComponent {}
