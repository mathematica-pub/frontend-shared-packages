import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { XyChartBackgroundComponent } from './xy-chart-background.component';

describe('ChartBackgroundComponent', () => {
  let component: XyChartBackgroundComponent;
  let fixture: ComponentFixture<XyChartBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XyChartBackgroundComponent],
      providers: [XyChartComponent],
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
