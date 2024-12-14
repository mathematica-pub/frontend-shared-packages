import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { BarsSimpleStatesExampleComponent } from '../bars-content/bars-simple-states-example/bars-simple-states-example.component';
import { DotsScatterplotExampleComponent } from '../dots-content/dots-scatterplot-example/dots-scatterplot-example.component';

@Component({
  selector: 'app-axes-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    DotsScatterplotExampleComponent,
    BarsSimpleStatesExampleComponent,
  ],
  templateUrl: './axes-content.component.html',
  styleUrls: ['../../api-documentation.scss', './axes-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AxesContentComponent {}
