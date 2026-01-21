import { Component, ViewEncapsulation } from '@angular/core';
import { ContinuousValue } from '../../core';
import { AbstractConstructor } from '../../core/common-behaviors/constructor';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { QuantitativeTicks, Ticks } from '../ticks/ticks';
import { xAxisMixin } from '../x/x-axis';

type XyAxisType<T extends ContinuousValue> = AbstractConstructor<
  XyAxis<T, QuantitativeTicks<T>>
>;

const XQuantitativeAxis = xAxisMixin<
  ContinuousValue,
  Ticks<ContinuousValue>,
  XyAxisType<ContinuousValue>
>(quantitativeAxisMixin<ContinuousValue, XyAxisType<ContinuousValue>>(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-quantitative-axis]',
  template: '',
  styles: [
    `
      .vic-axis-x-quantitative .vic-axis-label {
        fill: currentColor;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['config'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'config.marksClass',
    class: 'vic-axis',
    '[attr.mix-blend-mode]': 'config.mixBlendMode',
    '[attr.transform]': 'translate',
  },
})
export class XQuantitativeAxisComponent extends XQuantitativeAxis {}
