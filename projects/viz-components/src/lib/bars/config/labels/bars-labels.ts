export class VicBarsLabels<Datum> {
  color: { default: string; withinBarAlternative: string };
  display: boolean;
  noValueFunction: (d: Datum) => string;
  offset: number;

  constructor(options: VicBarsLabels<Datum>) {
    Object.assign(this, options);
  }
}
