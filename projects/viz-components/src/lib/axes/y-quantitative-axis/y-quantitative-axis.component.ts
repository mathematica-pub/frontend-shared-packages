import { Component } from '@angular/core';
import { quantitativeAxisMixin } from '../quantitative/quantitative-axis';
import { XyAxis } from '../xy-axis';
import { yAxisMixin } from '../y/y-axis';

const YQuantitativeAxis = yAxisMixin(quantitativeAxisMixin(XyAxis));

/**
 * A component that is used to create a quantitative y-axis.
 *
 * Must be projected into the `svg-elements` content slot of an `XYChart` component.
 *
 * <p class="comment-inputs">Inputs</p>
 *
 * `config`: AxisConfig. (Inherited from XYAxis)
 *
 * `side`: 'left' | 'right'. Default is 'left'. (Inherited from YAxis)
 *
 * <p class="comment-example">Example usage</p>
 *
 * import { VicYQuantitativeAxisModule } from '@hsi/viz-components';
 *
 * imports: [VicYQuantitativeAxisModule]
 *
 * @example
 * <vic-xy-chart>
 *   <ng-container svg-elements>
 *     <svg:g vic-y-quantitative-axis [config]="xAxisConfig" side="left"></svg:g>
 *     <svg:g
 *        vic-x-ordinal-axis
 *        [config]="xAxisConfig"
 *        side="top"
 *     ></svg:g>
 *     <svg:g
 *       vic-data-marks-bars
 *       [config]="dataConfig"
 *     ></svg:g>
 *   </ng-container>
 * </vic-xy-chart>
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-y-quantitative-axis]',
  templateUrl: '../y/y-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class YQuantitativeAxisComponent extends YQuantitativeAxis {}
