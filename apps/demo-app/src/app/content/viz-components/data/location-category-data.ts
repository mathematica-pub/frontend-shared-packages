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

export const statesElectionDataPosNeg: LocationCategoryDatum[] = [
  { location: 'Nevada', locationAbbrev: 'NV', category: '2020', value: 0.024 },
  {
    location: 'Nevada',
    locationAbbrev: 'NV',
    category: '2024',
    value: -0.0031,
  },
  {
    location: 'North Carolina',
    locationAbbrev: 'NC',
    category: '2020',
    value: -0.013,
  },
  {
    location: 'North Carolina',
    locationAbbrev: 'NC',
    category: '2024',
    value: -0.032,
  },
  {
    location: 'Wisconsin',
    locationAbbrev: 'WI',
    category: '2020',
    value: 0.007,
  },
  {
    location: 'Wisconsin',
    locationAbbrev: 'WI',
    category: '2024',
    value: -0.008,
  },
  { location: 'Georgia', locationAbbrev: 'GA', category: '2020', value: 0.002 },
  {
    location: 'Georgia',
    locationAbbrev: 'GA',
    category: '2024',
    value: -0.022,
  },
  {
    location: 'Pennsylvania',
    locationAbbrev: 'PA',
    category: '2020',
    value: 0.012,
  },
  {
    location: 'Pennsylvania',
    locationAbbrev: 'PA',
    category: '2024',
    value: -0.017,
  },
  {
    location: 'Michigan',
    locationAbbrev: 'MI',
    category: '2020',
    value: 0.027,
  },
  {
    location: 'Michigan',
    locationAbbrev: 'MI',
    category: '2024',
    value: -0.014,
  },
  { location: 'Arizona', locationAbbrev: 'AZ', category: '2020', value: 0.003 },
  {
    location: 'Arizona',
    locationAbbrev: 'AZ',
    category: '2024',
    value: -0.055,
  },
];
