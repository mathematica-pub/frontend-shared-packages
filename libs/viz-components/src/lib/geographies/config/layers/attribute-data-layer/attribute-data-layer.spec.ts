/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach } from 'local-cypress';
import { GeographiesAttributeDataLayer } from './attribute-data-layer';
import { GeographiesAttributeDataLayerBuilder } from './attribute-data-layer-builder';

type Datum = { value: number; state: string };
const data = [
  { value: 1, state: 'AL' },
  { value: 2, state: 'AK' },
  { value: 3, state: 'AZ' },
  { value: 4, state: 'CA' },
  { value: 5, state: 'CO' },
  { value: 6, state: 'CO' },
];
function createLayer(): GeographiesAttributeDataLayer<
  Datum,
  { name: string },
  any
> {
  return new GeographiesAttributeDataLayerBuilder<Datum, { name: string }>()
    .equalValueRangesBins((dimension) =>
      dimension.valueAccessor((d) => d.value).numBins(5)
    )
    .geographyIndexAccessor((d) => d.state)
    .data(data)
    ._build();
}

describe('GeographieAttributeDataLayer', () => {
  let layer: GeographiesAttributeDataLayer<Datum, { name: string }, any>;

  describe('initPropertiesFromData()', () => {
    beforeEach(() => {
      layer = createLayer();
      spyOn(layer as any, 'getUniqueDatumsByGeoAccessor').and.returnValue(
        'uniqueValues' as any
      );
      spyOn(layer.attributeDimension, 'setPropertiesFromData');
      spyOn(layer.attributeDimension, 'getScale');
      spyOn(layer as any, 'setAttributeDataMaps');
      layer.initPropertiesFromData();
    });
    it('calls getUniqueDatumsByGeoAccessor once', () => {
      expect(
        (layer as any).getUniqueDatumsByGeoAccessor
      ).toHaveBeenCalledOnceWith(data);
    });
    it('calls setPropertiesFromData once', () => {
      expect(
        layer.attributeDimension.setPropertiesFromData
      ).toHaveBeenCalledOnceWith('uniqueValues' as any);
    });
    it('calls setAttributeDataMaps once', () => {
      expect((layer as any).setAttributeDataMaps).toHaveBeenCalledOnceWith(
        'uniqueValues' as any
      );
    });
    it('calls getScale once', () => {
      expect(layer.attributeDimension.getScale).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUniqueDatumsByGeoAccessor()', () => {
    beforeEach(() => {
      layer = createLayer();
    });
    it('returns the unique datums by geoAccessor', () => {
      const result = (layer as any).getUniqueDatumsByGeoAccessor(data);
      expect(result).toEqual([
        { value: 1, state: 'AL' },
        { value: 2, state: 'AK' },
        { value: 3, state: 'AZ' },
        { value: 4, state: 'CA' },
        { value: 5, state: 'CO' },
      ]);
    });
  });

  describe('setAttributeDataMaps()', () => {
    beforeEach(() => {
      layer = createLayer();
      (layer as any).setAttributeDataMaps([
        { value: 1, state: 'AL' },
        { value: 2, state: 'AK' },
        { value: 3, state: 'AZ' },
        { value: 4, state: 'CA' },
        { value: 5, state: 'CO' },
      ]);
    });
    it('correctly sets attributeValuesByGeographyIndex', () => {
      expect(layer.attributeValuesByGeographyIndex.get('AL')).toEqual(1);
      expect(layer.attributeValuesByGeographyIndex.get('AK')).toEqual(2);
      expect(layer.attributeValuesByGeographyIndex.get('AZ')).toEqual(3);
      expect(layer.attributeValuesByGeographyIndex.get('CA')).toEqual(4);
      expect(layer.attributeValuesByGeographyIndex.get('CO')).toEqual(5);
    });
    it('correctly sets datumsByGeographyIndex', () => {
      expect(layer.datumsByGeographyIndex.get('AL')).toEqual({
        value: 1,
        state: 'AL',
      });
      expect(layer.datumsByGeographyIndex.get('AK')).toEqual({
        value: 2,
        state: 'AK',
      });
      expect(layer.datumsByGeographyIndex.get('AZ')).toEqual({
        value: 3,
        state: 'AZ',
      });
      expect(layer.datumsByGeographyIndex.get('CA')).toEqual({
        value: 4,
        state: 'CA',
      });
      expect(layer.datumsByGeographyIndex.get('CO')).toEqual({
        value: 5,
        state: 'CO',
      });
    });
  });
});
