import {
  VicCategoricalAttributeDataDimensionConfig,
  VicEqualValuesQuantitativeAttributeDataDimensionConfig,
} from '../geographies/geographies.config';
import { MapLegendContentStub } from '../testing/stubs/map-legend-content.stub';

describe('the MapLegendContent abstract class', () => {
  let directive: MapLegendContentStub;

  beforeEach(() => {
    directive = new MapLegendContentStub();
  });

  describe('setValues', () => {
    beforeEach(() => {
      spyOn(directive, 'getValuesFromScale').and.returnValue([1, 2]);
      spyOn(directive, 'setValueSpaces');
      spyOn(directive, 'getFormattedValues').and.returnValue(['1%', '2%']);
      directive.orientation = 'horizontal';
      directive.config =
        new VicEqualValuesQuantitativeAttributeDataDimensionConfig();
      directive.config.valueFormat = 'test formatter';
    });

    it('calls getValuesFromScale once', () => {
      directive.setValues();
      expect(directive.getValuesFromScale).toHaveBeenCalledTimes(1);
    });

    it('calls setValueSpaces once with the correct values if orientation is horizontal', () => {
      directive.setValues();
      expect(directive.setValueSpaces).toHaveBeenCalledWith([1, 2] as any);
    });

    it('calls setValueSpaces once with the correct values if orientation is vertical', () => {
      directive.orientation = 'vertical';
      directive.setValues();
      expect(directive.setValueSpaces).toHaveBeenCalledWith([2, 1] as any);
    });

    it('calls getFormattedValues once with the correct values if formatter is truthy', () => {
      directive.setValues();
      expect(directive.getFormattedValues).toHaveBeenCalledWith([1, 2]);
    });

    it('does not call getFormattedValues if formatter is falsy', () => {
      directive.config.valueFormat = null;
      directive.setValues();
      expect(directive.getFormattedValues).not.toHaveBeenCalled();
    });

    it('integration: set value to the correct values', () => {
      directive.setValues();
      expect(directive.values).toEqual(['1%', '2%']);
    });
  });

  describe('setColors', () => {
    beforeEach(() => {
      directive.config = new VicCategoricalAttributeDataDimensionConfig();
      directive.config.domain = ['a', 'b'];
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

  describe('setValueSpaces', () => {
    beforeEach(() => {
      spyOn(directive, 'getLeftOffset').and.returnValue(10);
      directive.setValueSpaces([101, 2002]);
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
});
