import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { StackedBarsComponent } from './stacked-bars.component';

describe('StackedBarsComponent', () => {
  let component: StackedBarsComponent;
  let fixture: ComponentFixture<StackedBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedBarsComponent],
      providers: [XYChartSpaceComponent, ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
