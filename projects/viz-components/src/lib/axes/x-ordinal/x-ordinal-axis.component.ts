import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { mixinXAxis } from '../x/x-axis';
import { XyAxis } from '../xy-axis';

const XOrdinalAxis = mixinXAxis(OrdinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-ordinal-axis]',
  templateUrl: '../x/x-axis.html',
  inputs: ['side', 'config'],
})
export class XOrdinalAxisComponent extends XOrdinalAxis {}
