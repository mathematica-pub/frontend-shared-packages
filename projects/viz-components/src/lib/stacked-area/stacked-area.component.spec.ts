/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vicCategoricalDimension } from '../data-dimensions/categorical-dimension';
import { vicDateDimension } from '../data-dimensions/date-dimension';
import { vicQuantitativeDimension } from '../data-dimensions/quantitative-dimension';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { vicStackedArea } from './config/stacked-area.config';
import { StackedAreaComponent } from './stacked-area.component';

type Datum = { date: Date; value: number; category: string };

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent<any, string>;
  let fixture: ComponentFixture<StackedAreaComponent<any, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedAreaComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent<any, string>);
    component = fixture.componentInstance;
    component.config = vicStackedArea({
      data: [
        { date: new Date('2020-01-01'), value: 1, category: 'a' },
        { date: new Date('2020-01-02'), value: 2, category: 'a' },
        { date: new Date('2020-01-03'), value: 3, category: 'a' },
        { date: new Date('2020-01-01'), value: 4, category: 'b' },
        { date: new Date('2020-01-02'), value: 5, category: 'b' },
        { date: new Date('2020-01-03'), value: 6, category: 'b' },
      ],
      x: vicDateDimension<Datum>({
        valueAccessor: (d) => d.date,
      }),
      y: vicQuantitativeDimension<Datum>({
        valueAccessor: (d) => d.value,
      }),
      categorical: vicCategoricalDimension<Datum, string>({
        valueAccessor: (d) => d.category,
      }),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
