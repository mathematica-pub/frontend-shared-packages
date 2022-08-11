import { Component } from '@angular/core';
import { QuantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { XyAxis } from '../xy-axis';
import { YAxisMixin } from '../y/y-axis';

const YQuantitativeAxis = YAxisMixin(QuantitativeAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-y-quantitative-axis]',
  templateUrl: '../y/y-axis.html',
  inputs: ['side', 'config'],
})
export class YQuantitativeAxisComponent extends YQuantitativeAxis {}
