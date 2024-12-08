import { Component, ViewEncapsulation } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { ordinalAxisMixin } from '../ordinal/ordinal-axis';
import { yAxisMixin } from '../y/y-axis';

const YOrdinalAxis = yAxisMixin(ordinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-ordinal-axis]',
  templateUrl: '../y/y-axis.html',
  styles: [
    `
      .vic-axis-g .y-axis-label {
        fill: currentColor;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
  encapsulation: ViewEncapsulation.None,
})
export class YOrdinalAxisComponent<
  TickValue extends DataValue,
> extends YOrdinalAxis<TickValue> {}
