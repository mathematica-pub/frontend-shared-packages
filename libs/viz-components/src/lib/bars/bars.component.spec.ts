/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../charts/xy-chart/xy-chart.component';
import { ColorUtilities } from '../core/utilities/colors';
import { FillUtilities } from '../core/utilities/fill-utilities';
import { ValueUtilities } from '../core/utilities/values';
import { BarDatum, BarsComponent } from './bars.component';
import { VicBarsConfigBuilder } from './config/bars-builder';
import { BarsConfig } from './config/bars-config';

type Datum = { value: number; state: string; fruit: string };

const data = [
  { value: 1, state: 'AL', fruit: 'apple' },
  { value: 2, state: 'AK', fruit: 'avocado' },
  { value: 3, state: 'AZ', fruit: 'banana' },
  { value: 4, state: 'CA', fruit: 'cherry' },
  { value: 5, state: 'CO', fruit: 'date' },
  { value: 6, state: 'CO', fruit: 'durian' },
];

function horizontalConfig(): BarsConfig<Datum, string> {
  return new VicBarsConfigBuilder<Datum, string>()
    .data(data)
    .horizontal((bars) =>
      bars
        .x((dimension) => dimension.valueAccessor((d) => d.value))
        .y((dimension) => dimension.valueAccessor((d) => d.state))
    )
    .color((dimension) => dimension.valueAccessor((d) => d.fruit))
    .labels((labels) => labels.noValueFunction(() => 'no value'))
    .getConfig();
}

function verticalConfig(): BarsConfig<Datum, string> {
  return new VicBarsConfigBuilder<Datum, string>()
    .data(data)
    .vertical((bars) =>
      bars
        .y((dimension) => dimension.valueAccessor((d) => d.value))
        .x((dimension) => dimension.valueAccessor((d) => d.state))
    )
    .color((dimension) =>
      dimension
        .valueAccessor((d) => d.fruit)
        .range(['red', 'blue', 'green', 'yellow', 'purple'])
    )
    .labels((labels) => labels.noValueFunction(() => 'no value'))
    .getConfig();
}

describe('BarsComponent', () => {
  let component: BarsComponent<any, string>;
  let fixture: ComponentFixture<BarsComponent<Datum, string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsComponent<Datum, string>);
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
    });
    describe('chart is horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        spyOn(component.config.color, 'getScale').and.returnValue(
          'categorical scale' as any
        );
        spyOn(component.config.ordinal, 'getScaleFromRange').and.returnValue(
          'ordinal scale' as any
        );
        spyOn(
          component.config.quantitative,
          'getScaleFromRange'
        ).and.returnValue('quantitative scale' as any);
      });
      it('calls the scale for x dimension once', () => {
        component.setChartScalesFromRanges(true);
        expect(
          component.config.quantitative.getScaleFromRange
        ).toHaveBeenCalledOnceWith([1, 2]);
      });
      it('calls the scale for y dimension once', () => {
        component.setChartScalesFromRanges(false);
        expect(
          component.config.ordinal.getScaleFromRange
        ).toHaveBeenCalledOnceWith([3, 4]);
      });
      it('calls updateScales once with the correct value', () => {
        component.setChartScalesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'quantitative scale',
          y: 'ordinal scale',
          useTransition: false,
        } as any);
      });
    });
    describe('chart is vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        spyOn(component.config.color, 'getScale').and.returnValue(
          'categorical scale' as any
        );
        spyOn(component.config.ordinal, 'getScaleFromRange').and.returnValue(
          'ordinal scale' as any
        );
        spyOn(
          component.config.quantitative,
          'getScaleFromRange'
        ).and.returnValue('quantitative scale' as any);
      });
      it('calls the scale for x dimension once', () => {
        component.setChartScalesFromRanges(true);
        expect(
          component.config.ordinal.getScaleFromRange
        ).toHaveBeenCalledOnceWith([1, 2]);
      });
      it('calls the scale for y dimension once', () => {
        component.setChartScalesFromRanges(false);
        expect(
          component.config.quantitative.getScaleFromRange
        ).toHaveBeenCalledOnceWith([3, 4]);
      });
      it('calls updateScales once with the correct value', () => {
        component.setChartScalesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'ordinal scale',
          y: 'quantitative scale',
          useTransition: false,
        } as any);
      });
    });
  });

  describe('drawMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'drawBars');
      spyOn(component, 'drawLabels');
      spyOn(component, 'updateBarElements');
      spyOn(component, 'getTransitionDuration').and.returnValue(100);
      component.config = horizontalConfig();
    });
    it('calls drawBars once with the correct parameter', () => {
      component.drawMarks();
      expect(component.drawBars).toHaveBeenCalledOnceWith(100);
    });
    it('calls drawBarLabels if config.labels is truthy', () => {
      component.drawMarks();
      expect(component.drawLabels).toHaveBeenCalledOnceWith(100);
    });
    it('does not call drawBarLabels if config.labels is falsy', () => {
      (component.config as any).labels = undefined;
      component.drawMarks();
      expect(component.drawLabels).not.toHaveBeenCalled();
    });
    it('calls updateBarElements', () => {
      component.drawMarks();
      expect(component.updateBarElements).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBarDatumFromIndex()', () => {
    beforeEach(() => {
      component.config = horizontalConfig();
    });
    it('returns the correct value', () => {
      expect(component.getBarDatumFromIndex(1)).toEqual({
        index: 1,
        quantitative: 2,
        ordinal: 'AK',
        color: 'avocado',
      });
    });
  });

  describe('getBarGroupTransform()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarX').and.returnValue(1);
      spyOn(component, 'getBarY').and.returnValue(10);
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(1);
    });
    it('calls getBarX once with the correct value', () => {
      component.getBarGroupTransform(datum);
      expect(component.getBarX).toHaveBeenCalledOnceWith(datum);
    });
    it('calls getBarY once with the correct value', () => {
      component.getBarGroupTransform(datum);
      expect(component.getBarY).toHaveBeenCalledOnceWith(datum);
    });
    it('returns the correct value', () => {
      expect(component.getBarGroupTransform(datum)).toEqual('translate(1,10)');
    });
  });

  describe('getBarFill', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      spyOn(component, 'getBarPattern').and.returnValue('bar pattern');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(1);
    });
    it('returns the result of getBarColor if there are no pattern fills specified', () => {
      expect(component.getBarFill(datum)).toEqual('bar color');
    });
    it('returns the result of getBarPattern if there are pattern fills specified', () => {
      (component.config as any).customFills = [
        { defId: 'pattern', shouldApply: () => true },
      ];
      expect(component.getBarFill(datum)).toEqual('bar pattern');
    });
  });

  describe('getBarX()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarXOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarXQuantitative').and.returnValue(
        'quantitative' as any
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarXOrdinal once with the correct value', () => {
        component.getBarX(datum);
        expect(component.getBarXOrdinal).toHaveBeenCalledOnceWith(datum);
      });
      it('does not call getBarXQuantitative', () => {
        component.getBarX(datum);
        expect(component.getBarXQuantitative).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarX(datum)).toEqual('ordinal' as any);
      });
    });
    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarXQuantitative once with the correct value', () => {
        component.getBarX(datum);
        expect(component.getBarXQuantitative).toHaveBeenCalledOnceWith(datum);
      });
      it('does not call getBarXOrdinal', () => {
        component.getBarX(datum);
        expect(component.getBarXOrdinal).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarX(datum)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarXOrdinal()', () => {
    let datum: BarDatum<string>;
    let xSpy: jasmine.Spy;
    beforeEach(() => {
      xSpy = jasmine.createSpy('x').and.returnValue(10);
      component.config = verticalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.scales = {
        x: xSpy,
      } as any;
    });
    it('calls xScale once with the correct value', () => {
      component.getBarXOrdinal(datum);
      expect(component.scales.x).toHaveBeenCalledOnceWith(datum.ordinal);
    });
    it('returns the correct value', () => {
      expect(component.getBarXOrdinal(datum)).toEqual(10);
    });
  });

  describe('getBarXQuantitative()', () => {
    let datum: BarDatum<string>;
    let xSpy: jasmine.Spy;
    beforeEach(() => {
      xSpy = jasmine.createSpy('x').and.returnValue(10);
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.scales = {
        x: xSpy,
      } as any;
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 4,
      ]);
      spyOn(component, 'getBarQuantitativeOrigin').and.returnValue(10);
    });
    it('calls xScale once', () => {
      component.getBarXQuantitative(datum);
      expect(component.scales.x).toHaveBeenCalledTimes(1);
    });
    it('calls xScale once with origin if quant value is not a number', () => {
      datum.quantitative =
        'oops it turns out there is a string in the users quant data' as any;
      component.getBarXQuantitative(datum);
      expect(component.scales.x).toHaveBeenCalledWith(10);
    });
    it('calls xScale once with the origin if quant value is 0', () => {
      datum.quantitative = 0;
      component.getBarXQuantitative(datum);
      expect(component.scales.x).toHaveBeenCalledWith(10);
    });
    describe('hasNegativeValues is true', () => {
      beforeEach(() => {
        component.config.hasNegativeValues = true;
      });
      it('calls xScale once with quant value if quant value is less than 0', () => {
        datum.quantitative = -1;
        component.getBarXQuantitative(datum);
        expect(component.scales.x).toHaveBeenCalledWith(-1);
      });
      it('calls xScale once with 0 if quant value is greater than 0', () => {
        datum.quantitative = 3;
        component.getBarXQuantitative(datum);
        expect(component.scales.x).toHaveBeenCalledWith(0);
      });
    });
    describe('hasNegativeValues is false', () => {
      beforeEach(() => {
        component.config.hasNegativeValues = false;
      });
      it('calls xScale once with the correct value if quant value is greater than 0', () => {
        datum.quantitative = 3;
        component.getBarXQuantitative(datum);
        expect(component.scales.x).toHaveBeenCalledWith(2);
      });
    });
  });

  describe('getBarY()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarYOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarYQuantitative').and.returnValue(
        'quantitative' as any
      );
    });
    describe('chart is horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarYOrdinal with datum if chart is horizontal', () => {
        component.config = horizontalConfig();
        component.getBarY(datum);
        expect(component.getBarYOrdinal).toHaveBeenCalledOnceWith(datum);
      });
      it('returns the correct value', () => {
        expect(component.getBarY(datum)).toEqual('ordinal' as any);
      });
    });
    describe('chart is vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarYQuantitative with datum if chart is vertical', () => {
        component.getBarY(datum);
        expect(component.getBarYQuantitative).toHaveBeenCalledOnceWith(datum);
      });
      it('returns the correct value', () => {
        expect(component.getBarY(datum)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarYOrdinal()', () => {
    let datum: BarDatum<string>;
    let ySpy: jasmine.Spy;
    beforeEach(() => {
      ySpy = jasmine.createSpy('y').and.returnValue(10);
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.scales = {
        y: ySpy,
      } as any;
    });
    it('calls yScale once with the correct value', () => {
      component.getBarYOrdinal(datum);
      expect(component.scales.y).toHaveBeenCalledOnceWith(datum.ordinal);
    });
    it('returns the correct value', () => {
      expect(component.getBarYOrdinal(datum)).toEqual(10);
    });
  });

  describe('getBarYQuantitative()', () => {
    let datum: BarDatum<string>;
    let ySpy: jasmine.Spy;
    beforeEach(() => {
      ySpy = jasmine.createSpy('y').and.returnValue(10);
      component.config = verticalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.scales = {
        y: ySpy,
      } as any;
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 4,
      ]);
      spyOn(component, 'getBarQuantitativeOrigin').and.returnValue(10);
    });
    it('calls yScale once', () => {
      component.getBarYQuantitative(datum);
      expect(component.scales.y).toHaveBeenCalledTimes(1);
    });
    it('calls yScale once with origin if quant value is not a number', () => {
      datum.quantitative = 'oops i am a string' as any;
      component.getBarYQuantitative(datum);
      expect(component.scales.y).toHaveBeenCalledWith(10);
    });
    it('calls yScale once with the origin if quant value is 0', () => {
      datum.quantitative = 0;
      component.getBarYQuantitative(datum);
      expect(component.scales.y).toHaveBeenCalledWith(10);
    });
    describe('quantitative value is less than zero', () => {
      beforeEach(() => {
        datum.quantitative = -5;
      });
      it('calls yScale once with 0 if domainIncludesZero is true', () => {
        component.config.quantitative.domainIncludesZero = true;
        component.getBarYQuantitative(datum);
        expect(component.scales.y).toHaveBeenCalledWith(0);
      });
      it('calls yScale once with the correct value if domainIncludesZero is false', () => {
        component.config.quantitative.domainIncludesZero = false;
        component.getBarYQuantitative(datum);
        expect(component.scales.y).toHaveBeenCalledWith(4);
      });
    });
    describe('quantitative value is greater than zero', () => {
      it('calls yScale once with the quantitative value', () => {
        component.getBarYQuantitative(datum);
        expect(component.scales.y).toHaveBeenCalledWith(datum.quantitative);
      });
    });
  });

  describe('getQuantitativeDomainFromScale()', () => {
    beforeEach(() => {
      component.scales = {
        x: { domain: () => [1, 2] },
        y: { domain: () => [3, 4] },
      } as any;
    });
    it('returns the x domain if bars are horizontal', () => {
      component.config = horizontalConfig();
      expect(component.getQuantitativeDomainFromScale()).toEqual([1, 2]);
    });
    it('returns the y domain if bars are vertical', () => {
      component.config = verticalConfig();
      expect(component.getQuantitativeDomainFromScale()).toEqual([3, 4]);
    });
  });

  describe('getBarWidth()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarDimensionQuantitative').and.returnValue(10);
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(20);
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarDimensionQuantitative once with datum and x', () => {
        component.getBarWidth(datum);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'x'
        );
      });
      it('returns the value from getBarDimensionQuantitative', () => {
        expect(component.getBarWidth(datum)).toEqual(10);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarWidthOrdinal once with datum and y', () => {
        component.getBarWidth(datum);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the value from getBarDimensionQuantitative', () => {
        expect(component.getBarWidth(datum)).toEqual(20);
      });
    });
  });

  describe('getBarWidthOrdinal()', () => {
    let bandwidthSpy: jasmine.Spy;
    beforeEach(() => {
      bandwidthSpy = jasmine.createSpy('bandwidth').and.returnValue(10);
      component.scales = {
        x: { bandwidth: bandwidthSpy },
      } as any;
    });
    it('calls bandwidth on x scale once', () => {
      component.getBarWidthOrdinal();
      expect((component.scales.x as any).bandwidth).toHaveBeenCalledTimes(1);
    });
    it('returns the value from bandwidth', () => {
      expect(component.getBarWidthOrdinal()).toEqual(10);
    });
  });

  describe('getBarHeight', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarDimensionQuantitative').and.returnValue(10);
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(20);
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarHeightOrdinal once with datum and y', () => {
        component.getBarHeight(datum);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the value from getBarHeightOrdinal', () => {
        expect(component.getBarHeight(datum)).toEqual(20);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarDimensionQuantitative once with datum and x', () => {
        component.getBarHeight(datum);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'y'
        );
      });
      it('returns the value from getBarDimensionQuantitative', () => {
        expect(component.getBarHeight(datum)).toEqual(10);
      });
    });
  });

  describe('getBarHeightOrdinal()', () => {
    let bandwidthSpy: jasmine.Spy;
    beforeEach(() => {
      bandwidthSpy = jasmine.createSpy('bandwidth').and.returnValue(10);
      component.scales = {
        y: { bandwidth: bandwidthSpy },
      } as any;
    });
    it('calls bandwidth on y scale once', () => {
      component.getBarHeightOrdinal();
      expect((component.scales.y as any).bandwidth).toHaveBeenCalledTimes(1);
    });
    it('returns the value from bandwidth', () => {
      expect(component.getBarHeightOrdinal()).toEqual(10);
    });
  });

  describe('getBarDimensionQuantitative()', () => {
    let datum: BarDatum<string>;
    let xSpy: jasmine.Spy;
    let ySpy: jasmine.Spy;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      xSpy = jasmine.createSpy('x').and.returnValues(20, 50);
      ySpy = jasmine.createSpy('y').and.returnValues(50, 100);
      spyOn(component, 'getBarQuantitativeOrigin').and.returnValue(30);
      component.scales = {
        x: xSpy,
        y: ySpy,
      } as any;
    });
    it('returns zero if quantitative value is non-numeric', () => {
      datum.quantitative = 'not a number' as any;
      expect(component.getBarDimensionQuantitative(datum, 'x')).toEqual(0);
    });
    it('returns zero if quantitative value is zero', () => {
      datum.quantitative = 0;
      expect(component.getBarDimensionQuantitative(datum, 'y')).toEqual(0);
    });
    describe('dimension is x', () => {
      it('calls x scale twice, once with the quantitative value and once the origin', () => {
        component.getBarDimensionQuantitative(datum, 'x');
        expect(xSpy).toHaveBeenCalledTimes(2);
      });
      it('calls x scale with the quantitative value and the origin', () => {
        component.getBarDimensionQuantitative(datum, 'x');
        expect(xSpy.calls.allArgs()).toEqual([[3], [30]]);
      });
      it('returns the absolute value of the difference between the two scales calls', () => {
        expect(component.getBarDimensionQuantitative(datum, 'x')).toEqual(30);
      });
    });
    describe('dimension is y', () => {
      it('calls y scale twice, once with the quantitative value and once the origin', () => {
        component.getBarDimensionQuantitative(datum, 'y');
        expect(ySpy).toHaveBeenCalledTimes(2);
      });
      it('calls y scale once with the quantitative value and once the origin', () => {
        component.getBarDimensionQuantitative(datum, 'y');
        expect(ySpy.calls.allArgs()).toEqual([[3], [30]]);
      });
      it('returns the absolute value of the difference between the two scales calls', () => {
        expect(component.getBarDimensionQuantitative(datum, 'y')).toEqual(50);
      });
    });
  });

  describe('getBarQuantitativeOrigin()', () => {
    beforeEach(() => {
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 4,
      ]);
      component.config = horizontalConfig();
    });
    it('returns 0 if domain includes 0', () => {
      component.config.quantitative.domainIncludesZero = true;
      expect(component.getBarQuantitativeOrigin()).toEqual(0);
    });
    describe('domainIncludesZero is false', () => {
      beforeEach(() => {
        component.config.quantitative.domainIncludesZero = false;
      });
      it('returns the second domain value if hasNegativeValues is true', () => {
        component.config.hasNegativeValues = true;
        expect(component.getBarQuantitativeOrigin()).toEqual(4);
      });
      it('returns the first domain value if hasNegativeValues is false', () => {
        component.config.hasNegativeValues = false;
        expect(component.getBarQuantitativeOrigin()).toEqual(2);
      });
    });
  });

  describe('getBarPattern()', () => {
    let datum: BarDatum<string>;
    const customFill = {
      defId: 'pattern1',
      shouldApply: (d) => d.fruit === 'avocado',
    };
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('blue');
      spyOn(FillUtilities, 'getFill').and.returnValue('return-pattern');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      (component.config as any).customFills = [customFill];
    });
    it('calls getBarColor once with the datum', () => {
      component.getBarPattern(datum);
      expect(component.getBarColor).toHaveBeenCalledOnceWith(datum);
    });
    it('calls getPatternFill once with the correct values', () => {
      component.getBarPattern(datum);
      expect(FillUtilities.getFill).toHaveBeenCalledOnceWith(data[2], 'blue', [
        customFill,
      ]);
    });
  });

  describe('getBarColor()', () => {
    let datum: BarDatum<string>;
    let colorSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      colorSpy = jasmine.createSpy('color').and.returnValue('blue');
      component.scales = {
        color: colorSpy,
      } as any;
    });
    it('calls categorical scale once with the correct value', () => {
      component.getBarColor(datum);
      expect(component.scales.color).toHaveBeenCalledOnceWith('banana');
    });
    it('returns the correct value', () => {
      expect(component.getBarColor(datum)).toEqual('blue');
    });
  });

  describe('getLabelText()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      spyOn(ValueUtilities, 'customFormat').and.returnValue(
        'custom formatted value'
      );
      spyOn(ValueUtilities, 'd3Format').and.returnValue('d3 formatted value');
    });
    it('returns the correct value if value is not a number', () => {
      datum.quantitative = 'not a number' as any;
      expect(component.getLabelText(datum)).toEqual('no value');
    });
    it('calls customFormat once with full datum if formatFunction exists', () => {
      (component.config.quantitative as any).formatFunction = (d) =>
        d.quantitative + '!';
      component.getLabelText(datum);
      expect(ValueUtilities.customFormat).toHaveBeenCalledOnceWith(
        data[2],
        component.config.quantitative.formatFunction
      );
    });
    it('calls formatValue once with the correct value if formatFunction does not exist', () => {
      component.getLabelText(datum);
      expect(ValueUtilities.d3Format).toHaveBeenCalledOnceWith(
        3,
        component.config.quantitative.formatSpecifier
      );
    });
    it('returns the formatted value', () => {
      expect(component.getLabelText(datum)).toEqual('d3 formatted value');
    });
  });

  describe('getLabelTextAnchor()', () => {
    let datum: BarDatum<string>;
    let alignTextSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });
    it('returns middle if bars are vertical', () => {
      component.config = verticalConfig();
      expect(component.getLabelTextAnchor(datum, bbox)).toEqual('middle');
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
      });
      it('calls alignTextInPositiveDirection once', () => {
        component.getLabelTextAnchor(datum, bbox);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(datum);
      });
      it('returns start if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getLabelTextAnchor(datum, bbox)).toEqual('start');
      });
      it('returns end if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getLabelTextAnchor(datum, bbox)).toEqual('end');
      });
    });
  });

  describe('getLabelDominantBaseline()', () => {
    let datum: BarDatum<string>;
    let alignTextSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });
    it('returns central if bars are horizontal', () => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      expect(component.getLabelDominantBaseline(datum, bbox)).toEqual(
        'central'
      );
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls alignTextInPositiveDirection once', () => {
        component.getLabelDominantBaseline(datum, bbox);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(datum);
      });
      it('returns text-after-edge if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getLabelDominantBaseline(datum, bbox)).toEqual(
          'text-after-edge'
        );
      });
      it('returns text-before-edge if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getLabelDominantBaseline(datum, bbox)).toEqual(
          'text-before-edge'
        );
      });
    });
  });

  describe('alignTextInPositiveDirection()', () => {
    let datum: BarDatum<string>;
    let zeroOrNonNumericSpy: jasmine.Spy;
    let fitsOutsideSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      zeroOrNonNumericSpy = spyOn(
        component,
        'positionZeroOrNonNumericValueLabelInPositiveDirection'
      );
      fitsOutsideSpy = spyOn(component, 'labelFitsOutsideBar');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    describe('quantitative value is zero or non-numeric', () => {
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once - value is 0', () => {
        datum.quantitative = 0;
        component.alignTextInPositiveDirection(datum, bbox);
        expect(zeroOrNonNumericSpy).toHaveBeenCalledTimes(1);
      });
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once - value is non-numeric', () => {
        datum.quantitative = 'not a number' as any;
        component.alignTextInPositiveDirection(datum, bbox);
        expect(zeroOrNonNumericSpy).toHaveBeenCalledTimes(1);
      });
      it('returns the return value from positionZeroOrNonNumericValueLabelInPositiveDirection if quant value is non-numeric', () => {
        datum.quantitative = 'not a number' as any;
        zeroOrNonNumericSpy.and.returnValue(true);
        component.alignTextInPositiveDirection(datum, bbox);
        expect(component.alignTextInPositiveDirection(datum, bbox)).toEqual(
          true
        );
      });
    });
    describe('quantitative value is not zero or non-numeric', () => {
      it('calls barLabelFitsOutsideBar once', () => {
        component.alignTextInPositiveDirection(datum, bbox);
        expect(fitsOutsideSpy).toHaveBeenCalledOnceWith(datum);
      });
      describe('barLabelFitsOutsideBar returns true', () => {
        it('returns true if value is higher than 0', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(component.alignTextInPositiveDirection(datum, bbox)).toEqual(
            true
          );
        });
        it('returns false if value is lower than 0', () => {
          datum.quantitative = -1;
          fitsOutsideSpy.and.returnValue(true);
          expect(component.alignTextInPositiveDirection(datum, bbox)).toEqual(
            false
          );
        });
      });
      describe('barLabelFitsOutsideBar returns false', () => {
        it('returns false if value is higher than 0', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.alignTextInPositiveDirection(datum, bbox)).toEqual(
            false
          );
        });
        it('returns true if value is lower than 0', () => {
          datum.quantitative = -1;
          fitsOutsideSpy.and.returnValue(false);
          expect(component.alignTextInPositiveDirection(datum, bbox)).toEqual(
            true
          );
        });
      });
    });
  });

  describe('getLabelColor()', () => {
    let datum: BarDatum<string>;
    let fitsOutsideSpy: jasmine.Spy;
    let higherContrastSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      fitsOutsideSpy = spyOn(component, 'labelFitsOutsideBar');
      spyOn(component, 'getBarColor').and.returnValue('blue');
      higherContrastSpy = spyOn(
        ColorUtilities,
        'getHigherContrastColorForBackground'
      );
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    it('returns the default color if quant value is non-numeric', () => {
      datum.quantitative = 'not a number' as any;
      expect(component.getLabelColor(datum, bbox)).toEqual(
        component.config.labels.color.default
      );
    });
    it('returns the default color if quant value is 0', () => {
      datum.quantitative = 0;
      expect(component.getLabelColor(datum, bbox)).toEqual(
        component.config.labels.color.default
      );
    });
    describe('quant value is not 0 or non-numeric', () => {
      it('calls barLabelFitsOutsideBar once if', () => {
        component.getLabelColor(datum, bbox);
        expect(fitsOutsideSpy).toHaveBeenCalledTimes(1);
      });
      it('returns the default color if barLabelFitsOutsideBar returns true', () => {
        fitsOutsideSpy.and.returnValue(true);
        expect(component.getLabelColor(datum, bbox)).toEqual(
          component.config.labels.color.default
        );
      });
      describe('barLabelFitsOutsideBar returns false', () => {
        beforeEach(() => {
          fitsOutsideSpy.and.returnValue(false);
        });
        it('calls getBarColor once with the datum', () => {
          component.getLabelColor(datum, bbox);
          expect(component.getBarColor).toHaveBeenCalledOnceWith(datum);
        });
        it('calls getHigherContrastColorForBackground once with the correct values', () => {
          component.getLabelColor(datum, bbox);
          expect(
            ColorUtilities.getHigherContrastColorForBackground
          ).toHaveBeenCalledOnceWith(
            'blue',
            component.config.labels.color.default,
            component.config.labels.color.withinBarAlternative
          );
        });
        it('returns the result of getHigherContrastColorForBackground', () => {
          higherContrastSpy.and.returnValue('higher contrast');
          expect(component.getLabelColor(datum, bbox)).toEqual(
            'higher contrast'
          );
        });
      });
    });
  });

  describe('barLabelFitsOutsideBar()', () => {
    let datum: BarDatum<string>;
    let xSpy: jasmine.Spy;
    let ySpy: jasmine.Spy;
    let getBarWidthSpy: jasmine.Spy;
    let getBarHeightSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      xSpy = jasmine.createSpy('x').and.returnValue(10);
      ySpy = jasmine.createSpy('y').and.returnValue(20);
      spyOn(component, 'getBarToChartEdgeDistance').and.returnValue(10);
      component.ranges = { x: [1, 2], y: [3, 4] };
      component.scales = {
        x: xSpy,
        y: ySpy,
      } as any;
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is positive', () => {
        component.labelFitsOutsideBar(datum, bbox);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [1, 2],
          10
        );
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is negative', () => {
        datum.quantitative = -1;
        component.labelFitsOutsideBar(datum, bbox);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          false,
          [1, 2],
          10
        );
      });
      it('returns true if the distance is less than the label width', () => {
        getBarWidthSpy.and.returnValue(5);
        expect(component.labelFitsOutsideBar(datum, bbox)).toEqual(true);
      });
      it('returns false if the distance is greater than the label width', () => {
        getBarWidthSpy.and.returnValue(15);
        expect(component.labelFitsOutsideBar(datum, bbox)).toEqual(false);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is positive', () => {
        component.labelFitsOutsideBar(datum, bbox);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [3, 4],
          20
        );
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is negative', () => {
        datum.quantitative = -1;
        component.labelFitsOutsideBar(datum, bbox);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          false,
          [3, 4],
          20
        );
      });
      it('returns true if the distance is less than the label height', () => {
        getBarHeightSpy.and.returnValue(5);
        expect(component.labelFitsOutsideBar(datum, bbox)).toEqual(true);
      });
      it('returns false if the distance is greater than the label height', () => {
        getBarHeightSpy.and.returnValue(15);
        expect(component.labelFitsOutsideBar(datum, bbox)).toEqual(false);
      });
    });
  });

  describe('getBarToChartEdgeDistance()', () => {
    it('returns the correct value if isPositiveValue is true', () => {
      expect(component.getBarToChartEdgeDistance(true, [1, 2], 10)).toEqual(8);
    });
    it('returns the correct value if isPositiveValue is false', () => {
      expect(component.getBarToChartEdgeDistance(false, [1, 2], 10)).toEqual(9);
    });
  });

  describe('getLabelX()', () => {
    let datum: BarDatum<string>;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      spyOn(component, 'getLabelQuantitativeAxisPosition').and.returnValue(50);
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getLabelQuantitativeAxisPosition once with datum', () => {
        component.getLabelX(datum, bbox);
        expect(
          component.getLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(datum, bbox);
      });
      it('returns the correct value', () => {
        expect(component.getLabelX(datum, bbox)).toEqual(50);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarWidthOrdinal once', () => {
        component.getLabelX(datum, bbox);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getLabelX(datum, bbox)).toEqual(5);
      });
    });
  });

  describe('getLabelY()', () => {
    let datum: BarDatum<string>;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      spyOn(component, 'getLabelQuantitativeAxisPosition').and.returnValue(50);
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarHeightOrdinal once', () => {
        component.getLabelY(datum, bbox);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getLabelY(datum, bbox)).toEqual(5);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getLabelQuantitativeAxisPosition once with datum', () => {
        component.getLabelY(datum, bbox);
        expect(
          component.getLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(datum, bbox);
      });
      it('returns the correct value', () => {
        expect(component.getLabelY(datum, bbox)).toEqual(50);
      });
    });
  });

  describe('getLabelQuantitativeAxisPosition()', () => {
    let datum: BarDatum<string>;
    let isZeroOrNonNumericSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      spyOn(
        component,
        'getLabelPositionForZeroOrNonnumericValue'
      ).and.returnValue(10);
      spyOn(component, 'getLabelPositionForNumericValue').and.returnValue(20);
      isZeroOrNonNumericSpy = spyOn(component, 'isZeroOrNonNumeric');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    describe('quantitative value is zero or non-numeric', () => {
      beforeEach(() => {
        isZeroOrNonNumericSpy.and.returnValue(true);
      });
      it('calls isZeroOrNonNumeric once', () => {
        component.getLabelQuantitativeAxisPosition(datum, bbox);
        expect(component.isZeroOrNonNumeric).toHaveBeenCalledTimes(1);
      });
      it('calls getLabelPositionForZeroOrNonnumericValue once if value is zero', () => {
        isZeroOrNonNumericSpy.and.returnValue(true);
        component.getLabelQuantitativeAxisPosition(datum, bbox);
        expect(
          component.getLabelPositionForZeroOrNonnumericValue
        ).toHaveBeenCalledTimes(1);
      });
      it('returns the value from getLabelPositionForZeroOrNonnumericValue', () => {
        expect(component.getLabelQuantitativeAxisPosition(datum, bbox)).toEqual(
          10
        );
      });
    });
    describe('quantitative value is numeric and not zero', () => {
      beforeEach(() => {
        isZeroOrNonNumericSpy.and.returnValue(false);
      });
      it('calls getLabelPositionForNumericValue once', () => {
        component.getLabelQuantitativeAxisPosition(datum, bbox);
        expect(
          component.getLabelPositionForNumericValue
        ).toHaveBeenCalledOnceWith(datum, bbox);
      });
      it('returns the value from getLabelPositionForNumericValue', () => {
        expect(component.getLabelQuantitativeAxisPosition(datum, bbox)).toEqual(
          20
        );
      });
    });
  });

  describe('getLabelPositionForZeroOrNonnumericValue()', () => {
    let positionSpy: jasmine.Spy;
    beforeEach(() => {
      positionSpy = spyOn(
        component,
        'positionZeroOrNonNumericValueLabelInPositiveDirection'
      );
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        component.config.labels.offset = 20;
      });
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once', () => {
        component.getLabelPositionForZeroOrNonnumericValue();
        expect(positionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns config.labels.offset if positionInPositiveDirection is true', () => {
        positionSpy.and.returnValue(true);
        expect(component.getLabelPositionForZeroOrNonnumericValue()).toEqual(
          20
        );
      });
      it('returns -config.labels.offset if positionInPositiveDirection is false', () => {
        positionSpy.and.returnValue(false);
        expect(component.getLabelPositionForZeroOrNonnumericValue()).toEqual(
          -20
        );
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        component.config.labels.offset = 20;
      });
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once', () => {
        component.getLabelPositionForZeroOrNonnumericValue();
        expect(positionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns config.labels.offset if positionInPositiveDirection is false', () => {
        positionSpy.and.returnValue(false);
        expect(component.getLabelPositionForZeroOrNonnumericValue()).toEqual(
          20
        );
      });
      it('returns -config.labels.offset if positionInPositiveDirection is true', () => {
        positionSpy.and.returnValue(true);
        expect(component.getLabelPositionForZeroOrNonnumericValue()).toEqual(
          -20
        );
      });
    });
  });

  describe('getLabelPositionForNumericValue()', () => {
    let datum: BarDatum<string>;
    let fitsOutsideSpy: jasmine.Spy;
    const bbox = { width: 0, height: 0 } as DOMRect;
    beforeEach(() => {
      spyOn(component, 'getLabelOrigin').and.returnValue(50);
      fitsOutsideSpy = spyOn(component, 'labelFitsOutsideBar');
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      describe('quantitative value is positive', () => {
        it('calls barLabelFitsOutsideBar once', () => {
          component.getLabelPositionForNumericValue(datum, bbox);
          expect(component.getLabelOrigin).toHaveBeenCalledOnceWith(
            datum,
            true
          );
        });
        it('returns the origin plus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(70);
        });
        it('returns the origin minus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(30);
        });
      });
      describe('quantitative value is negative', () => {
        beforeEach(() => {
          datum.quantitative = -1;
        });
        it('calls barLabelFitsOutsideBar once', () => {
          component.getLabelPositionForNumericValue(datum, bbox);
          expect(component.getLabelOrigin).toHaveBeenCalledOnceWith(
            datum,
            false
          );
        });
        it('returns the origin minus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(30);
        });
        it('returns the origin plus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(70);
        });
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      describe('quantitative value is positive', () => {
        it('returns the origin minus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(30);
        });
        it('returns the origin plus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(70);
        });
      });
      describe('quantitative value is negative', () => {
        beforeEach(() => {
          datum.quantitative = -1;
        });
        it('returns the origin plus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(70);
        });
        it('returns the origin minus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(
            component.getLabelPositionForNumericValue(datum, bbox)
          ).toEqual(30);
        });
      });
    });
  });

  describe('getLabelOrigin', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarDimensionQuantitative').and.returnValue(10);
    });
    describe('if bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      it('calls getBarDimensionQuantitative once with datum and x if value is positive', () => {
        component.getLabelOrigin(datum, true);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'x'
        );
      });
      it('returns the value from getBarHeightQuantitative for positive values', () => {
        expect(component.getLabelOrigin(datum, true)).toBe(10);
      });
      it('returns zero for values that are not positive', () => {
        expect(component.getLabelOrigin(datum, false)).toBe(0);
      });
    });
    describe('if bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      it('calls getBarDimensionQuantitative once with datum and y if value is negative', () => {
        component.getLabelOrigin(datum, false);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'y'
        );
      });
      it('returns zero for positive values', () => {
        expect(component.getLabelOrigin(datum, true)).toBe(0);
      });
      it('returns the value from getBarHeightQuantitative for negative values', () => {
        expect(component.getLabelOrigin(datum, false)).toBe(10);
      });
    });
  });

  describe('positionZeroOrNonNumericValueLabelInPositiveDirection', () => {
    let quantDomainSpy: jasmine.Spy;
    beforeEach(() => {
      quantDomainSpy = spyOn(component, 'getQuantitativeDomainFromScale');
      component.config = horizontalConfig();
    });
    it('returns true if some values are positive', () => {
      expect(
        component.positionZeroOrNonNumericValueLabelInPositiveDirection()
      ).toEqual(true);
    });
    describe('no values are positive', () => {
      it('returns true if the domain max is > 0 and all values are zero or non-numeric', () => {
        component.config.quantitative.values = [
          undefined,
          0,
          0,
          null,
          'hello',
        ] as any;
        quantDomainSpy.and.returnValue([-10, 10]);
        expect(
          component.positionZeroOrNonNumericValueLabelInPositiveDirection()
        ).toEqual(true);
      });
      it('returns false if domain max is >= 0 and all values are zero or non-numeric', () => {
        component.config.quantitative.values = [
          undefined,
          0,
          0,
          null,
          'hello',
        ] as any;
        quantDomainSpy.and.returnValue([-10, -2]);
        expect(
          component.positionZeroOrNonNumericValueLabelInPositiveDirection()
        ).toEqual(false);
      });
      it('returns false if the domain max is > 0 and values are not all zero or non-numeric', () => {
        component.config.quantitative.values = [-1, -2, -10, -8];
        quantDomainSpy.and.returnValue([-10, 2]);
        expect(
          component.positionZeroOrNonNumericValueLabelInPositiveDirection()
        ).toEqual(false);
      });
    });
  });
});
