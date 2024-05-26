/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VicCustomBreaksAttributeDataDimension,
  vicCustomBreaksAttributeDataDimension,
} from './custom-breaks-bins';

describe('VicCustomBreaksAttributeDataDimension', () => {
  let dimension: VicCustomBreaksAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = vicCustomBreaksAttributeDataDimension({
      breakValues: [0, 2, 5, 10, 50],
      range: ['red', 'blue', 'yellow', 'green'],
    });
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
      expect((dimension as any).domain).toEqual([2, 5, 10, 50]);
    });
  });

  describe('setNumBins', () => {
    it('sets the numBins to the correct value', () => {
      (dimension as any).breakValues = [0, 2, 5, 10, 50];
      (dimension as any).setNumBins();
      expect((dimension as any).calculatedNumBins).toEqual(4);
    });
  });
});
