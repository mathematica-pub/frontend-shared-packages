import { SvgTextWrap } from '../../svg-text-wrap';
import { AxisLabelOptions } from './axis-label-options';

export class AxisLabel implements AxisLabelOptions {
  anchor: 'start' | 'middle' | 'end';
  offset: {
    x: number;
    y: number;
  };
  position: 'start' | 'middle' | 'end';
  text: string;
  wrap: SvgTextWrap;

  constructor(options: AxisLabelOptions) {
    Object.assign(this, options);
  }
}
