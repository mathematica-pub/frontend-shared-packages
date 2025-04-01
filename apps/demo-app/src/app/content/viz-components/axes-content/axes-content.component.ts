import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  VicXQuantitativeAxisConfig,
  VicXQuantitativeAxisConfigBuilder,
  VicYQuantitativeAxisConfig,
  VicYQuantitativeAxisConfigBuilder,
} from '@hsi/viz-components';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { BarsSimpleStatesExampleComponent } from '../bars-content/bars-simple-states-example/bars-simple-states-example.component';
import { DotsScatterplotExampleComponent } from '../dots-content/dots-scatterplot-example/dots-scatterplot-example.component';

interface Axes {
  x: VicXQuantitativeAxisConfig<number>;
  y: VicYQuantitativeAxisConfig<number>;
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
  customLabelAxes: Axes;
  defaultGridAxes: Axes;
  customGridAxes: Axes;

  constructor(
    private xQuantitativeAxis: VicXQuantitativeAxisConfigBuilder<number>,
    private yQuantitativeAxis: VicYQuantitativeAxisConfigBuilder<number>
  ) {}

  ngOnInit(): void {
    this.defaultAxes = {
      x: this.xQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label((label) => label.text('wind speed (mph)'))
        .getConfig(),
      y: this.yQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label((label) => label.text('precipitation (in)'))
        .getConfig(),
    };

    this.customLabelAxes = {
      x: this.xQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label((label) =>
          label
            .text('wind speed (mph)')
            .position('end')
            .wrap((wrap) => wrap.width(60))
        )
        .getConfig(),
      y: this.yQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label((label) =>
          label
            .text('precipitation (in)')
            .position('start')
            .anchor('start')
            .offset({ x: 8, y: 8 })
            .wrap((wrap) => wrap.width(60).maintainXPosition(true))
        )
        .getConfig(),
    };

    this.defaultGridAxes = {
      x: this.xQuantitativeAxis
        .label(null)
        .ticks((ticks) => ticks.format('.0f'))
        .grid()
        .getConfig(),
      y: this.yQuantitativeAxis
        .label(null)
        .ticks((ticks) => ticks.format('.0f'))
        .grid()
        .getConfig(),
    };

    this.customGridAxes = {
      x: this.xQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label(null)
        .grid((grid) =>
          grid
            .filter((i) => i % 2 !== 0)
            .stroke((stroke) => stroke.dasharray('5').color('blue'))
        )
        .getConfig(),
      y: this.yQuantitativeAxis
        .ticks((ticks) => ticks.format('.0f'))
        .label(null)
        .grid((grid) =>
          grid
            .filter((i) => i % 2 !== 0)
            .stroke((stroke) => stroke.dasharray('5').color('red'))
        )
        .getConfig(),
    };
  }
}
