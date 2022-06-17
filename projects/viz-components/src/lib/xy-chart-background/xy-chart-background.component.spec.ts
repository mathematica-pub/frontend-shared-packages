import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from '../chart/chart.component';
import { XyChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { XyChartBackgroundComponent } from './xy-chart-background.component';

describe('ChartBackgroundComponent', () => {
  let component: XyChartBackgroundComponent;
  let fixture: ComponentFixture<XyChartBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XyChartBackgroundComponent],
      providers: [XyChartSpaceComponent, ChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XyChartBackgroundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
