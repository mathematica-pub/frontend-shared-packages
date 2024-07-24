import { Component } from '@angular/core';
import { DataValue } from '../../core/types/values';
import { XyAxis } from '../base/xy-axis-base';
import { ordinalAxisMixin } from '../ordinal/ordinal-axis';
import { xAxisMixin } from '../x/x-axis';

const XOrdinalAxis = xAxisMixin(ordinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-ordinal-axis]',
  templateUrl: '../x/x-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class XOrdinalAxisComponent<
  TickValue extends DataValue
> extends XOrdinalAxis<TickValue> {}
