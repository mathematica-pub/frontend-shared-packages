/* eslint-disable @typescript-eslint/no-explicit-any */
import { VicCategoricalAttributeDataDimension } from '../geographies/config/dimensions/categorical-bins';
import { VicEqualValueRangesAttributeDataDimension } from '../geographies/config/dimensions/equal-value-ranges-bins';
import { ValueUtilities } from '../shared/value-utilities';
import { MapLegendContentStub } from '../testing/stubs/map-legend-content.stub';

describe('the MapLegendContent abstract class', () => {
  let directive: MapLegendContentStub<any>;

  beforeEach(() => {
    directive = new MapLegendContentStub();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(directive, 'setValues');
      spyOn(directive, 'setColors');
    });
    it('calls setValues once', () => {
      directive.ngOnChanges();
      expect(directive.setValues).toHaveBeenCalledTimes(1);
    });
    it('calls setColors once', () => {
      directive.ngOnChanges();
      expect(directive.setColors).toHaveBeenCalledTimes(1);
    });
  });

  describe('setValues', () => {
    beforeEach(() => {
      spyOn(directive, 'setCategoricalValues');
      spyOn(directive, 'setQuantitativeValues');
    });
    it('calls setCategoricalValues once if binType is categorical', () => {
      directive.config = new VicCategoricalAttributeDataDimension();
      directive.setValues();
      expect(directive.setCategoricalValues).toHaveBeenCalledTimes(1);
    });
    it('calls setQuantitativeValues once if binType is not categorical', () => {
      directive.config = new VicEqualValueRangesAttributeDataDimension();
      directive.setValues();
      expect(directive.setQuantitativeValues).toHaveBeenCalledTimes(1);
    });
  });

  describe('setQuantitativeValues', () => {
    let formatSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(directive, 'getValuesFromScale').and.returnValue([0.01, 0.02]);
      spyOn(directive, 'setQuantitativeValueSpaces');
      formatSpy = spyOn(ValueUtilities, 'd3Format').and.callThrough();
      directive.orientation = 'horizontal';
      directive.config = new VicEqualValueRangesAttributeDataDimension({
        formatSpecifier: '.0%',
      });
    });
    it('calls getValuesFromScale once', () => {
      directive.setQuantitativeValues();
      expect(directive.getValuesFromScale).toHaveBeenCalledTimes(1);
    });
    it('calls setQuantitativeValueSpaces once with the correct values if orientation is horizontal', () => {
      directive.setQuantitativeValues();
      expect(directive.setQuantitativeValueSpaces).toHaveBeenCalledWith([
        0.01, 0.02,
      ]);
    });
    it('calls d3Format once with the correct values if orientation is horizontal', () => {
      directive.setQuantitativeValues();
      expect(formatSpy.calls.allArgs()).toEqual([
        [0.01, '.0%'],
        [0.02, '.0%'],
      ]);
    });
    it('calls d3Format once with the correct values if orientation is vertical', () => {
      directive.orientation = 'vertical';
      directive.setQuantitativeValues();
      expect(formatSpy.calls.allArgs()).toEqual([
        [0.02, '.0%'],
        [0.01, '.0%'],
      ]);
    });
    it('sets values to the correct values - orientation is horizontal', () => {
      directive.setQuantitativeValues();
      expect(directive.values).toEqual(['1%', '2%']);
    });
    it('sets values to the correct values - orientation is vertical', () => {
      directive.orientation = 'vertical';
      directive.setQuantitativeValues();
      expect(directive.values).toEqual(['2%', '1%']);
    });
  });

  describe('setCategoricalValues', () => {
    beforeEach(() => {
      spyOn(directive, 'getValuesFromScale').and.returnValue(['a', 'b'] as any);
      spyOn(directive, 'setCategoricalValueSpaces');
      directive.orientation = 'horizontal';
    });
    it('calls getValuesFromScale once', () => {
      directive.setCategoricalValues();
      expect(directive.getValuesFromScale).toHaveBeenCalledTimes(1);
    });
    it('calls setCategoricalValueSpaces once', () => {
      directive.setCategoricalValues();
      expect(directive.setCategoricalValueSpaces).toHaveBeenCalledTimes(1);
    });
    it('sets values to the correct values - orientation is horizontal', () => {
      directive.setCategoricalValues();
      expect(directive.values).toEqual(['a', 'b']);
    });
    it('sets values to the correct values - orientation is vertical', () => {
      directive.orientation = 'vertical';
      directive.setCategoricalValues();
      expect(directive.values).toEqual(['b', 'a']);
    });
  });

  describe('setColors', () => {
    beforeEach(() => {
      directive.config = new VicCategoricalAttributeDataDimension();
      (directive.config as any).domain = ['a', 'b'];
      directive.config.range = ['red', 'blue'];
    });
    it('should set colors to scale.range if orientation is not vertical', () => {
      directive.orientation = 'horizontal';
      directive.setColors();
      expect(directive.colors).toEqual(['red', 'blue']);
    });

    it('should reverse colors if orientation is vertical', () => {
      directive.orientation = 'vertical';
      directive.setColors();
      expect(directive.colors).toEqual(['blue', 'red']);
    });
  });

  describe('setQuantitativeValueSpaces', () => {
    beforeEach(() => {
      spyOn(directive, 'getLeftOffset').and.returnValue(10);
      directive.setQuantitativeValueSpaces([101, 2002]);
    });
    it('sets startValueSpace to the correct value', () => {
      expect(directive.startValueSpace).toEqual(12);
    });

    it('sets endValueSpace to the correct value', () => {
      expect(directive.endValueSpace).toEqual(16);
    });

    it('sets largerValueSpace to the correct value', () => {
      expect(directive.largerValueSpace).toEqual(16);
    });

    it('calls leftOffset with the correct value', () => {
      expect(directive.getLeftOffset).toHaveBeenCalledOnceWith([101, 2002]);
    });

    it('sets leftOffset to the correct value', () => {
      expect(directive.leftOffset).toEqual(10);
    });
  });

  describe('setCategoricalValueSpaces', () => {
    beforeEach(() => {
      directive.setCategoricalValueSpaces();
    });
    it('should set startValueSpace to 0', () => {
      expect(directive.startValueSpace).toEqual(0);
    });
    it('should set endValueSpace to 0', () => {
      expect(directive.endValueSpace).toEqual(0);
    });
    it('should set largerValueSpace to 0', () => {
      expect(directive.largerValueSpace).toEqual(0);
    });
    it('should set leftOffset to 0', () => {
      expect(directive.leftOffset).toEqual(0);
    });
  });
});
