/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vicCategoricalDimension } from '../data-marks/dimensions/categorical-dimension';
import { vicOrdinalDimension } from '../data-marks/dimensions/ordinal-dimension';
import { vicQuantitativeDimension } from '../data-marks/dimensions/quantitative-dimension';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarsComponent } from './bars.component';
import {
  HORIZONTAL_BARS_DIMENSIONS,
  VERTICAL_BARS_DIMENSIONS,
} from './config/bars-dimensions';
import { vicBarsLabels } from './config/bars-labels';
import { VicBarsConfig } from './config/bars.config';

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
  return new VicBarsConfig(HORIZONTAL_BARS_DIMENSIONS, {
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
      noValueFunction: (d) => 'no value',
    }),
  });
}

function verticalConfig(): VicBarsConfig<Datum, string> {
  return new VicBarsConfig(VERTICAL_BARS_DIMENSIONS, {
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
      noValueFunction: (d) => 'no value',
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
        component.config.categorical.scale = 'categorical scale' as any;
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
        component.config.categorical.scale = 'categorical scale' as any;
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

  // describe('getBarLabelText()', () => {
  //   beforeEach(() => {
  //     component.config = horizontalConfig();
  //     component.config.quantitative.valueFormat = ',.1f';
  //     //   component.config = new VicBarsConfig({
  //     //     dimensions: new VicHorizontalBarsDimensions(),
  //     //     quantitative: new VicQuantitativeDimension({
  //     //       valueFormat: ',.1f',
  //     //       values: [10000.1, 20000.2, 30000.3],
  //     //     }),
  //     //     labels: new VicBarsLabels({
  //     //       noValueFunction: (d) => 'no value',
  //     //     }),
  //     //     data: [{ num: 1 }, { num: 2 }, { num: 3 }],
  //     //   });
  //     // });
  //     describe('if user has provided a custom formatting function', () => {
  //       beforeEach(() => {
  //         component.config.quantitative.valueFormat = (value) => value + '!';
  //       });
  //       it('integration: returns the correct value correctly formatted as a string', () => {
  //         expect(component.getBarLabelText(1)).toEqual('2!');
  //       });
  //       it('integration: returns the correct value correctly formatted as a string if value is null or undefined', () => {
  //         component.config.quantitative.values = [null, undefined, null];
  //         expect(component.getBarLabelText(1)).toEqual('no value');
  //       });
  //     });
  //     describe('integration: if user has not provided a custom formatting function', () => {
  //       it('integration: returns the result of the noValueFunction if value null or undefined', () => {
  //         component.config.quantitative.values = [null, undefined, null];
  //         expect(component.getBarLabelText(1)).toEqual('no value');
  //       });
  //       it('integration: returns the correct value correctly formatted as a string if value is not null or undefined', () => {
  //         expect(component.getBarLabelText(1)).toEqual('2.0');
  //       });
  //     });
  //   });

  describe('getBarLabelColor', () => {
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      component.config = horizontalConfig();
    });
    describe('config.labels.color is defined', () => {
      beforeEach(() => {
        component.config.labels.color = 'label color' as any;
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelColor(1)).toEqual('label color');
      });
      it('does not call getBarColor', () => {
        component.getBarLabelColor(1);
        expect(component.getBarColor).not.toHaveBeenCalled();
      });
    });

    describe('config.labels.color is not defined', () => {
      it('calls getBarColor once', () => {
        component.getBarLabelColor(1);
        expect(component.getBarColor).toHaveBeenCalledOnceWith(1);
      });

      it('returns the correct value', () => {
        expect(component.getBarLabelColor(1)).toEqual('bar color');
      });
    });
  });

  describe('getBarColor()', () => {
    beforeEach(() => {
      const categoricalSpy = jasmine
        .createSpy('categorical')
        .and.returnValue('blue');
      component.scales = {
        categorical: categoricalSpy,
      } as any;
      component.config = {
        ordinal: {
          values: [1, 2, 3],
        },
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
    });
    it('calls categorical scale once with the correct value', () => {
      component.getBarColor(0);
      expect(component.scales.categorical).toHaveBeenCalledOnceWith(1);
    });
    it('returns the correct value', () => {
      const result = component.getBarColor(0);
      expect(result).toEqual('blue');
    });
  });

  describe('getBarPattern', () => {
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('blue');
      component.config = {
        ordinal: {
          values: [1, 2, 3],
        },
        categorical: {},
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
    });
    it('returns correct value when pattern is used', () => {
      (component.config.categorical as any).fillPatterns = [
        { name: 'pattern', predicate: (d: any) => true },
      ];
      const result = component.getBarPattern(0);
      expect(result).toEqual(`url(#pattern)`);
    });
  });

  describe('getBarX()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarXOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarXQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarXOrdinal once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXQuantitative', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('ordinal' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarXQuantitative once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXOrdinal', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarXOrdinal()', () => {
    beforeEach(() => {
      component.scales = {
        x: jasmine.createSpy('x').and.returnValue(10),
      } as any;
      component.config = {
        ordinal: {
          values: [1, 2, 3],
        },
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
    });
    it('calls xScale once and with the correct value', () => {
      component.getBarXOrdinal(2);
      expect(component.scales.x).toHaveBeenCalledOnceWith(3);
    });
    it('returns the correct value', () => {
      expect(component.getBarXOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarXQuantitative()', () => {
    beforeEach(() => {
      component.config = horizontalConfig();
      component.scales = {
        x: jasmine.createSpy('x').and.returnValue(50),
      } as any;
      component.config.hasBarsWithNegativeValues = true;
      component.config.quantitative.values = [1, 2, 3];
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale once and with the correct value if x value is less than zero', () => {
        component.config.quantitative.values = [-1, 2, 3];
        component.getBarXQuantitative(0);
        expect(component.scales.x).toHaveBeenCalledOnceWith(-1);
      });

      it('calls xScale once with 0 if x value is greater than zero', () => {
        component.getBarXQuantitative(2);
        expect(component.scales.x).toHaveBeenCalledOnceWith(0);
      });
    });
    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale once and with the correct value', () => {
        component.config.hasBarsWithNegativeValues = false;
        component.getBarXQuantitative(0);
        expect(component.scales.x).toHaveBeenCalledOnceWith(2);
      });
    });
    it('returns the correct value', () => {
      expect(component.getBarXQuantitative(0)).toEqual(50);
    });
  });

  describe('getBarY()', () => {
    beforeEach(() => {
      component.scales = {
        y: jasmine.createSpy('y').and.returnValue(50),
      } as any;
      component.config = verticalConfig();
      component.config.quantitative.values = [1, 2, 3];
    });
    it('calls yScale once and with the correct value', () => {
      component.getBarY(2);
      expect(component.scales.y).toHaveBeenCalledOnceWith(3);
    });
    it('returns the correct value', () => {
      expect(component.getBarY(2)).toEqual(50);
    });
  });

  describe('getBarWidth()', () => {
    let ordinalSpy: jasmine.Spy;
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      ordinalSpy = spyOn(component, 'getBarWidthOrdinal').and.returnValue(300);
      quantSpy = spyOn(component, 'getBarWidthQuantitative').and.returnValue(
        200
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = verticalConfig();
      });
      it('calls getBarWidthOrdinal once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledOnceWith(100);
      });
      it('does not call getBarWidthQuantitative', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(300);
      });
      it('returns 0 if getOrdinal returns undefined', () => {
        ordinalSpy.and.returnValue(undefined);
        expect(component.getBarWidth(100)).toEqual(0);
      });
      it('returns 0 if getOrdinal returns null', () => {
        ordinalSpy.and.returnValue(null);
        expect(component.getBarWidth(100)).toEqual(0);
      });
    });
    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
      });
      it('calls getBarWidthQuantitative once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).toHaveBeenCalledOnceWith(100);
      });
      it('does not call getBarWidthOrdinal', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(200);
      });
      it('returns 0 if getQuantitative returns undefined', () => {
        quantSpy.and.returnValue(undefined);
        expect(component.getBarWidth(100)).toEqual(0);
      });
      it('returns 0 if getQuantitative returns null', () => {
        quantSpy.and.returnValue(null);
        expect(component.getBarWidth(100)).toEqual(0);
      });
    });
  });

  describe('getBarLabelX', () => {
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      quantSpy = spyOn(component, 'getBarWidthQuantitative').and.returnValue(
        50
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        component.config.labels.offset = 4;
      });
      it('calls getBarWidthOrdinal once with the correct value', () => {
        component.getBarLabelX(100);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledOnceWith(100);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(100)).toEqual(5);
      });
    });
    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        component.config.labels.offset = 4;
      });
      it('calls getBarWidthQuantitative once and with the correct value', () => {
        component.getBarLabelX(2);
        expect(component.getBarWidthQuantitative).toHaveBeenCalledOnceWith(2);
      });
      it('returns the correct value if barWidthQuantitative is a number', () => {
        expect(component.getBarLabelX(2)).toEqual(54);
      });
      it('returns the correct value if barWidthQuantitative is not a number', () => {
        quantSpy.and.returnValue(null as any);
        expect(component.getBarLabelX(2)).toEqual(4);
      });
    });
  });

  describe('getBarWidthOrdinal()', () => {
    beforeEach(() => {
      component.scales = {
        x: {
          bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
        },
      } as any;
    });
    it('calls xScale.bandwidth once', () => {
      component.getBarWidthOrdinal(2);
      expect((component.scales.x as any).bandwidth).toHaveBeenCalledTimes(1);
    });
    it('returns the correct value', () => {
      expect(component.getBarWidthOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarWidthQuantitative()', () => {
    let xScaleSpy: jasmine.Spy;
    beforeEach(() => {
      xScaleSpy = jasmine.createSpy('x').and.returnValues(20, 50);
      component.scales = { x: xScaleSpy } as any;
      component.config = horizontalConfig();
      component.config.quantitative.values = [1, 2, 3];
      component.config.quantitative.domainIncludesZero = true;
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('domainIncludesZero is true', () => {
      it('hasBarsWithNegativeValues is true -- calls xScale twice and with the correct values', () => {
        component.config.hasBarsWithNegativeValues = true;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
      it('hasBarsWithNegativeValues is false -- calls xScale twice and with the correct values', () => {
        component.config.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });
    describe('domainIncludesZero is false', () => {
      beforeEach(() => {
        component.config.quantitative.domainIncludesZero = false;
      });
      it('hasBarsWithNegativeValues is true -- calls xScale twice and with the correct values', () => {
        component.config.hasBarsWithNegativeValues = true;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [10]]);
      });
      it('hasBarsWithNegativeValues is false -- calls xScale twice and with the correct values', () => {
        component.config.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });
    it('returns the correct value', () => {
      expect(component.getBarWidthQuantitative(2)).toEqual(30);
    });
  });

  describe('getBarHeight()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        'quantitative' as any
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = verticalConfig();
      });
      it('calls getBarHeightQuantitative once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).toHaveBeenCalledOnceWith(
          100
        );
      });
      it('does not call getBarHeightOrdinal', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('quantitative' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
      });
      it('calls getBarHeightOrdinal once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledOnceWith(100);
      });
      it('does not call getBarHeightQuantitative', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).not.toHaveBeenCalled();
      });
      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('ordinal' as any);
      });
    });
  });

  describe('getBarLabelY', () => {
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      quantSpy = spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        50
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = verticalConfig();
        component.config.labels.offset = 4;
      });
      it('calls getBarHeightQuantitative once and with the correct value', () => {
        component.getBarLabelY(2);
        expect(component.getBarHeightQuantitative).toHaveBeenCalledOnceWith(2);
      });
      it('returns the correct value if barHeightQuantitative is a number', () => {
        expect(component.getBarLabelY(2)).toEqual(54);
      });
      it('returns the correct value if barHeightQuantitative is not a number', () => {
        quantSpy.and.returnValue(null as any);
        expect(component.getBarLabelY(2)).toEqual(4);
      });
    });
    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = horizontalConfig();
        component.config.labels.offset = 4;
      });
      it('calls getBarHeightOrdinal once with the correct value', () => {
        component.getBarLabelY(100);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledOnceWith(100);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(100)).toEqual(5);
      });
    });
  });

  describe('getBarHeightOrdinal()', () => {
    beforeEach(() => {
      component.scales = {
        y: {
          bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
        },
      } as any;
    });
    it('calls scales.y.bandwidth once', () => {
      component.getBarHeightOrdinal(2);
      expect((component.scales.y as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarHeightQuantitative()', () => {
    let yScaleSpy: jasmine.Spy;
    beforeEach(() => {
      yScaleSpy = jasmine.createSpy('y').and.returnValue(-50);
      component.scales = { y: yScaleSpy } as any;
      component.config = horizontalConfig();
      component.config.hasBarsWithNegativeValues = true;
      component.config.quantitative.values = [1, 2, 3];
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls yScale once and with the correct values', () => {
        component.getBarHeightQuantitative(2);
        expect(component.scales.y).toHaveBeenCalledOnceWith(-3);
      });
    });
    describe('hasBarsWithNegativeValues is false', () => {
      it('calls yScale once and with the correct value', () => {
        component.config.hasBarsWithNegativeValues = false;
        component.getBarHeightQuantitative(2);
        expect(component.scales.y).toHaveBeenCalledOnceWith(-1);
      });
    });
    it('returns the correct value', () => {
      expect(component.getBarHeightQuantitative(2)).toEqual(50);
    });
  });
});
