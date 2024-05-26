export class VicBarsLabels<Datum> {
  color: string;
  display: boolean;
  noValueFunction: (d: Datum, ...args: any) => string;
  offset: number;

  constructor(options?: Partial<VicBarsLabels<Datum>>) {
    this.display = true;
    this.offset = 4;
    this.noValueFunction = () => 'N/A';
    Object.assign(this, options);
  }
}

export function vicBarsLabels<Datum>(
  options: Partial<VicBarsLabels<Datum>>
): VicBarsLabels<Datum> {
  return new VicBarsLabels(options);
}
