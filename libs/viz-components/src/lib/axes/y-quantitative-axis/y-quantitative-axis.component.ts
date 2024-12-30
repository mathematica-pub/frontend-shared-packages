import { Component, ViewEncapsulation } from '@angular/core';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { yAxisMixin } from '../y/y-axis';

const YQuantitativeAxis = yAxisMixin(quantitativeAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-quantitative-axis]',
  templateUrl: '../y/y-axis.html',
  styles: [
    `
      .vic-axis-g .vic-y-axis-label {
        fill: currentColor;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
  encapsulation: ViewEncapsulation.None,
})
export class YQuantitativeAxisComponent extends YQuantitativeAxis {}
