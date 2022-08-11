import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { XAxisMixin } from '../x/x-axis';
import { XyAxis } from '../xy-axis';

const XOrdinalAxis = XAxisMixin(OrdinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-x-ordinal-axis]',
  templateUrl: '../x/x-axis.html',
  inputs: ['side', 'config'],
})
export class XOrdinalAxisComponent extends XOrdinalAxis {}
