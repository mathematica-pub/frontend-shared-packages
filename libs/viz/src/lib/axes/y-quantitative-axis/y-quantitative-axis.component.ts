import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ContinuousValue } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { QuantitativeTicks, Ticks } from '../ticks/ticks';
import { yAxisMixin } from '../y/y-axis';

type XyAxisType<T extends ContinuousValue> = AbstractConstructor<
  XyAxis<T, QuantitativeTicks<T>>
>;

const YQuantitativeAxis = yAxisMixin<
  ContinuousValue,
  Ticks<ContinuousValue>,
  XyAxisType<ContinuousValue>
>(quantitativeAxisMixin<ContinuousValue, XyAxisType<ContinuousValue>>(XyAxis));

@Component({
  selector: '[vic-y-quantitative-axis]',
  template: '',
  styles: [
    `
      .vic-axis-y-quantitative .vic-axis-label {
        fill: currentColor;
      }
    `,
  ],

  inputs: ['config'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class]': 'config.marksClass',
    class: 'vic-axis',
    '[attr.mix-blend-mode]': 'config.mixBlendMode',
    '[attr.transform]': 'translate',
  },
})
export class YQuantitativeAxisComponent extends YQuantitativeAxis {}
