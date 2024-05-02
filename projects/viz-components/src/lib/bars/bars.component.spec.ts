/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarsComponent } from './bars.component';
import {
  VicBarsConfig,
  VicBarsLabelsConfig,
  VicHorizontalBarsDimensionsConfig,
  VicVerticalBarsDimensionsConfig,
} from './bars.config';

describe('BarsComponent', () => {
  let component: BarsComponent<any, string>;
  let fixture: ComponentFixture<BarsComponent<any, string>>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsComponent<any, string>);
    component = fixture.componentInstance;
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setDimensionPropertiesFromData');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'setBarsKeyFunction');
      component.setPropertiesFromData();
    });

    it('calls setValueArrays once', () => {
      expect(component.setDimensionPropertiesFromData).toHaveBeenCalledTimes(1);
    });
    it('calls setValueArrayIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setHasBarsWithNegativeValues once', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });
    it('calls setBarsKeyFunction once', () => {
      expect(component.setBarsKeyFunction).toHaveBeenCalledOnceWith();
    });
  });

  describe('setDimensionPropertiesFromData()', () => {
    let ordinalPropSpy: jasmine.Spy;
    let quantitativePropSpy: jasmine.Spy;
    let categoryPropSpy: jasmine.Spy;
    beforeEach(() => {
      ordinalPropSpy = jasmine.createSpy('setPropertiesFromData');
      quantitativePropSpy = jasmine.createSpy('setPropertiesFromData');
      categoryPropSpy = jasmine.createSpy('setPropertiesFromData');
      component.config = {
        data: [
          { color: 'red', value: 1, size: 10 },
          { color: 'orange', value: 2, size: 20 },
          { color: 'yellow', value: 3, size: 30 },
          { color: 'green', value: 4, size: 40 },
          { color: 'blue', value: 5, size: 50 },
        ],
        ordinal: {
          valueAccessor: (x) => x.size,
          setPropertiesFromData: ordinalPropSpy,
        },
        quantitative: {
          valueAccessor: (x) => x.value,
          setPropertiesFromData: quantitativePropSpy,
        },
        category: {
          valueAccessor: (x) => x.color,
          setPropertiesFromData: categoryPropSpy,
        },
        dimensions: {
          x: 'ordinal',
          y: 'quantitative',
          ordinal: 'x',
          quantitative: 'y',
        },
      } as any;
    });
    describe('it calls setPropertiesFromData for the quantitative dimension', () => {
      it('calls setPropertiesFromData once with the correct value', () => {
        component.setDimensionPropertiesFromData();
        expect(quantitativePropSpy).toHaveBeenCalledOnceWith(
          component.config.data
        );
      });
    });
    describe('it calls setPropertiesFromData for the ordinal dimension', () => {
      it('calls setPropertiesFromData once with the correct value', () => {
        component.setDimensionPropertiesFromData();
        expect(ordinalPropSpy).toHaveBeenCalledOnceWith(
          component.config.data,
          false
        );
      });
    });
    describe('it calls setPropertiesFromData for the category dimension', () => {
      it('calls setPropertiesFromData once with the correct value', () => {
        component.setDimensionPropertiesFromData();
        expect(categoryPropSpy).toHaveBeenCalledOnceWith(component.config.data);
      });
    });
  });

  describe('integration: setDimensionPropertiesFromData/setValueIndicies', () => {
    beforeEach(() => {
      component.config = new VicBarsConfig();
      component.config.data = [
        { color: 'red', value: 1, state: 'AL' },
        { color: 'orange', value: 2, state: 'AK' },
        { color: 'yellow', value: 3, state: 'AZ' },
        { color: 'green', value: 4, state: 'AR' },
        { color: 'blue', value: 5, state: 'CA' },
      ];
      component.config.quantitative.valueAccessor = (d) => d.value;
      component.config.ordinal.valueAccessor = (d) => d.state;
      component.config.category.valueAccessor = (d) => d.color;
      component.config.dimensions = new VicVerticalBarsDimensionsConfig();
    });
    describe('no user set domain', () => {
      beforeEach(() => {
        component.setDimensionPropertiesFromData();
        component.setValueIndicies();
      });
      it('correctly sets quantitative values', () => {
        expect(component.config.quantitative.values).toEqual([1, 2, 3, 4, 5]);
      });
      it('correctly sets ordinal values', () => {
        expect(component.config.ordinal.values).toEqual([
          'AL',
          'AK',
          'AZ',
          'AR',
          'CA',
        ]);
      });
      it('correctly sets category values', () => {
        expect(component.config.category.values).toEqual([
          'red',
          'orange',
          'yellow',
          'green',
          'blue',
        ]);
      });
      it('correctly sets valueIndicies', () => {
        expect(component.valueIndicies).toEqual([0, 1, 2, 3, 4]);
      });
    });
    describe('user domain excludes some values', () => {
      beforeEach(() => {
        component.config.ordinal.domain = ['AL', 'AK', 'CA'];
        component.setDimensionPropertiesFromData();
        component.setValueIndicies();
      });
      it('correctly sets valueIndicies - user input a domain that does', () => {
        component.setValueIndicies();
        expect(component.valueIndicies).toEqual([0, 1, 4]);
      });
    });
  });

  describe('integration: setHasBarsWithNegativeValues', () => {
    beforeEach(() => {
      component.config = new VicBarsConfig();
      component.config.quantitative.valueAccessor = (d) => d.value;
      component.config.ordinal.valueAccessor = (d) => d.state;
      component.config.category.valueAccessor = (d) => d.color;
      component.config.dimensions = new VicHorizontalBarsDimensionsConfig();
    });
    it('sets hasBarsWithNegativeValues to true if dataMin is less than zero', () => {
      component.config.data = [
        { color: 'red', value: -5, state: 'AL' },
        { color: 'orange', value: 2, state: 'AK' },
        { color: 'yellow', value: 3, state: 'AZ' },
        { color: 'green', value: 4, state: 'AR' },
        { color: 'blue', value: 5, state: 'CA' },
      ];
      component.setDimensionPropertiesFromData();
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(true);
    });
    it('sets hasBarsWithNegativeValues to false if dataMin is greater than zero', () => {
      component.config.data = [
        { color: 'red', value: 0, state: 'AL' },
        { color: 'orange', value: 2, state: 'AK' },
        { color: 'yellow', value: 3, state: 'AZ' },
        { color: 'green', value: 4, state: 'AR' },
        { color: 'blue', value: 5, state: 'CA' },
      ];
      component.setDimensionPropertiesFromData();
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(false);
    });
  });

  describe('setPropertiesFromRanges', () => {
    let ordinalSpy: jasmine.Spy;
    let quantitativeSpy: jasmine.Spy;
    beforeEach(() => {
      ordinalSpy = jasmine
        .createSpy('getScaleFromRange')
        .and.returnValue('ord scale');
      quantitativeSpy = jasmine
        .createSpy('getScaleFromRange')
        .and.returnValue('quant scale');
      component.config = {
        ordinal: {
          getScaleFromRange: ordinalSpy,
        },
        quantitative: {
          getScaleFromRange: quantitativeSpy,
        },
        category: {
          scale: 'category scale',
        },
      } as any;
      component.ranges = {
        x: [1, 2],
        y: [3, 4],
      } as any;
      component.config.dimensions = {
        x: 'ordinal',
        y: 'quantitative',
      } as any;
      component.chart = {
        updateScales: jasmine.createSpy('updatesScales'),
      } as any;
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
    describe('if ordinal is x', () => {
      it('calls updateScales once with the correct values', () => {
        component.setPropertiesFromRanges(true);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'ord scale',
          y: 'quant scale',
          category: 'category scale',
          useTransition: true,
        } as any);
      });
    });
    describe('if ordinal is not x', () => {
      it('calls updateScales once with the correct value', () => {
        component.config.dimensions = {
          y: 'ordinal',
          x: 'quantitative',
        } as any;
        component.setPropertiesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'quant scale',
          y: 'ord scale',
          category: 'category scale',
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
      component.config = new VicBarsConfig();
      component.config.labels = new VicBarsLabelsConfig();
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
      component.config.labels = undefined;
      component.drawMarks();
      expect(component.drawBarLabels).not.toHaveBeenCalled();
    });

    it('calls updateBarElements', () => {
      component.drawMarks();
      expect(component.updateBarElements).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBarLabelText()', () => {
    beforeEach(() => {
      component.config = {
        dimensions: { quantitative: 'x' },
        quantitative: {
          values: [10000.1, 20000.2, 30000.3],
          valueFormat: ',.1f',
        },
        labels: {
          noValueFunction: (d) => 'no value',
        },
      } as any;
      component.config.data = [{ num: 1 }, { num: 2 }, { num: 3 }];
    });
    describe('if user has provided a custom formatting function', () => {
      beforeEach(() => {
        component.config.quantitative.valueFormat = (value) => value.num + '!';
      });
      it('integration: returns the correct value correctly formatted as a string', () => {
        expect(component.getBarLabelText(1)).toEqual('2!');
      });
      it('integration: returns the correct value correctly formatted as a string if value is null or undefined', () => {
        component.config.quantitative.values = [null, undefined, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
    });
    describe('integration: if user has not provided a custom formatting function', () => {
      it('integration: returns the result of the noValueFunction if value null or undefined', () => {
        component.config.quantitative.values = [null, undefined, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
      it('integration: returns the correct value correctly formatted as a string if value is not null or undefined', () => {
        expect(component.getBarLabelText(1)).toEqual('20,000.2');
      });
    });
  });

  describe('getBarLabelColor', () => {
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      component.config = new VicBarsConfig();
      component.config.labels = new VicBarsLabelsConfig();
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
      const categorySpy = jasmine.createSpy('category').and.returnValue('blue');
      component.scales = {
        category: categorySpy,
      } as any;
      component.config = {
        ordinal: {
          values: [1, 2, 3],
        },
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
    });
    it('calls category scale once with the correct value', () => {
      component.getBarColor(0);
      expect(component.scales.category).toHaveBeenCalledOnceWith(1);
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
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
    });
    it('returns correct value when pattern is used', () => {
      component.config.patternPredicates = [
        { patternName: 'pattern', predicate: (d: any) => true },
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
      component.scales = {
        x: jasmine.createSpy('x').and.returnValue(50),
      } as any;
      component.hasBarsWithNegativeValues = true;
      component.config = {
        quantitative: {
          values: [1, 2, 3],
        },
      } as any;
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
        component.hasBarsWithNegativeValues = false;
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
      component.config = {
        quantitative: {
          values: [1, 2, 3],
        },
        dimensions: {
          quantitative: 'y',
          y: 'quantitative',
        },
      } as any;
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
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
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
        component.config.dimensions.ordinal = 'y';
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
      component.config = {
        labels: {
          offset: 4,
        },
        dimensions: {
          ordinal: 'x',
        },
      } as any;
    });
    describe('x dimension is  ordinal', () => {
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
        component.config.dimensions.ordinal = 'y';
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
      component.config = new VicBarsConfig();
      component.config.quantitative.values = [1, 2, 3];
      component.config.quantitative.domainIncludesZero = true;
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('domainIncludesZero is true', () => {
      it('hasBarsWithNegativeValues is true -- calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = true;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
      it('hasBarsWithNegativeValues is false -- calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });

    describe('domainIncludesZero is false', () => {
      beforeEach(() => {
        component.config.quantitative.domainIncludesZero = false;
      });
      it('hasBarsWithNegativeValues is true -- calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = true;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [10]]);
      });
      it('hasBarsWithNegativeValues is false -- calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = false;
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
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
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
        component.config.dimensions.ordinal = 'y';
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
      component.config = {
        labels: {
          offset: 4,
        },
        dimensions: {
          ordinal: 'x',
        },
      } as any;
    });
    describe('x dimension is ordinal', () => {
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
        component.config.dimensions.ordinal = 'y';
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
      component.hasBarsWithNegativeValues = true;
      component.config = {
        quantitative: {
          values: [1, 2, 3],
        },
      } as any;
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
        component.hasBarsWithNegativeValues = false;
        component.getBarHeightQuantitative(2);
        expect(component.scales.y).toHaveBeenCalledOnceWith(-1);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightQuantitative(2)).toEqual(50);
    });
  });
});
