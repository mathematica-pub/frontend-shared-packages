export interface MetroUnemploymentDatum {
  division: string;
  date: Date;
  value: number;
}

export interface IndustryUnemploymentDatum {
  industry: string;
  date: Date;
  value: number;
}

export interface StateIncomeDatum {
  state: string;
  population: number;
  income: number;
  year: number;
}

export interface WeatherDatum {
  location: string;
  date: Date;
  precipitation: number;
  tempMax: number;
  tempMin: number;
  wind: number;
  weather: string;
}
