export interface LocationCategoryDatum {
  value: number;
  location: string;
  category: string;
  locationAbbrev: string;
}

export const statesElectionData: LocationCategoryDatum[] = [
  { location: 'Nevada', locationAbbrev: 'NV', category: 'D', value: 0.49 },
  { location: 'Nevada', locationAbbrev: 'NV', category: 'R', value: 0.46 },
  {
    location: 'North Carolina',
    locationAbbrev: 'NC',
    category: 'D',
    value: 0.48,
  },
  {
    location: 'North Carolina',
    locationAbbrev: 'NC',
    category: 'R',
    value: 0.46,
  },
  { location: 'Wisconsin', locationAbbrev: 'WI', category: 'D', value: 0.49 },
  { location: 'Wisconsin', locationAbbrev: 'WI', category: 'R', value: 0.47 },
  { location: 'Georgia', locationAbbrev: 'GA', category: 'D', value: 0.48 },
  { location: 'Georgia', locationAbbrev: 'GA', category: 'R', value: 0.47 },
  {
    location: 'Pennsylvania',
    locationAbbrev: 'PA',
    category: 'D',
    value: 0.48,
  },
  {
    location: 'Pennsylvania',
    locationAbbrev: 'PA',
    category: 'R',
    value: 0.48,
  },
  { location: 'Michigan', locationAbbrev: 'MI', category: 'D', value: 0.47 },
  { location: 'Michigan', locationAbbrev: 'MI', category: 'R', value: 0.47 },
  { location: 'Arizona', locationAbbrev: 'AZ', category: 'D', value: 0.45 },
  { location: 'Arizona', locationAbbrev: 'AZ', category: 'R', value: 0.49 },
];
