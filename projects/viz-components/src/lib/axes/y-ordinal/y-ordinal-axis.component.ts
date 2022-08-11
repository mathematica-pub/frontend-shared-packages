import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { XyAxis } from '../xy-axis';
import { YAxisMixin } from '../y/y-axis';

const YOrdinalAxis = YAxisMixin(OrdinalAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-y-ordinal-axis]',
  templateUrl: '../y/y-axis.html',
  inputs: ['side', 'config'],
})
export class YOrdinalAxisComponent extends YOrdinalAxis {}
