import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { StackedBarsComponent } from './stacked-bars.component';

describe('StackedBarsComponent', () => {
  let component: StackedBarsComponent;
  let fixture: ComponentFixture<StackedBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StackedBarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarsComponent);
    component = fixture.componentInstance;
    component.chart.dataMarksComponent = {
      config: { tooltip: { show: false, type: 'html' } },
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
