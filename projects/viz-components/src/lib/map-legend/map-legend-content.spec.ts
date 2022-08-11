import { MapLegendContentStub } from '../testing/stubs/map-legend-content.stub';

describe('the MapLegendContent abstract class', () => {
  let abstractClass: MapLegendContentStub;

  beforeEach(() => {
    abstractClass = new MapLegendContentStub();
  });

  describe('setValues', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getValuesFromScale').and.returnValue([1, 2]);
      spyOn(abstractClass, 'setValueSpaces');
      spyOn(abstractClass, 'getFormattedValues').and.returnValue(['1%', '2%']);
      abstractClass.orientation = 'horizontal';
      abstractClass.formatter = 'test formatter';
    });

    it('calls getValuesFromScale once', () => {
      abstractClass.setValues();
      expect(abstractClass.getValuesFromScale).toHaveBeenCalledTimes(1);
    });

    it('calls setValueSpaces once with the correct values if orientation is horizontal', () => {
      abstractClass.setValues();
      expect(abstractClass.setValueSpaces).toHaveBeenCalledWith([1, 2] as any);
    });

    it('calls setValueSpaces once with the correct values if orientation is vertical', () => {
      abstractClass.orientation = 'vertical';
      abstractClass.setValues();
      expect(abstractClass.setValueSpaces).toHaveBeenCalledWith([2, 1] as any);
    });

    it('calls getFormattedValues once with the correct values if formatter is truthy', () => {
      abstractClass.setValues();
      expect(abstractClass.getFormattedValues).toHaveBeenCalledWith([1, 2]);
    });

    it('does not call getFormattedValues if formatter is falsy', () => {
      abstractClass.formatter = null;
      abstractClass.setValues();
      expect(abstractClass.getFormattedValues).not.toHaveBeenCalled();
    });

    it('integration: set value to the correct values', () => {
      abstractClass.setValues();
      expect(abstractClass.values).toEqual(['1%', '2%']);
    });
  });

  describe('setValueSpaces', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getLeftOffset').and.returnValue(10);
      abstractClass.setValueSpaces([101, 2002]);
    });
    it('sets startValueSpace to the correct value', () => {
      expect(abstractClass.startValueSpace).toEqual(12);
    });

    it('sets endValueSpace to the correct value', () => {
      expect(abstractClass.endValueSpace).toEqual(16);
    });

    it('sets largerValueSpace to the correct value', () => {
      expect(abstractClass.largerValueSpace).toEqual(16);
    });

    it('calls leftOffset with the correct value', () => {
      expect(abstractClass.getLeftOffset).toHaveBeenCalledOnceWith([101, 2002]);
    });

    it('sets leftOffset to the correct value', () => {
      expect(abstractClass.leftOffset).toEqual(10);
    });
  });
});
