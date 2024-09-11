import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../core/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../core/split-panel-example-display/split-panel-example-display.component';
import { LinesExampleComponent } from './lines-example/lines-example.component';

@Component({
  selector: 'app-lines-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    LinesExampleComponent,
  ],
  templateUrl: './lines-content.component.html',
  styleUrls: ['../examples.scss', './lines-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesContentComponent {}
