/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomBreaksBinsAttributeDataDimension } from './custom-breaks-bins';
import { CustomBreaksBinsAttributeDataDimensionBuilder } from './custom-breaks-bins-builder';

describe('VicCustomBreaksAttributeDataDimension', () => {
  let dimension: CustomBreaksBinsAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = new CustomBreaksBinsAttributeDataDimensionBuilder<any>()
      .breakValues([0, 2, 5, 10, 50])
      .range(['red', 'blue', 'yellow', 'green'])
      .valueAccessor((d) => d)
      .build();
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setNumBins');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomainAndBins once', () => {
      dimension.setPropertiesFromData();
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
    it('calls setBins once', () => {
      dimension.setPropertiesFromData();
      expect((dimension as any).setNumBins).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData();
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDomain', () => {
    beforeEach(() => {
      (dimension as any).breakValues = [0, 2, 5, 10, 50];
      (dimension as any).setDomain();
    });
    it('sets the domain to the correct value', () => {
      expect((dimension as any).calculatedDomain).toEqual([2, 5, 10, 50]);
    });
  });

  describe('setNumBins', () => {
    it('sets the numBins to the correct value', () => {
      (dimension as any).breakValues = [0, 2, 5, 10, 50];
      (dimension as any).setNumBins();
      expect((dimension as any).calculatedNumBins).toEqual(4);
    });
  });

  describe('integration: the scale generates the expected color for a value with the default scale (D3 scaleThreshold)', () => {
    type IceCream = { price: number; flavor: string; state: string };
    let dimension: CustomBreaksBinsAttributeDataDimension<IceCream>;
    const data: IceCream[] = [
      { price: 7.99, flavor: 'chocolate', state: 'AL' },
      { price: 5, flavor: 'chocolate', state: 'AK' },
      { price: 3.98, flavor: 'chocolate', state: 'AR' },
      { price: 8, flavor: 'vanilla', state: 'AZ' },
      { price: 11, flavor: 'vanilla', state: 'CA' },
      { price: 4.99, flavor: 'strawberry', state: 'CO' },
      { price: 4.5, flavor: 'strawberry', state: 'CT' },
      { price: 7, flavor: 'strawberry', state: 'DE' },
    ];
    it('using custom break values and one color per bin provided as range', () => {
      dimension = new CustomBreaksBinsAttributeDataDimensionBuilder<IceCream>()
        .valueAccessor((d) => d.price)
        .breakValues([2.5, 5, 7.5, 10, 12.5])
        .range(['red', 'blue', 'yellow', 'green'])
        .nullColor('black')
        .build();
      dimension.setPropertiesFromData();
      const scale = dimension.getScale();
      expect(scale(data[0].price)).toEqual('yellow');
      expect(scale(data[1].price)).toEqual('blue');
      expect(scale(data[2].price)).toEqual('red');
      expect(scale(data[3].price)).toEqual('yellow');
      expect(scale(data[4].price)).toEqual('green');
    });
  });
});
