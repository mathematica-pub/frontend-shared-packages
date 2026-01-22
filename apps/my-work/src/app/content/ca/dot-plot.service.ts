/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ChartConfig, StackedBarsConfig } from '@mathstack/viz';
import { extent, max, min } from 'd3';

@Injectable()
export class DotPlotService {
  data: any[];
  chartConfig: ChartConfig;
  rollupData: any[] = [];
  rollupDataConfig: StackedBarsConfig<any, string>;
  yAxisConfig: any;
  xAxisConfig: any;
  trueMax: number;
  labelWidth: number;
  bandwidth: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getInvisibleStackValue(d: any) {
    console.warn('override getInvisibleStackValue');
  }

  setInterimData(getCurrentRollup: (a: any, b: any) => boolean): void {
    this.rollupData = [];

    this.data
      .filter((d) => d.planValue !== null)
      .forEach((d) => {
        const visibleStack = structuredClone(d);
        const currentRollup = this.rollupData.find((x) =>
          getCurrentRollup(x, d)
        );
        if (!currentRollup) {
          visibleStack.plans = [d.planValue];

          const invisibleStack = structuredClone(d);
          invisibleStack.series = 'invisible';
          invisibleStack.value = this.getInvisibleStackValue(d);

          this.rollupData.push(visibleStack);
          this.rollupData.push(invisibleStack);
        } else {
          currentRollup.plans.push(d.planValue);
        }
      });
  }

  setMlbData(): void {
    this.rollupData = structuredClone(this.data);

    this.data.forEach((d) => {
      const invisibleStack = structuredClone(d);
      invisibleStack.series = 'invisible';
      invisibleStack.value = this.getInvisibleStackValue(d);
      this.rollupData.push(invisibleStack);
    });
  }

  getTickFormat(nonRollupData?: any[]): string {
    const data = nonRollupData || this.rollupData;
    const units = data.find((category) => category.units !== null).units;
    const trueMax = this.trueMax || max(data, (d) => d.value);
    let format = ',.0f';
    if (units === 'Percentage') {
      if (trueMax < 0.1) {
        format = '.1%';
      } else {
        format = '.0%';
      }
    } else if (trueMax < 10) {
      format = ',.1f';
    }
    return format;
  }

  setHeight(dataAccessor: string): void {
    const uniqueRows = this.rollupData.reduce((set, d) => {
      set.add(d.series + d[dataAccessor]);
      return set;
    }, new Set());
    this.chartConfig.height = uniqueRows.size * this.bandwidth;
  }

  setRaceEthnicityMockCategories(order: any): void {
    order.race['Race 1 covers two lines'] = 0;
    order.race['Race 2'] = 1;
    order.race['Race 3 covers two lines'] = 2;
    order.race[`Race 4 covers three lines because it's long`] = 3;
    order.race['Race 5'] = 4;
    order.race['No Race Selection and Race 1 or Race 2 Ethnicity'] = 5;
    order.race['Some Other Race'] = 6;
    order.race['Two or More Races'] = 7;
    order.ethnicity['Ethnicity 1 covers two lines'] = 9;
    order.ethnicity['Ethnicity 2 covers two lines'] = 10;
  }

  getCategoryData(strat: string, stratVal: string): any[] {
    return this.rollupData.filter(
      (category) =>
        category.strat.toLowerCase().includes(strat) &&
        category.stratVal === stratVal
    );
  }

  getMatchingStrat(strat: string): any {
    return this.rollupData.find(
      (category) => category.strat.toLowerCase() === strat
    );
  }

  addCategory(emptyCategory: any): void {
    const invisibleCategory = structuredClone(emptyCategory);
    invisibleCategory.series = 'invisible';

    this.rollupData.push(...[emptyCategory, invisibleCategory]);
  }

  setExtents(): void {
    this.rollupData.forEach((d) => {
      const row = this.rollupData.filter((category) => {
        const categoryValue = category.strat ? 'stratVal' : 'county';
        return (
          category[categoryValue] === d[categoryValue] &&
          category.series === d.series &&
          category.strat === d.strat
        );
      });
      if (d.series === 'invisible') {
        d.value = min(row.map((lob) => lob.average)) || null;
      } else {
        const extents = extent(row.map((lob) => lob.average));
        d.value = extents[1] - extents[0] || null;
      }
    });
  }
}
