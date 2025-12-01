/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { StackedBarsComponent } from './stacked-bars.component';

describe('StackedBarsComponent', () => {
  let component: StackedBarsComponent<any, string>;
  let fixture: ComponentFixture<StackedBarsComponent<any, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedBarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarsComponent<any, string>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
