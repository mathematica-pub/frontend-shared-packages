import { Component, ViewEncapsulation } from '@angular/core';
import { DataValue } from '../../core';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { yAxisMixin } from '../y/y-axis';

const YQuantitativeAxis = yAxisMixin(quantitativeAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-quantitative-axis]',
  template: '',
  styles: [
    `
      .vic-axis-y-quantitative .vic-axis-label {
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
  standalone: false,
})
export class YQuantitativeAxisComponent<
  TickValue extends DataValue,
> extends YQuantitativeAxis<TickValue> {}
