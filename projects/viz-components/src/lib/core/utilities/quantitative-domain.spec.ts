import { TestBed } from '@angular/core/testing';

import { scaleLinear } from 'd3';
import { DataDomainService } from './quantitative-domain';

describe('DataDomainService', () => {
  let service: DataDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('int: getQuantitativeDomainMaxPercentOver()', () => {
    it('returns correct value when min is negative', () => {
      const min = service.getQuantitativeDomainMaxPercentOver(
        -101,
        1,
        0.5,
        'min'
      );
      expect(min).toEqual(-200);
    });
    it('returns correct value when max is negative', () => {
      const max = service.getQuantitativeDomainMaxPercentOver(
        -101,
        1,
        0.5,
        'max'
      );
      expect(max).toEqual(-100);
    });
    it('returns correct value when min is positive', () => {
      const min = service.getQuantitativeDomainMaxPercentOver(
        101,
        1,
        0.5,
        'min'
      );
      expect(min).toEqual(100);
    });
    it('returns correct value when max is positive', () => {
      const max = service.getQuantitativeDomainMaxPercentOver(
        101,
        1,
        0.5,
        'max'
      );
      expect(max).toEqual(200);
    });
  });

  describe('int: getPixelPaddedDomainValue()', () => {
    describe('when pixelRange[0] < pixelRange[1]', () => {
      it('returns correct value when valueType is min', () => {
        const min = service.getPixelPaddedDomainValue(
          [-5, 10],
          50,
          'min',
          scaleLinear,
          [120, 550]
        );
        expect(min).toEqual(-6.973684210526316);
      });

      it('returns correct value when valueType is max', () => {
        const min = service.getPixelPaddedDomainValue(
          [-5, 10],
          50,
          'max',
          scaleLinear,
          [120, 550]
        );
        expect(min).toEqual(11.973684210526315);
      });

      it('returns correct value when value is zero', () => {
        const min = service.getPixelPaddedDomainValue(
          [0, 10],
          50,
          'min',
          scaleLinear,
          [120, 550]
        );
        expect(min).toEqual(0);
      });
    });

    describe('when pixelRange[0] > pixelRange[1] (e.g. for y axis)', () => {
      it('returns correct value when valueType is min', () => {
        const min = service.getPixelPaddedDomainValue(
          [-5, 10],
          50,
          'min',
          scaleLinear,
          [770, 8]
        );
        expect(min).toEqual(-6.053370786516854);
      });

      it('returns correct value when valueType is max', () => {
        const min = service.getPixelPaddedDomainValue(
          [-5, 10],
          50,
          'max',
          scaleLinear,
          [770, 8]
        );
        expect(min).toEqual(11.053370786516853);
      });

      it('returns correct value when value is zero', () => {
        const min = service.getPixelPaddedDomainValue(
          [0, 10],
          50,
          'min',
          scaleLinear,
          [770, 8]
        );
        expect(min).toEqual(0);
      });
    });
  });
});
