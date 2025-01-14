export interface LocationCategoryDatum {
  value: number;
  location: string;
  category: string;
}

export const statesElectionData: LocationCategoryDatum[] = [
  { location: 'Nevada', category: 'D', value: 0.49 },
  { location: 'Nevada', category: 'R', value: 0.46 },
  { location: 'North Carolina', category: 'D', value: 0.48 },
  { location: 'North Carolina', category: 'R', value: 0.46 },
  { location: 'Wisconsin', category: 'D', value: 0.49 },
  { location: 'Wisconsin', category: 'R', value: 0.47 },
  { location: 'Georgia', category: 'D', value: 0.48 },
  { location: 'Georgia', category: 'R', value: 0.47 },
  { location: 'Pennsylvania', category: 'D', value: 0.48 },
  { location: 'Pennsylvania', category: 'R', value: 0.48 },
  { location: 'Michigan', category: 'D', value: 0.47 },
  { location: 'Michigan', category: 'R', value: 0.47 },
  { location: 'Arizona', category: 'D', value: 0.45 },
  { location: 'Arizona', category: 'R', value: 0.49 },
];
