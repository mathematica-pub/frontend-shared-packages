import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { ordinalAxisMixin } from '../ordinal/ordinal-axis';
import { Ticks } from '../ticks/ticks';
import { yAxisMixin } from '../y/y-axis';

const YOrdinalAxis = yAxisMixin(
  ordinalAxisMixin(XyAxis<DataValue, Ticks<DataValue>>)
);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-ordinal-axis]',
  template: '',
  styles: [
    `
      .vic-axis-y-ordinal .vic-axis-label {
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
export class YOrdinalAxisComponent extends YOrdinalAxis {}
