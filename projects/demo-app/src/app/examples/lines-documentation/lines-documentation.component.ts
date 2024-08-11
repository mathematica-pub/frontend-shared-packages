import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../example-display/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../example-display/split-panel-example-display/split-panel-example-display.component';
import { LinesExampleComponent } from './lines-example/lines-example.component';

@Component({
  selector: 'app-lines-documentation',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    LinesExampleComponent,
  ],
  templateUrl: './lines-documentation.component.html',
  styleUrls: ['../examples.scss', './lines-documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesDocumentationComponent {}
