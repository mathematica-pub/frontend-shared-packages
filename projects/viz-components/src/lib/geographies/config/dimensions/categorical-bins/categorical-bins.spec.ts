/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoricalBinsAttributeDataDimension } from './categorical-bins';
import { CategoricalBinsBuilder } from './categorical-bins-builder';

describe('VicCategoricalAttributeDataDimension', () => {
  let dimension: CategoricalBinsAttributeDataDimension<string>;
  beforeEach(() => {
    dimension = new CategoricalBinsBuilder<string>()
      .valueAccessor((d) => d)
      .build();
  });
  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
      spyOn(dimension as any, 'setRange');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect((dimension as any).setDomain).toHaveBeenCalledTimes(1);
    });
    it('calls setRange once', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect((dimension as any).setRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDomain', () => {
    it('sets the domain to uniqued values', () => {
      dimension.setPropertiesFromData(['a', 'b', 'c', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['a', 'b', 'c']);
    });
    it('sets the domain to uniqued user values if specified', () => {
      dimension = new CategoricalBinsBuilder<string>()
        .valueAccessor((d) => d)
        .domain(['c', 'd', 'b', 'a', 'd'])
        .build();
      dimension.setPropertiesFromData(['a', 'b', 'c', 'a', 'b']);
      expect((dimension as any).calculatedDomain).toEqual(['c', 'd', 'b', 'a']);
    });
  });

  describe('setRange', () => {
    it('sets the range to the correct values/length', () => {
      dimension = new CategoricalBinsBuilder<string>()
        .valueAccessor((d) => d)
        .range(['red', 'blue', 'green', 'yellow', 'purple'])
        .build();
      dimension.setPropertiesFromData(['a', 'b', 'c']);
      expect(dimension.range).toEqual(['red', 'blue', 'green']);
    });
  });

  describe('integration: the scale generates the expected color for a value with the default scale (D3 scaleOrdinal)', () => {
    type IceCream = { price: number; flavor: string; brand: string };
    let dimension: CategoricalBinsAttributeDataDimension<IceCream>;
    const data: IceCream[] = [
      { price: 7.99, flavor: 'chocolate', brand: 'local' },
      { price: 5, flavor: 'chocolate', brand: 'national' },
      { price: 3.98, flavor: 'chocolate', brand: 'national' },
      { price: 8, flavor: 'vanilla', brand: 'regional' },
      { price: 11, flavor: 'vanilla', brand: 'local' },
      { price: 4.99, flavor: 'strawberry', brand: 'local' },
      { price: 4.5, flavor: 'strawberry', brand: 'national' },
      { price: 7, flavor: 'strawberry', brand: 'regional' },
    ];
    it('using default properties', () => {
      dimension = new CategoricalBinsBuilder<IceCream>()
        .valueAccessor((d) => d.flavor)
        .nullColor('pink')
        .build();
      dimension.setPropertiesFromData(data);
      const scale = dimension.getScale();
      expect(scale('chocolate')).toEqual('white');
      expect(scale('vanilla')).toEqual('lightslategray');
      expect(scale('strawberry')).toEqual('white');
      expect(scale('cookie dough')).toEqual('pink');
    });
    it('using user provided range', () => {
      dimension = new CategoricalBinsBuilder<IceCream>()
        .valueAccessor((d) => d.flavor)
        .range(['red', 'white', 'blue'])
        .nullColor('pink')
        .build();
      dimension.setPropertiesFromData(data);
      const scale = dimension.getScale();
      expect(scale('chocolate')).toEqual('red');
      expect(scale('vanilla')).toEqual('white');
      expect(scale('strawberry')).toEqual('blue');
      expect(scale('cookie dough')).toEqual('pink');
    });
    it('using user provided domain', () => {
      dimension = new CategoricalBinsBuilder<IceCream>()
        .valueAccessor((d) => d.flavor)
        .domain(['cookie dough', 'rocky road', 'butter pecan'])
        .nullColor('pink')
        .build();
      dimension.setPropertiesFromData(data);
      const scale = dimension.getScale();
      expect(scale('chocolate')).toEqual('pink');
      expect(scale('vanilla')).toEqual('pink');
      expect(scale('strawberry')).toEqual('pink');
      expect(scale('cookie dough')).toEqual('white');
    });
  });
});
