import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { DotsExampleComponent } from './dots-example/dots-example.component';
import { DotsOrdinalQuantExampleComponent } from './dots-ordinal-quant-example/dots-ordinal-quant-example.component';
import { DotsScatterplotExampleComponent } from './dots-scatterplot-example/dots-scatterplot-example.component';

@Component({
  selector: 'app-dots-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    ContentContainerComponent,
    DotsExampleComponent,
    DotsScatterplotExampleComponent,
    DotsOrdinalQuantExampleComponent,
  ],
  templateUrl: './dots-content.component.html',
  styleUrls: ['../../api-documentation.scss', './dots-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotsContentComponent {}
