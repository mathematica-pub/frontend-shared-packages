import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { LinesExampleComponent } from './lines-example/lines-example.component';
import { LinesSmallMultiplesExampleComponent } from './lines-small-multiples-example/lines-small-multiples-example.component';

@Component({
  selector: 'app-lines-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    ContentContainerComponent,
    LinesExampleComponent,
    LinesSmallMultiplesExampleComponent,
  ],
  templateUrl: './lines-content.component.html',
  styleUrls: ['../../examples.scss', './lines-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesContentComponent {}
