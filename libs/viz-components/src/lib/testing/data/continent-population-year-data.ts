// Quant Date, Quant Number, Cat
export type ContinentPopulationDateYearDatum = {
  continent: string;
  population: number;
  year: Date;
};
// Quant Number, Quant Number, Cat
export type ContinentPopulationNumYearDatum = {
  continent: string;
  population: number;
  year: number;
};

export const continentPopulationDateYearData: ContinentPopulationDateYearDatum[] =
  [
    { continent: 'Asia', year: new Date('2024-01-02'), population: 4785060000 },
    { continent: 'Asia', year: new Date('2030-01-02'), population: 4958807000 },
    { continent: 'Asia', year: new Date('2050-01-02'), population: 5292948000 },
    { continent: 'Asia', year: new Date('2100-01-02'), population: 4674249000 },
    {
      continent: 'Africa',
      year: new Date('2024-01-02'),
      population: 1494994000,
    },
    {
      continent: 'Africa',
      year: new Date('2030-01-02'),
      population: 1710666000,
    },
    {
      continent: 'Africa',
      year: new Date('2050-01-02'),
      population: 2485136000,
    },
    {
      continent: 'Africa',
      year: new Date('2100-01-02'),
      population: 3924421000,
    },
    {
      continent: 'Europe',
      year: new Date('2024-01-02'),
      population: 741652000,
    },
    {
      continent: 'Europe',
      year: new Date('2030-01-02'),
      population: 736574000,
    },
    {
      continent: 'Europe',
      year: new Date('2050-01-02'),
      population: 703007000,
    },
    {
      continent: 'Europe',
      year: new Date('2100-01-02'),
      population: 586515000,
    },
    {
      continent: 'North America',
      year: new Date('2024-01-02'),
      population: 381048000,
    },
    {
      continent: 'North America',
      year: new Date('2030-01-02'),
      population: 393297000,
    },
    {
      continent: 'North America',
      year: new Date('2050-01-02'),
      population: 421398000,
    },
    {
      continent: 'North America',
      year: new Date('2100-01-02'),
      population: 448026000,
    },
    {
      continent: 'South America',
      year: new Date('2024-01-02'),
      population: 442861000,
    },
    {
      continent: 'South America',
      year: new Date('2030-01-02'),
      population: 460220000,
    },
    {
      continent: 'South America',
      year: new Date('2050-01-02'),
      population: 491079000,
    },
    {
      continent: 'South America',
      year: new Date('2100-01-02'),
      population: 425794000,
    },
    {
      continent: 'Oceania',
      year: new Date('2024-01-02'),
      population: 46109000,
    },
    {
      continent: 'Oceania',
      year: new Date('2030-01-02'),
      population: 49212000,
    },
    {
      continent: 'Oceania',
      year: new Date('2050-01-02'),
      population: 57834000,
    },
    {
      continent: 'Oceania',
      year: new Date('2100-01-02'),
      population: 68712000,
    },
  ];

export const ContinentPopulationNumYearData: ContinentPopulationNumYearDatum[] =
  continentPopulationDateYearData.map((d) => ({
    ...d,
    year: d.year.getFullYear(),
  }));
