export class VicBarsLabels<Datum> {
  display: boolean;
  offset: number;
  color: string;
  noValueFunction: (d: Datum, ...args: any) => string;

  constructor(init?: Partial<VicBarsLabels<Datum>>) {
    this.display = true;
    this.offset = 4;
    this.noValueFunction = () => 'N/A';
    Object.assign(this, init);
  }
}

export function vicBarsLabels<Datum>(
  options: Partial<VicBarsLabels<Datum>>
): VicBarsLabels<Datum> {
  return new VicBarsLabels(options);
}
