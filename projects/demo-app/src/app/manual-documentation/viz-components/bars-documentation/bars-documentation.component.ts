import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { BarsExampleComponent } from './bars-example/bars-example.component';

@Component({
  selector: 'app-bars-documentation',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    BarsExampleComponent,
  ],
  templateUrl: './bars-documentation.component.html',
  styleUrls: ['../examples.scss', './bars-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsDocumentationComponent {}
