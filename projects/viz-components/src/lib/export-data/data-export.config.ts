import { formatValue, valueFormat } from '../core/utilities/value-format';

export class VicColumnConfig {
  title: string;
  valueAccessor: (x: any) => any;

  constructor(options?: Partial<VicColumnConfig>) {
    Object.assign(this, options);
  }
}

export class VicDataExportConfig {
  data: unknown[];
  /**
   * If true, the data will be flipped.
   * Data: {a: 1, b: 2}, {a: 3, b: 4}
   * Output CSV:
   * a | 1 | 3
   * b | 2 | 4
   */
  flipped = false;
  /**
   * If provided, the flipped data's header will be set.
   * Data: {a: 1, b: 2, category: shrimp}, {a: 3, b: 4, category: lobster}
   * Output CSV:
   *     shrimp | lobster
   * a | 1      | 3
   * b | 2      | 4
   */
  flippedHeaderKey: string;
  /**
   * Specifies the keys on each object to include in the csv,
   * using default titles (converts thisIsAKey to This Is A Key) and values (object.thisIsAKey).
   * Data: {myKey: 1, otherKey: 2}, {myKey: 3, otherKey: 4}
   * defaultColumnList: [myKey]
   * Output CSV:
   * My Key
   * 1
   * 3
   */
  defaultColumnList: string[] = [];
  /**
   * If true, all keys from the first object in the data array
   * are used to populate defaultColumnList
   */
  includeAllKeysAsDefault = false;
  /**
   * A ColumnConfig needs to be provided for any column that can't use defaults
   * e.g. if there's a special title, the data needs to be formatted in some way,
   * sometimes certain fields are suppressed, etc.
   */
  columns: VicColumnConfig[] = [];
  marginBottom = 0;
  constructor(config?: Partial<VicDataExportConfig>) {
    Object.assign(this, config);
    if (this.includeAllKeysAsDefault) {
      this.defaultColumnList = Object.keys(this.data[0]);
    }
    this.defaultColumnList.forEach((key) => {
      this.columns.push(
        new VicColumnConfig({
          title: key !== this.flippedHeaderKey ? this.convertToTitle(key) : key,
          valueAccessor: (x) =>
            x[key] instanceof Date
              ? formatValue(x[key], valueFormat.monthYear)
              : x[key],
        })
      );
    });
  }

  convertToTitle(key: string): string {
    /**
     * Will convert:
     * - thisString -> This String
     * - 123String -> 123 String
     * - 123string -> 123 string
     * - string123 -> String 123
     * - thisSTRING -> This STRING
     * - thisSTRiNG -> This STRi NG
     */
    let converted_key =
      key.charAt(0).toUpperCase() +
      key.slice(1).replace(/([a-z])([A-Z])/g, (match, p1, p2) => p1 + ' ' + p2);
    converted_key = converted_key.replace(
      /([a-zA-Z])(\d+)/g,
      (match, p1, p2) => p1 + ' ' + p2
    );
    converted_key = converted_key.replace(
      /(\d+)([a-zA-Z])/g,
      (match, p1, p2) => p1 + ' ' + p2
    );
    return converted_key;
  }
}
