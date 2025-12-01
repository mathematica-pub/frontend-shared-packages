export interface FillDefinition<Datum> {
  defId: string;
  shouldApply: (d: Datum) => boolean;
}
