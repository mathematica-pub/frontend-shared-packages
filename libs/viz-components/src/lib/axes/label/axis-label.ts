import { safeAssign } from '@hsi/app-dev-kit';
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
    safeAssign(this, options);
  }
}
