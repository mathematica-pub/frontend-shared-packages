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

  describe('label rendering compatibility', () => {
    it('routes configured labels through the inherited drawLabels method', () => {
      component.config = { labels: { display: true } } as any;
      spyOn(component, 'getTransitionDuration').and.returnValue(0);
      spyOn(component, 'drawBars');
      spyOn(component, 'drawLabels');
      spyOn(component, 'updateBarElements');

      component.drawMarks();

      expect(component.drawLabels).toHaveBeenCalledOnceWith(0);
    });

    it('does not populate the barGroups selection required by drawLabels', () => {
      component.chart = {
        svgRef: {
          nativeElement: document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
          ),
        },
      } as any;
      component.config = {
        marksClass: 'stacked-bars',
        stackedData: [],
      } as any;
      component.scales.y = ((value: number) => value) as any;

      component.drawBars(0);

      expect(component.stackedBarGroups).toBeDefined();
      expect(component.barGroups).toBeUndefined();
    });
  });
});
