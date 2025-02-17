import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  VicQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { BarsSimpleStatesExampleComponent } from '../bars-content/bars-simple-states-example/bars-simple-states-example.component';
import { DotsScatterplotExampleComponent } from '../dots-content/dots-scatterplot-example/dots-scatterplot-example.component';

interface Axes {
  x: VicQuantitativeAxisConfig<number>;
  y: VicQuantitativeAxisConfig<number>;
}

@Component({
  selector: 'app-axes-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    DotsScatterplotExampleComponent,
    BarsSimpleStatesExampleComponent,
  ],
  providers: [
    VicXQuantitativeAxisConfigBuilder,
    VicYQuantitativeAxisConfigBuilder,
  ],
  templateUrl: './axes-content.component.html',
  styleUrls: ['../../api-documentation.scss', './axes-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AxesContentComponent implements OnInit {
  defaultAxes: Axes;
  customAxes: Axes;

  constructor(
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.defaultAxes = {
      x: this.xQuantitativeAxis
        .tickFormat('.0f')
        .label((label) => label.text('wind speed (mph)'))
        .getConfig(),
      y: this.yQuantitativeAxis
        .tickFormat('.0f')
        .label((label) => label.text('precipitation (in)'))
        .getConfig(),
    };

    this.customAxes = {
      x: this.xQuantitativeAxis
        .tickFormat('.0f')
        .label((label) =>
          label
            .text('wind speed (mph)')
            .position('end')
            .wrap((wrap) => wrap.width(60))
        )
        .getConfig(),
      y: this.yQuantitativeAxis
        .tickFormat('.0f')
        .label((label) =>
          label
            .text('precipitation (in)')
            .position('start')
            .anchor('start')
            .offset({ x: 8, y: 8 })
        )
        .getConfig(),
    };
  }
}
