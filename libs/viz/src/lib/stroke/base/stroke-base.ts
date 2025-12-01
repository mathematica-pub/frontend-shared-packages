import { StrokeBaseOptions } from './stroke-base-options';

export abstract class StrokeBase implements StrokeBaseOptions {
  readonly linecap: string;
  readonly linejoin: string;
  readonly opacity: number;
  readonly width: number;
  readonly dasharray: string;
}
