import { MarksConfig } from '../../config/marks-config';
import { MarksOptions } from '../../config/marks-options';

export abstract class PrimaryMarksConfig<Datum>
  extends MarksConfig<Datum>
  implements MarksOptions<Datum>
{
  protected abstract initPropertiesFromData(): void;
}
