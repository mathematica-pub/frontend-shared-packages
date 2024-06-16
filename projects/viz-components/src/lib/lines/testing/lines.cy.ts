import { Component, Input } from '@angular/core';
import { cy, describe, it } from 'local-cypress';
import {
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicXyChartModule,
  VicYQuantitativeAxisModule,
} from 'projects/viz-components/src/public-api';
import { VicQuantitativeAxisConfig } from '../../axes/quantitative/quantitative-axis.config';
import { Vic } from '../../config/vic';
import { VicLinesConfig } from '../config/lines.config';

type DateDatum = { continent: string; population: number; year: Date };
type NumberDatum = { continent: string; population: number; year: number };
const defaultDateData: DateDatum[] = [
  { continent: 'Asia', year: new Date('2024-01-02'), population: 4785060000 },
  { continent: 'Asia', year: new Date('2030-01-02'), population: 4958807000 },
  { continent: 'Asia', year: new Date('2050-01-02'), population: 5292948000 },
  { continent: 'Asia', year: new Date('2100-01-02'), population: 4674249000 },
  { continent: 'Africa', year: new Date('2024-01-02'), population: 1494994000 },
  { continent: 'Africa', year: new Date('2030-01-02'), population: 1710666000 },
  { continent: 'Africa', year: new Date('2050-01-02'), population: 2485136000 },
  { continent: 'Africa', year: new Date('2100-01-02'), population: 3924421000 },
  { continent: 'Europe', year: new Date('2024-01-02'), population: 741652000 },
  { continent: 'Europe', year: new Date('2030-01-02'), population: 736574000 },
  { continent: 'Europe', year: new Date('2050-01-02'), population: 703007000 },
  { continent: 'Europe', year: new Date('2100-01-02'), population: 586515000 },
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
  { continent: 'Oceania', year: new Date('2024-01-02'), population: 46109000 },
  { continent: 'Oceania', year: new Date('2030-01-02'), population: 49212000 },
  { continent: 'Oceania', year: new Date('2050-01-02'), population: 57834000 },
  { continent: 'Oceania', year: new Date('2100-01-02'), population: 68712000 },
];
const defaultNumberData: NumberDatum[] = defaultDateData.map((d) => ({
  ...d,
  year: d.year.getFullYear(),
}));

const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const chartHeight = 400;
const chartWidth = 600;

// ***********************************************************
// Horizontal bar chart component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-lines',
  template: `
    <vic-xy-chart
      [margin]="margin"
      [height]="chartHeight"
      [width]="chartWidth"
      [scaleChartWithContainerWidth]="{ width: true, height: false }"
    >
      <ng-container svg-elements>
        <svg:g
          vic-x-quantitative-axis
          [config]="xQuantitativeAxisConfig"
          side="bottom"
        ></svg:g>
        <svg:g
          vic-y-quantitative-axis
          [config]="yQuantitativeAxisConfig"
          side="left"
        ></svg:g>
        <svg:g vic-data-marks-lines [config]="linesConfig"></svg:g>
      </ng-container>
    </vic-xy-chart>
  `,
  styles: [],
})
class TestLinesComponent<Datum, QuantAxisType extends number | Date> {
  @Input() linesConfig: VicLinesConfig<Datum>;
  @Input() yQuantitativeAxisConfig: VicQuantitativeAxisConfig<string>;
  @Input() xQuantitativeAxisConfig: VicQuantitativeAxisConfig<QuantAxisType>;
  margin = margin;
  chartHeight = chartHeight;
  chartWidth = chartWidth;
}

const imports = [
  VicChartModule,
  VicLinesModule,
  VicXQuantitativeAxisModule,
  VicYQuantitativeAxisModule,
  VicXyChartModule,
];

function mountDateLinesComponent(linesConfig: VicLinesConfig<DateDatum>): void {
  const xAxisConfig = Vic.axisXQuantitative({
    tickFormat: '%Y',
  });
  const yAxisConfig = Vic.axisYQuantitative();
  const declarations = [TestLinesComponent<DateDatum, Date>];
  cy.mount(TestLinesComponent<DateDatum, Date>, {
    declarations,
    imports,
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

function mountNumberLinesComponent(
  linesConfig: VicLinesConfig<NumberDatum>
): void {
  const xAxisConfig = Vic.axisXQuantitative({
    tickFormat: '.0f',
  });
  const yAxisConfig = Vic.axisYQuantitative();
  const declarations = [TestLinesComponent<NumberDatum, number>];
  cy.mount(TestLinesComponent<NumberDatum, number>, {
    declarations,
    imports,
    componentProperties: {
      linesConfig: linesConfig,
      xQuantitativeAxisConfig: xAxisConfig,
      yQuantitativeAxisConfig: yAxisConfig,
    },
  });
}

// ***********************************************************
// Creating the correct lines
// ***********************************************************
describe('it creates the correct lines', () => {
  describe('when the x axis values are Dates', () => {
    it('should draw the correct number of lines', () => {
      const linesConfig = Vic.lines<DateDatum>({
        data: defaultDateData,
        x: Vic.dimensionDate<DateDatum>({
          valueAccessor: (d) => d.year,
        }),
        y: Vic.dimensionQuantitative<DateDatum>({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<DateDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
      });
      console.log(linesConfig);
      mountDateLinesComponent(linesConfig);
      cy.get('.vic-line').should('have.length', 6);
    });
  });
  describe('when the x axis values are a Numbers', () => {
    it('should draw the correct number of lines', () => {
      const linesConfig = Vic.lines<NumberDatum>({
        data: defaultNumberData,
        x: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.year,
          includeZeroInDomain: false,
        }),
        y: Vic.dimensionQuantitative({
          valueAccessor: (d) => d.population,
        }),
        categorical: Vic.dimensionCategorical<NumberDatum, string>({
          valueAccessor: (d) => d.continent,
        }),
      });
      mountNumberLinesComponent(linesConfig);
      cy.get('.vic-line').should('have.length', 6);
    });
  });
});
