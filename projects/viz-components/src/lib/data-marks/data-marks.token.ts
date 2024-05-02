import { InjectionToken } from '@angular/core';
import { VicDataMarks } from './data-marks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIC_DATA_MARKS = new InjectionToken<VicDataMarks<unknown, any>>(
  'DataMarks'
);
