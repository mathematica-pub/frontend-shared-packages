import { SvgTextWrap } from '../../svg-text-wrap';

export interface AxisLabelOptions {
  anchor: 'start' | 'middle' | 'end';
  offset: {
    x: number;
    y: number;
  };
  position: 'start' | 'middle' | 'end';
  text: string;
  wrap: SvgTextWrap;
}
