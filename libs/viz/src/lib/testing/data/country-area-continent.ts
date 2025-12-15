export type CountryFactsDatum = {
  country: string;
  area: number;
  continent: string;
  population: number;
  popGrowth: number;
  gdpPerCapita: number;
};

export const countryFactsData = [
  {
    country: 'Afghanistan',
    area: 252072,
    continent: 'Asia',
    population: 40121552,
    popGrowth: 0.022,
    gdpPerCapita: 2000,
  },
  {
    country: 'Albania',
    area: 11100,
    continent: 'Europe',
    population: 3107100,
    popGrowth: 0.0016,
    gdpPerCapita: 18100,
  },
  {
    country: 'Algeria',
    area: 919595,
    continent: 'Africa',
    population: 47022473,
    popGrowth: 0.0154,
    gdpPerCapita: 15300,
  },
  {
    country: 'Angola',
    area: 481350,
    continent: 'Africa',
    population: 37202061,
    popGrowth: 0.0333,
    gdpPerCapita: 7200,
  },
  {
    country: 'Antigua and Barbuda',
    area: 171,
    continent: 'North America',
    population: 102634,
    popGrowth: 0.011,
    gdpPerCapita: 28700,
  },
  {
    country: 'Argentina',
    area: 1073500,
    continent: 'South America',
    population: 46994384,
    popGrowth: 0.0079,
    gdpPerCapita: 26500,
  },
];
