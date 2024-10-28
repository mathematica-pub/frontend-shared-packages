/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts';
import { VicDotsConfigBuilder } from './config/dots-builder';
import { DotsConfig } from './config/dots-config';
import { DotsComponent } from './dots.component';

type Datum = {
  rain: number;
  snow: number;
  state: string;
  year: number;
  other: string;
};

const testData = [
  { rain: 50, snow: 2, state: 'AL', year: 2020, other: 'a' },
  { rain: 54, snow: 1, state: 'AL', year: 2021, other: 'b' },
  { rain: 66, snow: 82, state: 'AK', year: 2020, other: 'c' },
  { rain: 45, snow: 53, state: 'AK', year: 2021, other: 'd' },
  { rain: 24, snow: 18, state: 'AZ', year: 2020, other: 'e' },
  { rain: 17, snow: 25, state: 'AZ', year: 2021, other: 'f' },
  { rain: 58, snow: 36, state: 'CA', year: 2020, other: 'g' },
  { rain: 66, snow: 50, state: 'CA', year: 2021, other: 'h' },
  { rain: 37, snow: 42, state: 'CO', year: 2020, other: 'i' },
  { rain: 49, snow: 63, state: 'CO', year: 2021, other: 'j' },
];

function getNewConfig(data: Datum[]): DotsConfig<Datum> {
  return new VicDotsConfigBuilder<Datum>()
    .data(data)
    .x((x) => x.valueAccessor((d) => d.year))
    .y((y) => y.valueAccessor((d) => d.rain))
    .radiusNumeric((radius) =>
      radius.valueAccessor((d) => d.snow).range([1, 12])
    )
    .fillCategorical((fill) =>
      fill
        .valueAccessor((d) => d.state)
        .range(['red', 'blue', 'green', 'yellow', 'purple'])
    )
    .getConfig();
}

describe('DotsComponent', () => {
  let component: DotsComponent<Datum>;
  let fixture: ComponentFixture<DotsComponent<Datum>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DotsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsComponent<Datum>);
    component = fixture.componentInstance;
  });

  describe('setChartScalesFromRanges', () => {
    beforeEach(() => {
      component.ranges = {
        x: [1, 2],
        y: [3, 4],
      } as any;
      component.chart = {
        updateScales: jasmine.createSpy('updatesScales'),
      } as any;
      component.config = getNewConfig(testData);
      spyOn(component.config.x, 'getScaleFromRange').and.returnValue(
        'xScale' as any
      );
      spyOn(component.config.y, 'getScaleFromRange').and.returnValue(
        'yScale' as any
      );
      spyOn(component.config.fill, 'getScale').and.returnValue(
        'fillScale' as any
      );
      spyOn(component.config.radius, 'getScale').and.returnValue(
        'radiusScale' as any
      );
    });
    it('calls x.getScaleFromRange once', () => {
      component.setChartScalesFromRanges(false);
      expect(component.config.x.getScaleFromRange).toHaveBeenCalledOnceWith([
        1, 2,
      ]);
    });
    it('calls y.getScaleFromRange once', () => {
      component.setChartScalesFromRanges(false);
      expect(component.config.y.getScaleFromRange).toHaveBeenCalledOnceWith([
        3, 4,
      ]);
    });
    it('calls fill.getScale once', () => {
      component.setChartScalesFromRanges(false);
      expect(component.config.fill.getScale).toHaveBeenCalledTimes(1);
    });
    it('sets scales.fill with the return values from fill.getScale', () => {
      component.setChartScalesFromRanges(false);
      expect(component.scales.fill).toEqual('fillScale');
    });
    it('calls radius.getScale once', () => {
      component.setChartScalesFromRanges(false);
      expect(component.config.radius.getScale).toHaveBeenCalledTimes(1);
    });
    it('sets scales.radius with the return values from radius.getScale', () => {
      component.setChartScalesFromRanges(false);
      expect(component.scales.radius).toEqual('radiusScale');
    });
    it('calls chart.updateScales once', () => {
      component.setChartScalesFromRanges(false);
      expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
        x: 'xScale' as any,
        y: 'yScale' as any,
        useTransition: false,
      });
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(component, 'getTransitionDuration').and.returnValue(100);
      spyOn(component, 'drawDots');
      spyOn(component, 'updateDotElements');
    });
    it('calls getTransitionDuration once', () => {
      component.drawMarks();
      expect(component.getTransitionDuration).toHaveBeenCalledTimes(1);
    });
    it('calls drawDots once with the transitionDuration', () => {
      component.drawMarks();
      expect(component.drawDots).toHaveBeenCalledOnceWith(100);
    });
    it('calls updateDotElements once', () => {
      component.drawMarks();
      expect(component.updateDotElements).toHaveBeenCalledTimes(1);
    });
  });
});
