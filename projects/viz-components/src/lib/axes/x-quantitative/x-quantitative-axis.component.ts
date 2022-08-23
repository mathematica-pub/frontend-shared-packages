import { Component } from '@angular/core';
import { mixinQuantitativeAxis } from '../quantitative/quantitative-axis';
import { mixinXAxis } from '../x/x-axis';
import { XyAxis } from '../xy-axis';

const XQuantitativeAxis = mixinXAxis(mixinQuantitativeAxis(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vzc-x-quantitative-axis]',
  templateUrl: '../x/x-axis.html',
  inputs: ['side', 'config'],
})
export class XQuantitativeAxisComponent extends XQuantitativeAxis {}
