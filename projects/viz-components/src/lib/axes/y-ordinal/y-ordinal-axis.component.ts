import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { XyAxis } from '../xy-axis';
import { mixinYAxis } from '../y/y-axis';

const YOrdinalAxis = mixinYAxis(OrdinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-ordinal-axis]',
  templateUrl: '../y/y-axis.html',
  inputs: ['side', 'config'],
})
export class YOrdinalAxisComponent extends YOrdinalAxis {}
