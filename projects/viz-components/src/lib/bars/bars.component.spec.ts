/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternSet } from 'd3';
import { MainServiceStub } from '../testing/stubs/services/main.service.stub';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarsComponent } from './bars.component';
import { VicBarsConfig, VicBarsLabelsConfig } from './bars.config';

describe('BarsComponent', () => {
  let component: BarsComponent<any>;
  let fixture: ComponentFixture<BarsComponent<any>>;
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
    fixture = TestBed.createComponent(BarsComponent);
    component = fixture.componentInstance;
  });

  describe('setPropertiesFromConfig()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initNonQuantitativeDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'initUnpaddedQuantitativeDomain');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setBarsKeyFunction');
      component.setPropertiesFromConfig();
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });
    it('calls initNonQuantitativeDomains once', () => {
      expect(component.initNonQuantitativeDomains).toHaveBeenCalledTimes(1);
    });
    it('calls setValueArrayIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });
    it('calls setHasBarsWithNegativeValues once', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });
    it('calls initUnpaddedQuantitativeDomain once', () => {
      expect(component.initUnpaddedQuantitativeDomain).toHaveBeenCalledTimes(1);
    });
    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });
    it('calls setBarsKeyFunction once', () => {
      expect(component.setBarsKeyFunction).toHaveBeenCalledOnceWith();
    });
  });

  describe('int: initUnpaddedQuantitativeDomain()', () => {
    describe('when min and max are positive', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [2, 97],
          },
        } as any;
      });

      it('sets min to zero, max stays the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedDomain).toEqual([0, 97]);
      });
    });

    describe('when min and max are negative', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [-277, -6],
          },
        } as any;
      });

      it('sets max to zero, min stays the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedDomain).toEqual([-277, 0]);
      });
    });

    describe('when min is negative and max is positive', () => {
      beforeEach(() => {
        component.config = {
          quantitative: {
            domain: [-3, 44],
          },
        } as any;
      });

      it('max and min stay the same', () => {
        component.initUnpaddedQuantitativeDomain();
        expect(component.unpaddedDomain).toEqual([-3, 44]);
      });
    });
  });

  describe('setValueArrays()', () => {
    beforeEach(() => {
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
        },
        quantitative: {
          valueAccessor: (x) => x.value,
        },
        category: {
          valueAccessor: (x) => x.color,
        },
        dimensions: {
          x: 'ordinal',
          y: 'quantitative',
        },
      } as any;
    });
    describe('if x dimension is ordinal', () => {
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([10, 20, 30, 40, 50]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('if x dimension is quantitative', () => {
      beforeEach(() => {
        component.config.dimensions = {
          x: 'quantitative',
          y: 'ordinal',
        } as any;
      });
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([1, 2, 3, 4, 5]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([10, 20, 30, 40, 50]);
      });
    });

    it('correctly sets category values', () => {
      component.setValueArrays();
      expect(component.values.category).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('initNonQuantitativeDomains', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {},
        category: {},
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          1, 2, 3, 4, 5,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 1, 2, 3, 3, 11, 11, 12];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          0, 1, 2, 3, 11, 12,
        ]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.dimensions = {
          ordinal: 'y',
        } as any;
      });
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          50, 40, 30, 20, 10,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 10, 20, 30, 30, 110, 110, 120];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          120, 110, 30, 20, 10, 0,
        ]);
      });
    });

    it('correctly defines category.domain if category.domain is undefined', () => {
      component.config.category.domain = undefined;
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });

    it('correctly defines category.domain if category.domain is defined', () => {
      component.config.category.domain = [
        'red',
        'red',
        'orange',
        'yellow',
        'yellow',
        'green',
        'blue',
      ];
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('setValueIndicies', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {
          domain: new InternSet([1, 2, 3, 4, 5]),
        },
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.x = [6, 1, 2, 3, 4, 5];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.ordinal.domain = new InternSet([10, 20, 30, 40, 50]);
        component.config.dimensions.ordinal = 'y';
      });
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.y = [60, 10, 20, 30, 40, 50];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });
  });

  describe('setHasBarsWithNegativeValues', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, -5],
      } as any;
      component.config = new VicBarsConfig();
      component.config.dimensions.quantitative = 'x';
    });
    it('integration: sets hasBarsWithNegativeValues to true if dataMin is less than zero', () => {
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(true);
    });
    it('integration: sets hasBarsWithNegativeValues to false if dataMin is greater than zero', () => {
      component.values.x = [1, 2, 3, 4, 5];
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(false);
    });
  });

  describe('setPropertiesFromRanges', () => {
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'x' },
        category: {
          colorScale: 'blue',
        },
      } as any;
      component.chart = {
        updateScales: jasmine.createSpy('updatesScales'),
      } as any;
      spyOn(component, 'getOrdinalScale').and.returnValue('ord scale');
      spyOn(component, 'getQuantitativeScale').and.returnValue('quant scale');
    });
    it('calls getOrdinalScale once', () => {
      component.setPropertiesFromRanges(true);
      expect(component.getOrdinalScale).toHaveBeenCalledTimes(1);
    });
    it('calls getQuantitativeScale once', () => {
      component.setPropertiesFromRanges(true);
      expect(component.getQuantitativeScale).toHaveBeenCalledTimes(1);
    });
    describe('if ordinal is x', () => {
      it('calls updateScales once with the correct values', () => {
        component.setPropertiesFromRanges(true);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'ord scale',
          y: 'quant scale',
          category: 'blue',
          useTransition: true,
        } as any);
      });
    });
    describe('if ordinal is not x', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls updateScales once with the correct value', () => {
        component.setPropertiesFromRanges(false);
        expect(component.chart.updateScales).toHaveBeenCalledOnceWith({
          x: 'quant scale',
          y: 'ord scale',
          category: 'blue',
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

  describe('getBarLabelText', () => {
    beforeEach(() => {
      component.config = new VicBarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
        quantitative: {
          valueFormat: ',.1f',
        },
        labels: {
          noValueFunction: (d) => 'no value',
        },
      } as any;
      component.values.x = [10000.1, 20000.2, 30000.3];
      component.config.data = [1, 2, 3];
    });
    describe('if user has provided a custom formatting function', () => {
      beforeEach(() => {
        component.config.quantitative.valueFormat = (value) => value + '!';
      });
      it('integration: returns the correct value correctly formatted as a string', () => {
        expect(component.getBarLabelText(1)).toEqual('2!');
      });
      it('integration: returns the correct value correctly formatted as a string if value is null or undefined', () => {
        component.values.x = [null, undefined, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
    });
    describe('integration: if user has not provided a custom formatting function', () => {
      it('integration: returns the result of the noValueFunction if value null or undefined', () => {
        component.values.x = [null, undefined, null];
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
      const colorScaleSpy = jasmine
        .createSpy('colorScale')
        .and.returnValue('blue');
      component.scales = {
        category: colorScaleSpy,
      } as any;
      component.config = {
        dimensions: { ordinal: 'x' },
        data: [1, 2, 3],
      } as any;
      component.values.x = [1, 2, 3];
    });
    it('calls colorScale once with the correct value', () => {
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
      const colorScaleSpy = jasmine
        .createSpy('colorScale')
        .and.returnValue('blue');
      component.config = {
        dimensions: { ordinal: 'x' },
        category: {
          colorScale: colorScaleSpy,
        },
        data: [1, 2, 3],
      } as any;
      component.values.x = [1, 2, 3];
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
      component.values.x = [1, 2, 3];
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
      component.values.x = [1, 2, 3];
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale once and with the correct value if x value is less than zero', () => {
        component.values.x = [-1, 2, 3];
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
      component.values.y = [1, 2, 3];
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
      component.hasBarsWithNegativeValues = true;
      component.values.x = [1, 2, 3];
      spyOn(component, 'getQuantitativeDomainFromScale').and.returnValue([
        2, 10,
      ]);
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale twice and with the correct values', () => {
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale twice and with the correct values', () => {
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
      component.values.y = [1, 2, 3];
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
