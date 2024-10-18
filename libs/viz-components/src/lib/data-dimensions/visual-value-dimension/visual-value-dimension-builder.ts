import { DataDimension } from '../dimension';

export abstract class VisualValueDimension<Datum> extends DataDimension<
  Datum,
  any
> {
  readonly _calculatedDomain: TDomain;
  readonly domain: TDomain;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract setDomain(...args: any): void;
  protected abstract setScale(): void;

  setPropertiesFromData(data: Datum[]): void {
    this.setValues(data);
    this.setDomain();
    this.setScale();
  }
}
