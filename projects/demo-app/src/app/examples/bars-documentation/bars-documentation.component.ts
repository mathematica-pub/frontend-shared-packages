import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelDisplayComponent } from '../../example-display/single-panel-display/single-panel-display.component';
import { SplitPanelDisplayComponent } from '../../example-display/split-panel-display/split-panel-display.component';
import { BarsExampleComponent } from './bars-example/bars-example.component';

@Component({
  selector: 'app-bars-documentation',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelDisplayComponent,
    SplitPanelDisplayComponent,
    BarsExampleComponent,
  ],
  templateUrl: './bars-documentation.component.html',
  styleUrl: './bars-documentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarsDocumentationComponent {}
