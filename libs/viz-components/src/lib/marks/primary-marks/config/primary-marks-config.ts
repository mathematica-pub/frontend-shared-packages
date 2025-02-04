import { DataMarksConfig } from '../../config/marks-config';
import { DataMarksOptions } from '../../config/marks-options';

export abstract class PrimaryMarksConfig<Datum>
  extends DataMarksConfig<Datum>
  implements DataMarksOptions<Datum>
{
  protected abstract initPropertiesFromData(): void;
}
