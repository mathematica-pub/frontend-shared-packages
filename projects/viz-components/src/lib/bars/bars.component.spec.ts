/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vicCategoricalDimension } from '../data-dimensions/categorical-dimension';
import { vicOrdinalDimension } from '../data-dimensions/ordinal-dimension';
import { vicQuantitativeDimension } from '../data-dimensions/quantitative-dimension';
import { VicColorUtilities } from '../shared/color-utilities';
import { PatternUtilities } from '../shared/pattern-utilities';
import { ValueUtilities } from '../shared/value-utilities';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarDatum, BarsComponent } from './bars.component';
import { vicBarsLabels } from './config/bars-labels';
import {
  VicBarsConfig,
  vicHorizontalBars,
  vicVerticalBars,
} from './config/bars.config';

type Datum = { value: number; state: string; fruit: string };

const data = [
  { value: 1, state: 'AL', fruit: 'apple' },
  { value: 2, state: 'AK', fruit: 'avocado' },
  { value: 3, state: 'AZ', fruit: 'banana' },
  { value: 4, state: 'CA', fruit: 'cherry' },
  { value: 5, state: 'CO', fruit: 'date' },
  { value: 6, state: 'CO', fruit: 'durian' },
];

function horizontalConfig(): VicBarsConfig<Datum, string> {
  return vicHorizontalBars<Datum, string>({
    data,
    quantitative: vicQuantitativeDimension<Datum>({
      valueAccessor: (x) => x.value,
    }),
    ordinal: vicOrdinalDimension<Datum, string>({
      valueAccessor: (x) => x.state,
    }),
    categorical: vicCategoricalDimension<Datum, string>({
      valueAccessor: (x) => x.fruit,
      range: ['red', 'blue', 'green', 'yellow', 'purple'],
    }),
    labels: vicBarsLabels({
      noValueFunction: () => 'no value',
    }),
  });
}

function verticalConfig(): VicBarsConfig<Datum, string> {
  return vicVerticalBars<Datum, string>({
    data,
    quantitative: vicQuantitativeDimension<Datum>({
      valueAccessor: (x) => x.value,
    }),
    ordinal: vicOrdinalDimension<Datum, string>({
      valueAccessor: (x) => x.state,
    }),
    categorical: vicCategoricalDimension<Datum, string>({
      valueAccessor: (x) => x.fruit,
      range: ['red', 'blue', 'green', 'yellow', 'purple'],
    }),
    labels: vicBarsLabels({
      noValueFunction: () => 'no value',
    }),
  });
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

  describe('setPropertiesFromRanges', () => {
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
        spyOn(component.config.categorical, 'getScale').and.returnValue(
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
        component.setPropertiesFromRanges(true);
        expect(
          component.config.quantitative.getScaleFromRange
        ).toHaveBeenCalledOnceWith([1, 2]);
      });
      it('calls the scale for y dimension once', () => {
        component.setPropertiesFromRanges(false);
        expect(
          component.config.ordinal.getScaleFromRange
        ).toHaveBeenCalledOnceWith([3, 4]);
      });
      it('calls updateScales once with the correct value', () => {
        component.setPropertiesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'quantitative scale',
          y: 'ordinal scale',
          categorical: 'categorical scale',
          useTransition: false,
        } as any);
      });
    });
    describe('chart is vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        spyOn(component.config.categorical, 'getScale').and.returnValue(
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
        component.setPropertiesFromRanges(true);
        expect(
          component.config.ordinal.getScaleFromRange
        ).toHaveBeenCalledOnceWith([1, 2]);
      });
      it('calls the scale for y dimension once', () => {
        component.setPropertiesFromRanges(false);
        expect(
          component.config.quantitative.getScaleFromRange
        ).toHaveBeenCalledOnceWith([3, 4]);
      });
      it('calls updateScales once with the correct value', () => {
        component.setPropertiesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'ordinal scale',
          y: 'quantitative scale',
          categorical: 'categorical scale',
          useTransition: false,
        } as any);
      });
    });
  });

  describe('drawMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'drawBars');
      spyOn(component, 'drawBarLabels');
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
      expect(component.drawBarLabels).toHaveBeenCalledOnceWith(100);
    });
    it('does not call drawBarLabels if config.labels is falsey', () => {
      (component.config as any).labels = undefined;
      component.drawMarks();
      expect(component.drawBarLabels).not.toHaveBeenCalled();
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
        i: 1,
        quantitative: 2,
        ordinal: 'AK',
        categorical: 'avocado',
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
      (component.config.categorical as any).fillPatterns = [
        { name: 'pattern', usePattern: () => true },
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
      datum.quantitative = undefined;
      component.getBarXQuantitative(datum);
      expect(component.scales.x).toHaveBeenCalledWith(10);
    });
    it('calls xScale once with the correct value if quant value is 0', () => {
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
      datum.quantitative = undefined;
      component.getBarYQuantitative(datum);
      expect(component.scales.y).toHaveBeenCalledWith(10);
    });
    it('calls yScale once with the correct value if quant value is 0', () => {
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
      datum.quantitative = undefined;
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
    const pattern = {
      name: 'pattern1',
      usePattern: (d) => d.fruit === 'avocado',
    };
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('blue');
      spyOn(PatternUtilities, 'getFill').and.returnValue('return-pattern');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      (component.config.categorical as any).fillPatterns = [pattern];
    });
    it('calls getBarColor once with the datum', () => {
      component.getBarPattern(datum);
      expect(component.getBarColor).toHaveBeenCalledOnceWith(datum);
    });
    it('calls getPatternFill once with the correct values', () => {
      component.getBarPattern(datum);
      expect(PatternUtilities.getFill).toHaveBeenCalledOnceWith(
        data[2],
        'blue',
        [pattern]
      );
    });
  });

  describe('getBarColor()', () => {
    let datum: BarDatum<string>;
    let categoricalSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      categoricalSpy = jasmine.createSpy('categorical').and.returnValue('blue');
      component.scales = {
        categorical: categoricalSpy,
      } as any;
    });
    it('calls categorical scale once with the correct value', () => {
      component.getBarColor(datum);
      expect(component.scales.categorical).toHaveBeenCalledOnceWith('banana');
    });
    it('returns the correct value', () => {
      expect(component.getBarColor(datum)).toEqual('blue');
    });
  });

  describe('getBarLabelText()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      spyOn(ValueUtilities, 'formatValue').and.returnValue('formatted value');
    });
    it('returns the correct value if value is not a number', () => {
      datum.quantitative = undefined;
      component.config.labels.noValueFunction = () => 'nope';
      expect(component.getBarLabelText(datum)).toEqual('nope');
    });
    it('calls formatValue once with full datum if valueFormat is a function', () => {
      (component.config.quantitative as any).valueFormat = (d) =>
        d.quantitative + '!';
      component.getBarLabelText(datum);
      expect(ValueUtilities.formatValue).toHaveBeenCalledOnceWith(
        data[2],
        component.config.quantitative.valueFormat
      );
    });
    it('calls formatValue once with the correct value if valueFormat is a string', () => {
      component.getBarLabelText(datum);
      expect(ValueUtilities.formatValue).toHaveBeenCalledOnceWith(
        3,
        component.config.quantitative.valueFormat
      );
    });
    it('returns the formatted value', () => {
      expect(component.getBarLabelText(datum)).toEqual('formatted value');
    });
  });

  describe('getBarLabelTextAnchor()', () => {
    let datum: BarDatum<string>;
    let alignTextSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });
    it('returns middle if bars are vertical', () => {
      component.config = verticalConfig();
      expect(component.getBarLabelTextAnchor(datum)).toEqual('middle');
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
      });
      it('calls alignTextInPositiveDirection once', () => {
        component.getBarLabelTextAnchor(datum);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(datum);
      });
      it('returns start if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getBarLabelTextAnchor(datum)).toEqual('start');
      });
      it('returns end if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getBarLabelTextAnchor(datum)).toEqual('end');
      });
    });
  });

  describe('getBarLabelDominantBaseline()', () => {
    let datum: BarDatum<string>;
    let alignTextSpy: jasmine.Spy;
    beforeEach(() => {
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });
    it('returns central if bars are horizontal', () => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      expect(component.getBarLabelDominantBaseline(datum)).toEqual('central');
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls alignTextInPositiveDirection once', () => {
        component.getBarLabelDominantBaseline(datum);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(datum);
      });
      it('returns text-after-edge if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getBarLabelDominantBaseline(datum)).toEqual(
          'text-after-edge'
        );
      });
      it('returns text-before-edge if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getBarLabelDominantBaseline(datum)).toEqual(
          'text-before-edge'
        );
      });
    });
  });

  describe('alignTextInPositiveDirection()', () => {
    let datum: BarDatum<string>;
    let zeroOrNonNumericSpy: jasmine.Spy;
    let fitsOutsideSpy: jasmine.Spy;
    beforeEach(() => {
      zeroOrNonNumericSpy = spyOn(
        component,
        'positionZeroOrNonNumericValueLabelInPositiveDirection'
      );
      fitsOutsideSpy = spyOn(component, 'barLabelFitsOutsideBar');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    describe('quantitative value is zero or non-numeric', () => {
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once - value is 0', () => {
        datum.quantitative = 0;
        component.alignTextInPositiveDirection(datum);
        expect(zeroOrNonNumericSpy).toHaveBeenCalledTimes(1);
      });
      it('calls positionZeroOrNonNumericValueLabelInPositiveDirection once - value is non-numeric', () => {
        datum.quantitative = undefined;
        component.alignTextInPositiveDirection(datum);
        expect(zeroOrNonNumericSpy).toHaveBeenCalledTimes(1);
      });
      it('returns the return value from positionZeroOrNonNumericValueLabelInPositiveDirection if quant value is non-numeric', () => {
        datum.quantitative = undefined;
        zeroOrNonNumericSpy.and.returnValue(true);
        component.alignTextInPositiveDirection(datum);
        expect(component.alignTextInPositiveDirection(datum)).toEqual(true);
      });
    });
    describe('quantitative value is not zero or non-numeric', () => {
      it('calls barLabelFitsOutsideBar once', () => {
        component.alignTextInPositiveDirection(datum);
        expect(fitsOutsideSpy).toHaveBeenCalledOnceWith(datum);
      });
      describe('barLabelFitsOutsideBar returns true', () => {
        it('returns true if value is higher than 0', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(component.alignTextInPositiveDirection(datum)).toEqual(true);
        });
        it('returns false if value is lower than 0', () => {
          datum.quantitative = -1;
          fitsOutsideSpy.and.returnValue(true);
          expect(component.alignTextInPositiveDirection(datum)).toEqual(false);
        });
      });
      describe('barLabelFitsOutsideBar returns false', () => {
        it('returns false if value is higher than 0', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.alignTextInPositiveDirection(datum)).toEqual(false);
        });
        it('returns true if value is lower than 0', () => {
          datum.quantitative = -1;
          fitsOutsideSpy.and.returnValue(false);
          expect(component.alignTextInPositiveDirection(datum)).toEqual(true);
        });
      });
    });
  });

  describe('getBarLabelColor()', () => {
    let datum: BarDatum<string>;
    let fitsOutsideSpy: jasmine.Spy;
    let higherContrastSpy: jasmine.Spy;
    beforeEach(() => {
      fitsOutsideSpy = spyOn(component, 'barLabelFitsOutsideBar');
      spyOn(component, 'getBarColor').and.returnValue('blue');
      higherContrastSpy = spyOn(
        VicColorUtilities,
        'getHigherContrastColorForBackground'
      );
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    it('returns the defaultLabelColor if quant value is non-numeric', () => {
      datum.quantitative = undefined;
      expect(component.getBarLabelColor(datum)).toEqual(
        component.config.labels.defaultLabelColor
      );
    });
    it('returns the defaultLabelColor if quant value is 0', () => {
      datum.quantitative = 0;
      expect(component.getBarLabelColor(datum)).toEqual(
        component.config.labels.defaultLabelColor
      );
    });
    describe('quant value is not 0 or non-numeric', () => {
      it('calls barLabelFitsOutsideBar once if', () => {
        component.getBarLabelColor(datum);
        expect(fitsOutsideSpy).toHaveBeenCalledTimes(1);
      });
      it('returns the defaultLabelColor if barLabelFitsOutsideBar returns true', () => {
        fitsOutsideSpy.and.returnValue(true);
        expect(component.getBarLabelColor(datum)).toEqual(
          component.config.labels.defaultLabelColor
        );
      });
      describe('barLabelFitsOutsideBar returns false', () => {
        beforeEach(() => {
          fitsOutsideSpy.and.returnValue(false);
        });
        it('calls getBarColor once with the datum', () => {
          component.getBarLabelColor(datum);
          expect(component.getBarColor).toHaveBeenCalledOnceWith(datum);
        });
        it('calls getHigherContrastColorForBackground once with the correct values', () => {
          component.getBarLabelColor(datum);
          expect(
            VicColorUtilities.getHigherContrastColorForBackground
          ).toHaveBeenCalledOnceWith(
            'blue',
            component.config.labels.defaultLabelColor,
            component.config.labels.withinBarAlternativeLabelColor
          );
        });
        it('returns the result of getHigherContrastColorForBackground', () => {
          higherContrastSpy.and.returnValue('higher contrast');
          expect(component.getBarLabelColor(datum)).toEqual('higher contrast');
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
    beforeEach(() => {
      xSpy = jasmine.createSpy('x').and.returnValue(10);
      ySpy = jasmine.createSpy('y').and.returnValue(20);
      spyOn(component, 'getBarToChartEdgeDistance').and.returnValue(10);
      getBarWidthSpy = spyOn(component, 'getBarLabelWidth');
      getBarHeightSpy = spyOn(component, 'getBarLabelHeight');
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
        component.barLabelFitsOutsideBar(datum);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [1, 2],
          10
        );
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is negative', () => {
        datum.quantitative = -1;
        component.barLabelFitsOutsideBar(datum);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          false,
          [1, 2],
          10
        );
      });
      it('returns true if the distance is less than the label width', () => {
        getBarWidthSpy.and.returnValue(5);
        expect(component.barLabelFitsOutsideBar(datum)).toEqual(true);
      });
      it('returns false if the distance is greater than the label width', () => {
        getBarWidthSpy.and.returnValue(15);
        expect(component.barLabelFitsOutsideBar(datum)).toEqual(false);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is positive', () => {
        component.barLabelFitsOutsideBar(datum);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [3, 4],
          20
        );
      });
      it('calls getBarToChartEdgeDistance once with the correct values - quant value is negative', () => {
        datum.quantitative = -1;
        component.barLabelFitsOutsideBar(datum);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          false,
          [3, 4],
          20
        );
      });
      it('returns true if the distance is less than the label height', () => {
        getBarHeightSpy.and.returnValue(5);
        expect(component.barLabelFitsOutsideBar(datum)).toEqual(true);
      });
      it('returns false if the distance is greater than the label height', () => {
        getBarHeightSpy.and.returnValue(15);
        expect(component.barLabelFitsOutsideBar(datum)).toEqual(false);
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

  describe('getBarLabelWidth()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.config.labels.offset = 10;
      spyOn(component, 'getLabelDomRect').and.returnValue({
        width: 20,
      } as any);
    });
    it('calls getLabelRect once with the correct values', () => {
      component.getBarLabelWidth(datum);
      expect(component.getLabelDomRect).toHaveBeenCalledOnceWith(datum);
    });
    it('returns the correct value', () => {
      expect(component.getBarLabelWidth(datum)).toEqual(30);
    });
  });

  describe('getBarLabelHeight()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      component.config = verticalConfig();
      datum = component.getBarDatumFromIndex(2);
      component.config.labels.offset = 10;
      spyOn(component, 'getLabelDomRect').and.returnValue({
        height: 20,
      } as any);
    });
    it('calls getLabelRect once with the correct values', () => {
      component.getBarLabelHeight(datum);
      expect(component.getLabelDomRect).toHaveBeenCalledOnceWith(datum);
    });
    it('returns the correct value', () => {
      expect(component.getBarLabelHeight(datum)).toEqual(30);
    });
  });

  describe('getBarLabelX()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelQuantitativeAxisPosition').and.returnValue(
        50
      );
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarLabelQuantitativeAxisPosition once with datum', () => {
        component.getBarLabelX(datum);
        expect(
          component.getBarLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(datum);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(datum)).toEqual(50);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarWidthOrdinal once', () => {
        component.getBarLabelX(datum);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(datum)).toEqual(5);
      });
    });
  });

  describe('getBarLabelY()', () => {
    let datum: BarDatum<string>;
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelQuantitativeAxisPosition').and.returnValue(
        50
      );
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarHeightOrdinal once', () => {
        component.getBarLabelY(datum);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(datum)).toEqual(5);
      });
    });
    describe('bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
      });
      it('calls getBarLabelQuantitativeAxisPosition once with datum', () => {
        component.getBarLabelY(datum);
        expect(
          component.getBarLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(datum);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(datum)).toEqual(50);
      });
    });
  });

  describe('getBarLabelQuantitativeAxisPosition()', () => {
    let datum: BarDatum<string>;
    let isZeroOrNonNumericSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(
        component,
        'getBarLabelPositionForZeroOrNonnumericValue'
      ).and.returnValue(10);
      spyOn(component, 'getBarLabelPositionForNumericValue').and.returnValue(
        20
      );
      isZeroOrNonNumericSpy = spyOn(component, 'isZeroOrNonNumeric');
      component.config = horizontalConfig();
      datum = component.getBarDatumFromIndex(2);
    });
    describe('quantitative value is zero or non-numeric', () => {
      beforeEach(() => {
        isZeroOrNonNumericSpy.and.returnValue(true);
      });
      it('calls isZeroOrNonNumeric once', () => {
        component.getBarLabelQuantitativeAxisPosition(datum);
        expect(component.isZeroOrNonNumeric).toHaveBeenCalledTimes(1);
      });
      it('calls getBarLabelPositionForZeroOrNonnumericValue once if value is zero', () => {
        isZeroOrNonNumericSpy.and.returnValue(true);
        component.getBarLabelQuantitativeAxisPosition(datum);
        expect(
          component.getBarLabelPositionForZeroOrNonnumericValue
        ).toHaveBeenCalledTimes(1);
      });
      it('returns the value from getBarLabelPositionForZeroOrNonnumericValue', () => {
        expect(component.getBarLabelQuantitativeAxisPosition(datum)).toEqual(
          10
        );
      });
    });
    describe('quantitative value is numeric and not zero', () => {
      beforeEach(() => {
        isZeroOrNonNumericSpy.and.returnValue(false);
      });
      it('calls getBarLabelPositionForNumericValue once', () => {
        component.getBarLabelQuantitativeAxisPosition(datum);
        expect(
          component.getBarLabelPositionForNumericValue
        ).toHaveBeenCalledOnceWith(datum);
      });
      it('returns the value from getBarLabelPositionForNumericValue', () => {
        expect(component.getBarLabelQuantitativeAxisPosition(datum)).toEqual(
          20
        );
      });
    });
  });

  describe('getBarLabelPositionForZeroOrNonnumericValue()', () => {
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
        component.getBarLabelPositionForZeroOrNonnumericValue();
        expect(positionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns config.labels.offset if positionInPositiveDirection is true', () => {
        positionSpy.and.returnValue(true);
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          20
        );
      });
      it('returns -config.labels.offset if positionInPositiveDirection is false', () => {
        positionSpy.and.returnValue(false);
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
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
        component.getBarLabelPositionForZeroOrNonnumericValue();
        expect(positionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns config.labels.offset if positionInPositiveDirection is false', () => {
        positionSpy.and.returnValue(false);
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          20
        );
      });
      it('returns -config.labels.offset if positionInPositiveDirection is true', () => {
        positionSpy.and.returnValue(true);
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          -20
        );
      });
    });
  });

  describe('getBarLabelPositionForNumericValue()', () => {
    let datum: BarDatum<string>;
    let fitsOutsideSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getBarLabelOrigin').and.returnValue(50);
      fitsOutsideSpy = spyOn(component, 'barLabelFitsOutsideBar');
    });
    describe('bars are horizontal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      describe('quantitative value is positive', () => {
        it('calls barLabelFitsOutsideBar once', () => {
          component.getBarLabelPositionForNumericValue(datum);
          expect(component.getBarLabelOrigin).toHaveBeenCalledOnceWith(
            'node' as any,
            true
          );
        });
        it('returns the origin plus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            70
          );
        });
        it('returns the origin minus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            30
          );
        });
      });
      describe('quantitative value is negative', () => {
        beforeEach(() => {
          datum.quantitative = -1;
        });
        it('calls barLabelFitsOutsideBar once', () => {
          component.getBarLabelPositionForNumericValue(datum);
          expect(component.getBarLabelOrigin).toHaveBeenCalledOnceWith(
            'node' as any,
            false
          );
        });
        it('returns the origin minus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            30
          );
        });
        it('returns the origin plus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            70
          );
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
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            30
          );
        });
        it('returns the origin plus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            70
          );
        });
      });
      describe('quantitative value is negative', () => {
        beforeEach(() => {
          datum.quantitative = -1;
        });
        it('returns the origin plus the offset if the label fits outside the bar', () => {
          fitsOutsideSpy.and.returnValue(true);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            70
          );
        });
        it('returns the origin minus the offset if the label fits inside the bar', () => {
          fitsOutsideSpy.and.returnValue(false);
          expect(component.getBarLabelPositionForNumericValue(datum)).toEqual(
            30
          );
        });
      });
    });
  });

  describe('getBarLabelOrigin', () => {
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
        component.getBarLabelOrigin(datum, true);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'x'
        );
      });
      it('returns the value from getBarHeightQuantitative for positive values', () => {
        expect(component.getBarLabelOrigin(datum, true)).toBe(10);
      });
      it('returns zero for values that are not positive', () => {
        expect(component.getBarLabelOrigin(datum, false)).toBe(0);
      });
    });
    describe('if bars are vertical', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        datum = component.getBarDatumFromIndex(2);
        component.config.labels.offset = 20;
      });
      it('calls getBarDimensionQuantitative once with datum and y if value is positive', () => {
        component.getBarLabelOrigin(datum, true);
        expect(component.getBarDimensionQuantitative).toHaveBeenCalledOnceWith(
          datum,
          'y'
        );
      });
      it('returns the value from getBarHeightQuantitative for positive values', () => {
        expect(component.getBarLabelOrigin(datum, true)).toBe(10);
      });
      it('returns zero for values that are not positive', () => {
        expect(component.getBarLabelOrigin(datum, false)).toBe(0);
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
