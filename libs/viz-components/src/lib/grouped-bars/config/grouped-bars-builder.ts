import { Injectable } from '@angular/core';
import { safeAssign } from '@hsi/app-dev-kit';
import { VicBarsConfigBuilder } from '../../bars/config/bars-builder';
import { DataValue } from '../../core/types/values';
import { GroupedBarsConfig } from './grouped-bars-config';

const DEFAULT = {
  _intraGroupPadding: 0.05,
};

/**
 * Builds a configuration object for a GroupedBarsComponent.
 *
 * Must be added to a providers array in or above the component that consumes it if it is injected via the constructor. (e.g. `providers: [VicGroupedBarsBuilder]` in the component decorator)
 *
 * The first generic parameter, Datum, is the type of the data that will be used to create the bars.
 *
 * The second generic parameter, TOrdinalValue, is the type of the ordinal data that will be used to position the bars.
 */
@Injectable()
export class VicGroupedBarsConfigBuilder<
  Datum,
  TOrdinalValue extends DataValue,
> extends VicBarsConfigBuilder<Datum, TOrdinalValue> {
  private _intraGroupPadding: number;

  constructor() {
    super();
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Set the padding between groups of bars. Passed to d3.scaleBand.padding.
   *
   * @default 0.05
   */
  intraGroupPadding(padding: number): this {
    this._intraGroupPadding = padding;
    return this;
  }

  /**
   * REQUIRED. Builds the configuration object for a GroupedBarsComponent.
   */
  override getConfig(): GroupedBarsConfig<Datum, TOrdinalValue> {
    this.validateBuilder('Grouped Bars');
    return new GroupedBarsConfig(this.dimensions, {
      marksClass: 'vic-grouped-bars',
      backgrounds: this.backgroundsBuilder?._build(),
      borderRadius: this._borderRadius,
      color: this.colorDimensionBuilder._build('Color'),
      customFills: this._customFills,
      data: this._data,
      datumClass: this._class,
      intraGroupPadding: this._intraGroupPadding,
      labels: this.labelsBuilder?._build(),
      mixBlendMode: this._mixBlendMode,
      ordinal: this.ordinalDimensionBuilder._build(
        'band',
        this.getOrdinalDimensionName()
      ),
      quantitative: this.quantitativeDimensionBuilder._build(
        this.getQuantitativeDimensionName()
      ),
    });
  }
}
