/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternSet } from 'd3';
import { VicColorUtilities } from '../shared/color-utilities.class';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { BarsComponent } from './bars.component';
import { VicBarsConfig, VicBarsLabelsConfig } from './bars.config';

describe('BarsComponent', () => {
  let component: BarsComponent<any>;
  let fixture: ComponentFixture<BarsComponent<any>>;

  beforeEach(async () => {
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
        expect(component.unpaddedQuantitativeDomain).toEqual([0, 97]);
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
        expect(component.unpaddedQuantitativeDomain).toEqual([-277, 0]);
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
        expect(component.unpaddedQuantitativeDomain).toEqual([-3, 44]);
      });
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

    it('does not call drawBarLabels if config.labels.display is falsey', () => {
      component.config.labels.display = false;
      component.drawMarks();
      expect(component.drawBarLabels).not.toHaveBeenCalled();
    });

    it('calls updateBarElements', () => {
      component.drawMarks();
      expect(component.updateBarElements).toHaveBeenCalledTimes(1);
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

    describe('when the x value is falsey', () => {
      it('calls xScale once and with 0', () => {
        component.values.x = [undefined, 2, 3];
        component.getBarXQuantitative(0);
        expect(component.scales.x).toHaveBeenCalledOnceWith(0);
      });
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

  describe('getBarY', () => {
    beforeEach(() => {
      spyOn(component, 'getBarYOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarYQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'y' } } as any;
    });
    describe('y dimension is ordinal', () => {
      it('calls getBarYOrdinal once with the correct value', () => {
        component.getBarY(100);
        expect(component.getBarYOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarYQuantitative', () => {
        component.getBarY(100);
        expect(component.getBarYQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarY(100)).toEqual('ordinal' as any);
      });
    });

    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'x';
      });

      it('calls getBarYQuantitative once with the correct value', () => {
        component.getBarY(100);
        expect(component.getBarYQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarYOrdinal', () => {
        component.getBarY(100);
        expect(component.getBarYOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarY(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarYOrdinal', () => {
    beforeEach(() => {
      component.scales = {
        y: jasmine.createSpy('y').and.returnValue(50),
      } as any;
      component.values.y = [1, 2, 3];
    });
    it('calls yScale once and with the correct value', () => {
      component.getBarYOrdinal(2);
      expect(component.scales.y).toHaveBeenCalledOnceWith(3);
    });

    it('returns the correct value', () => {
      expect(component.getBarYOrdinal(2)).toEqual(50);
    });
  });

  describe('getBarYQuantitative', () => {
    beforeEach(() => {
      component.scales = {
        y: jasmine.createSpy('y').and.returnValue(50),
      } as any;
      component.values.y = [1, 2, 3];
    });

    it('calls yScale once with 0 if y value is less than zero', () => {
      component.values.y = [-1, 2, 3];
      component.getBarYQuantitative(0);
      expect(component.scales.y).toHaveBeenCalledOnceWith(0);
    });

    it('calls yScale once with 0 if y value is falsey', () => {
      component.values.y = [undefined, 2, 3];
      component.getBarYQuantitative(0);
      expect(component.scales.y).toHaveBeenCalledOnceWith(0);
    });

    it('calls yScale once with the y value if y value is greater than zero', () => {
      component.getBarYQuantitative(2);
      expect(component.scales.y).toHaveBeenCalledOnceWith(3);
    });

    it('returns the correct value', () => {
      expect(component.getBarYQuantitative(0)).toEqual(50);
    });
  });

  describe('getBarWidth', () => {
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
      it('calls getBarWidthOrdinal once', () => {
        component.getBarWidth(100);
        expect(ordinalSpy).toHaveBeenCalledTimes(1);
      });

      it('does not call getBarWidthQuantitative', () => {
        component.getBarWidth(100);
        expect(quantSpy).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(300);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarWidthQuantitative once with the correct value', () => {
        component.getBarWidth(100);
        expect(quantSpy).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarWidthOrdinal', () => {
        component.getBarWidth(100);
        expect(ordinalSpy).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual(200);
      });
    });
  });

  describe('getBarWidthOrdinal', () => {
    beforeEach(() => {
      component.scales = {
        x: {
          bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
        },
      } as any;
    });
    it('calls xScale.bandwidth once', () => {
      component.getBarWidthOrdinal();
      expect((component.scales.x as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthOrdinal()).toEqual(10);
    });
  });

  describe('getBarWidthQuantitative', () => {
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
      it('calls scales.x twice and with the correct values', () => {
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls scales.x twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });

    it('returns 0 if the calculated width is NaN', () => {
      xScaleSpy.and.returnValue(NaN);
      expect(component.getBarWidthQuantitative(2)).toEqual(0);
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthQuantitative(2)).toEqual(30);
    });
  });

  describe('getBarHeight', () => {
    let ordinalSpy: jasmine.Spy;
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      ordinalSpy = spyOn(component, 'getBarHeightOrdinal').and.returnValue(200);
      quantSpy = spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        300
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = { dimensions: { ordinal: 'x' } } as any;
      });
      it('calls getBarHeightQuantitative once with the correct value', () => {
        component.getBarHeight(100);
        expect(quantSpy).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarHeightOrdinal', () => {
        component.getBarHeight(100);
        expect(ordinalSpy).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual(300);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config = { dimensions: { ordinal: 'y' } } as any;
      });

      it('calls getBarHeightOrdinal once', () => {
        component.getBarHeight(100);
        expect(ordinalSpy).toHaveBeenCalledTimes(1);
      });

      it('does not call getBarHeightQuantitative', () => {
        component.getBarHeight(100);
        expect(quantSpy).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual(200);
      });
    });
  });

  describe('getBarHeightOrdinal', () => {
    beforeEach(() => {
      component.scales = {
        y: {
          bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
        },
      } as any;
    });
    it('calls yScale.bandwidth once', () => {
      component.getBarHeightOrdinal();
      expect((component.scales.y as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightOrdinal()).toEqual(10);
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
      it('calls scales.y twice and with the correct values', () => {
        component.getBarHeightQuantitative(2);
        expect(yScaleSpy).toHaveBeenCalledTimes(2);
        expect(yScaleSpy.calls.all()[0].args[0]).toEqual(0);
        expect(yScaleSpy.calls.all()[1].args[0]).toEqual(3);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls scales.y twice and with the correct value', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarHeightQuantitative(2);
        expect(yScaleSpy).toHaveBeenCalledTimes(2);
        expect(yScaleSpy.calls.all()[0].args[0]).toEqual(2);
        expect(yScaleSpy.calls.all()[1].args[0]).toEqual(3);
      });
    });

    it('returns 0 if the calculated height is NaN', () => {
      yScaleSpy.and.returnValue(NaN);
      expect(component.getBarHeightQuantitative(2)).toEqual(0);
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightQuantitative(2)).toEqual(0);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { patternName: 'pattern', predicate: (d: any) => true },
      ];
      const result = component.getBarPattern(0);
      expect(result).toEqual(`url(#pattern)`);
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

  describe('getBarLabelText', () => {
    beforeEach(() => {
      component.config = new VicBarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
        quantitative: {
          valueFormat: ',.1f',
        },
        labels: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          noValueFunction: (d: any) => 'no value',
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

  describe('getBarLabelTextAnchor', () => {
    let alignTextSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'x', quantitative: 'y' },
      } as any;
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });

    it('returns middle if x dimension is ordinal', () => {
      expect(component.getBarLabelTextAnchor(1)).toEqual('middle');
    });
    describe('if y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls alignTextInPositiveDirection once if y dimension is ordinal', () => {
        component.getBarLabelTextAnchor(1);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(1);
      });
      it('returns start if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getBarLabelTextAnchor(1)).toEqual('start');
      });
      it('returns end if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getBarLabelTextAnchor(1)).toEqual('end');
      });
    });
  });

  describe('getBarLabelDominantBaseline', () => {
    let alignTextSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'y', quantitative: 'x' },
      } as any;
      alignTextSpy = spyOn(component, 'alignTextInPositiveDirection');
    });

    it('returns central if y dimension is ordinal', () => {
      expect(component.getBarLabelDominantBaseline(1)).toEqual('central');
    });
    describe('if x dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'x';
      });
      it('calls alignTextInPositiveDirection once if y dimension is ordinal', () => {
        component.getBarLabelDominantBaseline(1);
        expect(alignTextSpy).toHaveBeenCalledOnceWith(1);
      });
      it('returns start if text should be aligned in positive direction', () => {
        alignTextSpy.and.returnValue(true);
        expect(component.getBarLabelDominantBaseline(1)).toEqual(
          'text-after-edge'
        );
      });
      it('returns end if text should be aligned in negative direction', () => {
        alignTextSpy.and.returnValue(false);
        expect(component.getBarLabelDominantBaseline(1)).toEqual(
          'text-before-edge'
        );
      });
    });
  });

  describe('alignTextInPositiveDirection', () => {
    let positionSpy: jasmine.Spy;
    let valueSpy: jasmine.Spy;
    let barLabelFitsSpy: jasmine.Spy;
    beforeEach(() => {
      component.config = {
        dimensions: { quantitative: 'x' },
      } as any;
      component.values = { x: [1, undefined, -1, 0] } as any;
      positionSpy = spyOn(
        component,
        'positionZeroOrNonnumericValueLabelInPositiveDirection'
      );
      valueSpy = spyOn(component, 'valueIsZeroOrNonnumeric');
      barLabelFitsSpy = spyOn(component, 'barLabelFitsOutsideBar');
    });
    it('calls valueIsZeroOrNonnumeric once', () => {
      component.alignTextInPositiveDirection(0);
      expect(valueSpy).toHaveBeenCalledOnceWith(1);
    });
    describe('if the quantitative value is zero or non-numeric', () => {
      beforeEach(() => {
        valueSpy.and.returnValue(true);
      });
      it('calls positionZeroOrNonnumericValueLabelInPositiveDirection once', () => {
        component.alignTextInPositiveDirection(1);
        expect(positionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns true if positionZeroOrNonnumericValueLabelInPositiveDirection returns true', () => {
        positionSpy.and.returnValue(true);
        expect(component.alignTextInPositiveDirection(1)).toBeTrue();
      });
      it('returns false if positionZeroOrNonnumericValueLabelInPositiveDirection returns false', () => {
        positionSpy.and.returnValue(false);
        expect(component.alignTextInPositiveDirection(1)).toBeFalse();
      });
    });
    describe('if the quantitative value is numeric', () => {
      beforeEach(() => {
        valueSpy.and.returnValue(false);
      });
      it('calls barLabelFitsOutsideBar once', () => {
        component.getBarLabelTextAnchor(0);
        expect(barLabelFitsSpy).toHaveBeenCalledOnceWith(0);
      });

      describe('if the label fits outside the bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(true);
        });
        it('returns true when value is positive', () => {
          expect(component.alignTextInPositiveDirection(0)).toBeTrue();
        });
        it('returns false when value is negative', () => {
          expect(component.alignTextInPositiveDirection(2)).toBeFalse();
        });
      });

      describe('if the label does not fit outside the bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(false);
        });
        it('returns false when value is positive', () => {
          expect(component.alignTextInPositiveDirection(0)).toBeFalse();
        });
        it('returns true when value is negative', () => {
          expect(component.alignTextInPositiveDirection(2)).toBeTrue();
        });
      });
    });
  });

  describe('getBarLabelColor', () => {
    let barLabelFitsSpy: jasmine.Spy;

    beforeEach(() => {
      barLabelFitsSpy = spyOn(component, 'barLabelFitsOutsideBar');
      spyOn(
        VicColorUtilities,
        'getHigherContrastColorForBackground'
      ).and.returnValue('selected label color');
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      component.config = new VicBarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
      } as any;
      component.config.labels = new VicBarsLabelsConfig();
      component.values.x = [1, 2, 3, undefined];
    });

    it('calls barLabelFitsOutsideBar once', () => {
      component.getBarLabelColor(1);
      expect(barLabelFitsSpy).toHaveBeenCalledOnceWith(1);
    });

    describe('if the bar label fits outside the bar', () => {
      it('returns the dark label color', () => {
        barLabelFitsSpy.and.returnValue(true);
        expect(component.getBarLabelColor(1)).toBe('#000000');
      });
    });

    describe('if the data value is not a number', () => {
      it('returns the dark label color', () => {
        barLabelFitsSpy.and.returnValue(false);
        expect(component.getBarLabelColor(3)).toBe('#000000');
      });
    });

    describe('if the label does not fit outside the bar', () => {
      let labelColor: string;
      beforeEach(() => {
        barLabelFitsSpy.and.returnValue(false);
        labelColor = component.getBarLabelColor(1);
      });

      it('calls getBarColor once', () => {
        expect(component.getBarColor).toHaveBeenCalledOnceWith(1);
      });
      it('calls ColorUtilities.getHigherContrastColorForBackground once', () => {
        expect(
          VicColorUtilities.getHigherContrastColorForBackground
        ).toHaveBeenCalledOnceWith('bar color', '#000000', '#ffffff');
      });
      it('returns the selected label color', () => {
        expect(labelColor).toBe('selected label color');
      });
    });
  });

  describe('barLabelFitsOutsideBar', () => {
    let distanceSpy: jasmine.Spy;
    let heightSpy: jasmine.Spy;
    let widthSpy: jasmine.Spy;

    beforeEach(() => {
      component.values = {
        x: [1, 2, 3],
        y: [4, 5, 6],
      } as any;
      component.ranges = {
        x: [0, 100],
        y: [0, 200],
      };
      component.scales = {
        y: jasmine.createSpy('y').and.returnValue(50),
        x: jasmine.createSpy('x').and.returnValue(100),
      } as any;
      distanceSpy = spyOn(component, 'getBarToChartEdgeDistance');
      heightSpy = spyOn(component, 'getBarLabelHeight');
      widthSpy = spyOn(component, 'getBarLabelWidth');
    });
    describe('if the x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: { ordinal: 'x', quantitative: 'y' },
        } as any;
      });
      it('calls getBarToChartEdgeDistance once', () => {
        component.barLabelFitsOutsideBar(1);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [0, 200],
          50
        );
      });
      it('calls getBarLabelHeight once', () => {
        component.barLabelFitsOutsideBar(1);
        expect(heightSpy).toHaveBeenCalledTimes(1);
      });
      it('returns true if the bar to chart edge space is greater than the max bar label height', () => {
        distanceSpy.and.returnValue(10);
        heightSpy.and.returnValue(2);
        expect(component.barLabelFitsOutsideBar(1)).toBeTrue();
      });
      it('returns false if the bar to chart edge space is less than the max bar label height', () => {
        distanceSpy.and.returnValue(2);
        heightSpy.and.returnValue(10);
        expect(component.barLabelFitsOutsideBar(1)).toBeFalse();
      });
    });
    describe('if the x dimension is quantitative', () => {
      beforeEach(() => {
        component.config = {
          dimensions: { ordinal: 'y', quantitative: 'x' },
        } as any;
      });
      it('calls getBarToChartEdgeDistance once', () => {
        component.barLabelFitsOutsideBar(1);
        expect(component.getBarToChartEdgeDistance).toHaveBeenCalledOnceWith(
          true,
          [0, 100],
          100
        );
      });
      it('calls getBarLabelWidth once', () => {
        component.barLabelFitsOutsideBar(1);
        expect(widthSpy).toHaveBeenCalledOnceWith(1);
      });
      it('returns true if the bar to chart edge space is greater than the max bar label width', () => {
        distanceSpy.and.returnValue(10);
        widthSpy.and.returnValue(2);
        expect(component.barLabelFitsOutsideBar(1)).toBeTrue();
      });
      it('returns false if the bar to chart edge space is less than the max bar label height', () => {
        distanceSpy.and.returnValue(2);
        widthSpy.and.returnValue(10);
        expect(component.barLabelFitsOutsideBar(1)).toBeFalse();
      });
    });
  });

  describe('getBarToChartEdgeDistance', () => {
    it('returns the upper range less the bar value if the value is positive', () => {
      expect(component.getBarToChartEdgeDistance(true, [0, 100], 20)).toBe(80);
    });
    it('returns the bar value less the lower range if the value is negative', () => {
      expect(component.getBarToChartEdgeDistance(false, [-100, 0], -60)).toBe(
        40
      );
    });
  });

  describe('getBarLabelWidth', () => {
    beforeEach(() => {
      spyOn(component, 'getLabelDomRect').and.returnValue({
        width: 100,
        height: 200,
      } as any);
      component.config = {
        labels: {
          offset: 10,
        },
      } as any;
    });
    it('returns the max bar label width', () => {
      expect(component.getBarLabelWidth(1)).toBe(110);
    });
  });

  describe('getBarLabelHeight', () => {
    beforeEach(() => {
      spyOn(component, 'getLabelDomRect').and.returnValue({
        width: 100,
        height: 200,
      } as any);
      component.config = {
        labels: {
          offset: 10,
        },
      } as any;
    });
    it('returns the max bar label height', () => {
      expect(component.getBarLabelHeight(1)).toBe(210);
    });
  });

  describe('getBarLabelX', () => {
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelQuantitativeAxisPosition').and.returnValue(
        50
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'x',
          },
        } as any;
      });
      it('calls getBarWidthOrdinal once', () => {
        component.getBarLabelX(1);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(1)).toEqual(5);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'y',
          },
        } as any;
      });
      it('calls getBarLabelQuantitativeAxisPosition once', () => {
        component.getBarLabelX(1);
        expect(
          component.getBarLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelX(1)).toEqual(50);
      });
    });
  });

  describe('getBarLabelX', () => {
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      spyOn(component, 'getBarLabelQuantitativeAxisPosition').and.returnValue(
        50
      );
    });
    describe('x dimension is ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'x',
          },
        } as any;
      });
      it('calls getBarLabelQuantitativeAxisPosition once', () => {
        component.getBarLabelY(1);
        expect(
          component.getBarLabelQuantitativeAxisPosition
        ).toHaveBeenCalledOnceWith(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(1)).toEqual(50);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config = {
          dimensions: {
            ordinal: 'y',
          },
        } as any;
      });
      it('calls getBarHeightOrdinal once', () => {
        component.getBarLabelY(1);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledTimes(1);
      });
      it('returns the correct value', () => {
        expect(component.getBarLabelY(1)).toEqual(5);
      });
    });
  });

  describe('getBarLabelQuantitativeAxisPosition', () => {
    let result: number;
    let valueSpy: jasmine.Spy;
    let zeroNonnumericPositionSpy: jasmine.Spy;
    let numericPositionSpy: jasmine.Spy;
    beforeEach(() => {
      valueSpy = spyOn(component, 'valueIsZeroOrNonnumeric');
      zeroNonnumericPositionSpy = spyOn(
        component,
        'getBarLabelPositionForZeroOrNonnumericValue'
      ).and.returnValue(10);
      numericPositionSpy = spyOn(
        component,
        'getBarLabelPositionForNumericValue'
      ).and.returnValue(20);
      component.config = {
        dimensions: {
          quantitative: 'x',
        },
        labels: {
          offset: 8,
        },
      } as any;
      component.values.x = [null, 2, 3];
    });
    it('calls valueIsZeroOrNonnumeric once', () => {
      component.getBarLabelQuantitativeAxisPosition(1);
      expect(valueSpy).toHaveBeenCalledOnceWith(2);
    });
    describe('if the quantitative value is zero or non-numeric', () => {
      beforeEach(() => {
        valueSpy.and.returnValue(true);
        result = component.getBarLabelQuantitativeAxisPosition(0);
      });
      it('calls getBarLabelPositionForZeroOrNonnumericValue once', () => {
        expect(zeroNonnumericPositionSpy).toHaveBeenCalledTimes(1);
      });
      it('returns the label config offset', () => {
        expect(result).toBe(10);
      });
    });
    describe('if the quantitative value is numeric', () => {
      beforeEach(() => {
        valueSpy.and.returnValue(false);
        result = component.getBarLabelQuantitativeAxisPosition(1);
      });
      it('calls getBarLabelPositionForNumericValue once', () => {
        expect(numericPositionSpy).toHaveBeenCalledOnceWith(1);
      });
      it('returns the bar position with offset', () => {
        expect(result).toBe(20);
      });
    });
  });

  describe('getBarLabelPositionForZeroOrNonnumericValue', () => {
    let positionSpy: jasmine.Spy;
    beforeEach(() => {
      positionSpy = spyOn(
        component,
        'positionZeroOrNonnumericValueLabelInPositiveDirection'
      );
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        labels: {
          offset: 8,
        },
      } as any;
    });

    it('calls positionZeroOrNonnumericValueLabelInPositiveDirection once', () => {
      component.getBarLabelPositionForZeroOrNonnumericValue();
      expect(positionSpy).toHaveBeenCalledTimes(1);
    });
    describe('if positionZeroOrNonnumericValueLabelInPositiveDirection returns true', () => {
      beforeEach(() => {
        positionSpy.and.returnValue(true);
      });
      it('returns the label offset if y dimension is ordinal', () => {
        component.config.dimensions.ordinal = 'y';
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          8
        );
      });
      it('returns the inverse of label offset if x dimension is ordinal', () => {
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          -8
        );
      });
    });
    describe('if the quantitative value is zero or non-numeric', () => {
      beforeEach(() => {
        positionSpy.and.returnValue(false);
      });
      it('returns the label offset if x dimension is ordinal', () => {
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          8
        );
      });
      it('returns the inverse of label offset if y dimension is ordinal', () => {
        component.config.dimensions.ordinal = 'y';
        expect(component.getBarLabelPositionForZeroOrNonnumericValue()).toEqual(
          -8
        );
      });
    });
  });

  describe('getBarLabelPositionForNumericValue', () => {
    let originSpy: jasmine.Spy;
    let barLabelFitsSpy: jasmine.Spy;
    beforeEach(() => {
      originSpy = spyOn(component, 'getBarLabelOrigin').and.returnValue(10);
      barLabelFitsSpy = spyOn(component, 'barLabelFitsOutsideBar');
      component.config = {
        dimensions: {
          ordinal: 'x',
          quantitative: 'y',
        },
        labels: {
          offset: 8,
        },
      } as any;
      component.values.y = [-1, 1];
    });
    it('calls getBarLabelOrigin once', () => {
      component.getBarLabelPositionForNumericValue(1);
      expect(originSpy).toHaveBeenCalledOnceWith(1, true);
    });
    describe('if x dimension is ordinal', () => {
      describe('bar label fits outside bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(true);
        });
        it('returns the origin less offset if the value is positive', () => {
          expect(component.getBarLabelPositionForNumericValue(1)).toBe(2);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(component.getBarLabelPositionForNumericValue(0)).toBe(18);
        });
      });
      describe('bar label does not fit outside bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(false);
        });
        it('returns the origin plus offset if the value is positive', () => {
          expect(component.getBarLabelPositionForNumericValue(1)).toBe(18);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(component.getBarLabelPositionForNumericValue(0)).toBe(2);
        });
      });
    });
    describe('if y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      describe('bar label does not fit outside bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(false);
        });
        it('returns the origin less offset if the value is positive', () => {
          expect(component.getBarLabelPositionForNumericValue(1)).toBe(2);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(component.getBarLabelPositionForNumericValue(0)).toBe(18);
        });
      });
      describe('bar label fits outside bar', () => {
        beforeEach(() => {
          barLabelFitsSpy.and.returnValue(true);
        });
        it('returns the origin plus offset if the value is positive', () => {
          expect(component.getBarLabelPositionForNumericValue(1)).toBe(18);
        });
        it('returns the origin plus offset if the value is negative', () => {
          expect(component.getBarLabelPositionForNumericValue(0)).toBe(2);
        });
      });
    });
  });

  describe('positionZeroOrNonnumericValueLabelInPositiveDirection', () => {
    beforeEach(() => {
      component.config = {
        dimensions: {
          quantitative: 'y',
        },
        quantitative: {
          domain: undefined,
        },
      } as any;
    });
    it('returns true if some values are positive', () => {
      component.values = { y: [null, 10, false] } as any;
      expect(
        component.positionZeroOrNonnumericValueLabelInPositiveDirection()
      ).toBeTrue();
    });
    describe('if all values are either zero or non-numeric', () => {
      beforeEach(() => {
        component.values = { y: [null, 0, false] } as any;
      });
      it('returns true if domain is undefined', () => {
        expect(
          component.positionZeroOrNonnumericValueLabelInPositiveDirection()
        ).toBeTrue();
      });
      it('returns true if domain is defined and the maximum is greater than 0', () => {
        component.config.quantitative.domain = [1, 10];
        expect(
          component.positionZeroOrNonnumericValueLabelInPositiveDirection()
        ).toBeTrue();
      });
      it('returns false if domain is defined and the maximum is not greater than 0', () => {
        component.config.quantitative.domain = [-10, 0];
        expect(
          component.positionZeroOrNonnumericValueLabelInPositiveDirection()
        ).toBeFalse();
      });
    });
    it('returns false if all values are negative or non-numeric', () => {
      component.values = { y: [null, -10, undefined] } as any;
      expect(
        component.positionZeroOrNonnumericValueLabelInPositiveDirection()
      ).toBeFalse();
    });
    it('returns false if all values are negative', () => {
      component.values = { y: [-1, -10, -2] } as any;
      expect(
        component.positionZeroOrNonnumericValueLabelInPositiveDirection()
      ).toBeFalse();
    });
  });

  describe('valueIsZeroOrNonnumeric', () => {
    it('returns true if the value is zero', () => {
      expect(component.valueIsZeroOrNonnumeric(0)).toBeTrue();
    });
    it('returns true if the value is a string', () => {
      expect(component.valueIsZeroOrNonnumeric('test')).toBeTrue();
    });
    it('returns true if the value is undefined', () => {
      expect(component.valueIsZeroOrNonnumeric(undefined)).toBeTrue();
    });
    it('returns true if the value is null', () => {
      expect(component.valueIsZeroOrNonnumeric(null)).toBeTrue();
    });
    it('returns true if the value is a boolean', () => {
      expect(component.valueIsZeroOrNonnumeric(true)).toBeTrue();
    });
    it('returns true if the value is an object', () => {
      expect(component.valueIsZeroOrNonnumeric({ myObj: 123 })).toBeTrue();
    });
    it('returns true if the value is an array', () => {
      expect(component.valueIsZeroOrNonnumeric([])).toBeTrue();
    });
    it('returns true if the value is a function', () => {
      expect(
        component.valueIsZeroOrNonnumeric(() => {
          return;
        })
      ).toBeTrue();
    });
    it('returns false if the value is numeric and not 0', () => {
      expect(component.valueIsZeroOrNonnumeric(123)).toBeFalse();
    });
  });
});
