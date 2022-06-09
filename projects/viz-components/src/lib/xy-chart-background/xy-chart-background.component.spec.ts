import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { XYChartBackgroundComponent } from './xy-chart-background.component';

describe('ChartBackgroundComponent', () => {
  let component: XYChartBackgroundComponent;
  let fixture: ComponentFixture<XYChartBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYChartBackgroundComponent],
      providers: [XYChartSpaceComponent, ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XYChartBackgroundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
