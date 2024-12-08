import { Component, ViewEncapsulation } from '@angular/core';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { xAxisMixin } from '../x/x-axis';

const XQuantitativeAxis = xAxisMixin(quantitativeAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-quantitative-axis]',
  templateUrl: '../x/x-axis.html',
  styles: [
    `
      .vic-axis-g .x-axis-label {
        fill: currentColor;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
  encapsulation: ViewEncapsulation.None,
})
export class XQuantitativeAxisComponent extends XQuantitativeAxis {}
