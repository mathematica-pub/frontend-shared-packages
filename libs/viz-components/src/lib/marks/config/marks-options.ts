export interface MarksOptions {
  mixBlendMode: string;
  marksClass: string;
}

export interface DataMarksOptions<Datum> extends MarksOptions {
  data: Datum[];
  datumClass: (d: Datum, i: number) => string;
}
