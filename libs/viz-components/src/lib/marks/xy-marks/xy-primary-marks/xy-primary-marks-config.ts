import { PrimaryMarksConfig } from '../../primary-marks/config/primary-marks-config';

export abstract class XyPrimaryMarksConfig<
  Datum,
> extends PrimaryMarksConfig<Datum> {
  valueIndices: number[];
}
