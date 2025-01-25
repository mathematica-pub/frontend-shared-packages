import { Component, ViewEncapsulation } from '@angular/core';
import { XyAxis } from '../base/xy-axis-base';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { xAxisMixin } from '../x/x-axis';

const XQuantitativeAxis = xAxisMixin(quantitativeAxisMixin(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-quantitative-axis]',
  template: '',
  styles: [
    `
      .vic-axis-g .vic-x-axis-label {
        fill: currentColor;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['config'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'config.class',
    '[attr.transform]': 'translate',
  },
})
export class XQuantitativeAxisComponent extends XQuantitativeAxis {}
