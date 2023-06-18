import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { XyAxis } from '../xy-axis';
import { mixinYAxis } from '../y/y-axis';

const YOrdinalAxis = mixinYAxis(OrdinalAxisMixin(XyAxis));

/**
 * A component that is used to create an ordinal y-axis.
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
 * import { VicYOrdinalAxisModule } from '@web-ast/viz-components';
 *
 * imports: [VicYOrdinalAxisModule]
 *
 * @example
 * <vic-xy-chart>
 *   <ng-container svg-elements>
 *     <svg:g vic-y-ordinal-axis [config]="xAxisConfig" side="left"></svg:g>
 *     <svg:g
 *        vic-x-quantitative-axis
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
  selector: '[vic-y-ordinal-axis]',
  templateUrl: '../y/y-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class YOrdinalAxisComponent extends YOrdinalAxis {}
