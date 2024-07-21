import { Component } from '@angular/core';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { xAxisMixin } from '../x/x-axis';
import { XyAxis } from '../xy-axis-base';

const XQuantitativeAxis = xAxisMixin(quantitativeAxisMixin(XyAxis));

/**
 * A component that is used to create a quantitative x-axis.
 *
 * Must be projected into the `svg-elements` content slot of an `XYChart` component.
 *
 * <p class="comment-inputs">Inputs</p>
 *
 * `config`: AxisConfig. (Inherited from XYAxis)
 *
 * `side`: 'top' | 'bottom'. Default is 'top'. (Inherited from XAxis)
 *
 * <p class="comment-example">Example usage</p>
 *
 * import { VicXQuantitativeAxisModule } from '@hsi/viz-components';
 *
 * imports: [VicXQuantitativeAxisModule]
 *
 * @example
 * <vic-xy-chart>
 *   <ng-container svg-elements>
 *     <svg:g
 *        vic-x-quantitative-axis
 *        [config]="xAxisConfig"
 *        side="top"
 *     ></svg:g>
 *     <svg:g vic-y-ordinal-axis [config]="yAxisConfig" side="left"></svg:g>
 *     <svg:g
 *       vic-data-marks-bars
 *       [config]="dataConfig"
 *     ></svg:g>
 *   </ng-container>
 * </vic-xy-chart>
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-quantitative-axis]',
  templateUrl: '../x/x-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class XQuantitativeAxisComponent extends XQuantitativeAxis {}
