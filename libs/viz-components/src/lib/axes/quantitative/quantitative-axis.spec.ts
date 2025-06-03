/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { timeMonth } from 'd3';
import { QuantitativeAxisStub } from '../../testing/stubs/quantitative-axis.stub';
import { VicXQuantitativeAxisConfigBuilder } from '../x-quantitative/x-quantitative-axis-builder';

describe('the QuantitativeAxis mixin', () => {
  let abstractClass: QuantitativeAxisStub<number>;
  const mockElementRef = {
    nativeElement: {
      querySelector: jasmine.createSpy('querySelector'),
      style: {},
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuantitativeAxisStub,
        XyChartComponent,
        { provide: ElementRef, useValue: mockElementRef },
      ],
    });
    abstractClass = TestBed.inject(QuantitativeAxisStub);
  });

  describe('setTicks', () => {
    beforeEach(() => {
      spyOn(abstractClass as any, 'setSpecifiedTickValues');
      spyOn(abstractClass as any, 'setUnspecifiedTickValues');
    });
    describe('if tickValues exists on config', () => {
      it('calls setSpecifiedTickValues once with the correct value', () => {
        abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
          .ticks((t) => t.values([1, 2, 3]))
          .getConfig();
        (abstractClass as any).setTicks('.0f');
        expect(
          (abstractClass as any).setSpecifiedTickValues
        ).toHaveBeenCalledOnceWith('.0f');
      });
    });
    describe('if tickValues does not exist on config', () => {
      it('calls setUnspecifiedTickValues once with the correct value', () => {
        abstractClass.config =
          new VicXQuantitativeAxisConfigBuilder().getConfig();
        (abstractClass as any).setTicks('.0f');
        expect(
          (abstractClass as any).setUnspecifiedTickValues
        ).toHaveBeenCalledOnceWith('.0f');
      });
    });
  });

  describe('setSpecifiedTickValues', () => {
    let tickValuesSpy: jasmine.Spy;
    let tickFormatSpy: jasmine.Spy;
    const tickFormat = '%Y';
    beforeEach(() => {
      spyOn(abstractClass as any, 'getValidTickValues').and.returnValue([
        1, 2, 3,
      ]);
      tickValuesSpy = jasmine.createSpy('tickValues');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      abstractClass.axis = {
        tickValues: tickValuesSpy,
        tickFormat: tickFormatSpy,
      };
      (abstractClass as any).setSpecifiedTickValues(tickFormat);
    });
    it('calls getValidTickValues once', () => {
      expect((abstractClass as any).getValidTickValues).toHaveBeenCalledTimes(
        1
      );
    });
    it('calls tickValues on axis with the correct values', () => {
      expect(tickValuesSpy).toHaveBeenCalledOnceWith([1, 2, 3]);
    });
    it('calls tickFormat on axis with the correct values', () => {
      expect(tickFormatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getValidTickValues', () => {
    let domainSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
    });
    it('returns the original tickValues if all values are within the scale domain', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .ticks((t) => t.values([0, 2, 4, 5]))
        .getConfig();
      expect((abstractClass as any).getValidTickValues()).toEqual([0, 2, 4, 5]);
    });
    it('returns only values that are within the scale domain', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .ticks((t) => t.values([-1, 0, 1, 2, 3, 4, 5, 6]))
        .getConfig();
      expect((abstractClass as any).getValidTickValues()).toEqual([
        0, 1, 2, 3, 4, 5,
      ]);
    });
  });

  describe('setUnspecifiedTickValues', () => {
    let ticksSpy: jasmine.Spy;
    let tickFormatSpy: jasmine.Spy;
    let domainSpy: jasmine.Spy;
    const tickFormat = '%Y';
    beforeEach(() => {
      spyOn(abstractClass as any, 'getSuggestedNumTicks').and.returnValue(10);
      ticksSpy = jasmine.createSpy('ticks');
      tickFormatSpy = jasmine.createSpy('tickFormat');
      domainSpy = jasmine.createSpy('domain');
      abstractClass.axis = {
        ticks: ticksSpy,
        tickFormat: tickFormatSpy,
      };
      abstractClass.scale = {
        domain: domainSpy,
      };
      domainSpy.and.returnValue([0, 5]);
      (abstractClass as any).setUnspecifiedTickValues(tickFormat);
    });
    it('calls getSuggestedNumTicks once', () => {
      expect(
        (abstractClass as any).getSuggestedNumTicks
      ).toHaveBeenCalledOnceWith(tickFormat);
    });
    it('calls ticks on axis with the correct values', () => {
      tickFormatSpy.calls.reset();
      expect(ticksSpy).toHaveBeenCalledOnceWith(10);
    });
    it('calls tickFormat on axis with the correct values', () => {
      ticksSpy.calls.reset();
      expect(tickFormatSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSuggestedNumTicks', () => {
    let tickFormat: string | ((value: number | Date) => string);
    let getNumTicksSpy: jasmine.Spy;
    beforeEach(() => {
      getNumTicksSpy = spyOn(
        abstractClass as any,
        'getNumTicks'
      ).and.returnValue(8);
      spyOn(
        abstractClass as any,
        'getValidNumTicksForNumberFormatString'
      ).and.returnValue(10);
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .ticks((t) => t.count(1))
        .getConfig();
    });

    it('calls getNumTicks once', () => {
      tickFormat = ',.0f';
      (abstractClass as any).getSuggestedNumTicks(tickFormat);
      expect((abstractClass as any).getNumTicks).toHaveBeenCalledTimes(1);
    });

    describe('if tickFormat is a string but has no period in it', () => {
      it('returns the result from getNumTicks', () => {
        tickFormat = '%Y';
        expect((abstractClass as any).getSuggestedNumTicks(tickFormat)).toEqual(
          8
        );
      });
    });

    describe('if tickFormat is a string with a period in it and return value from getNumTicks is a number', () => {
      beforeEach(() => {
        tickFormat = ',.0f';
      });
      it('calls getSuggestedNumTicksStringFormatter once with the correct values', () => {
        (abstractClass as any).getSuggestedNumTicks(tickFormat);
        expect(
          (abstractClass as any).getValidNumTicksForNumberFormatString
        ).toHaveBeenCalledOnceWith(8, tickFormat);
      });
      it('returns the result from getSuggestedNumTicksStringFormatter', () => {
        expect((abstractClass as any).getSuggestedNumTicks(tickFormat)).toEqual(
          10
        );
      });
    });

    describe('if tickFormat is not a string', () => {
      it('returns the result from getNumTicks', () => {
        tickFormat = () => '2';
        expect((abstractClass as any).getSuggestedNumTicks(tickFormat)).toEqual(
          8
        );
      });
    });

    describe('if result from initNumTicks is not a number', () => {
      it('returns the result from initNumTicks', () => {
        getNumTicksSpy.and.returnValue(timeMonth);
        tickFormat = ',.0f';
        expect((abstractClass as any).getSuggestedNumTicks(tickFormat)).toEqual(
          timeMonth
        );
      });
    });
  });

  describe('getNumTicks', () => {
    beforeEach(() => {
      abstractClass.chart.config = {
        height: 50,
        width: 100,
      } as any;
    });
    it('returns the value from config.numTicks if it exists', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .ticks((t) => t.count(17))
        .getConfig();
      expect((abstractClass as any).getNumTicks()).toEqual(17);
    });
    it('returns the result from getSuggestedNumTicksFromChartDimension if config.numTicks does not exist', () => {
      abstractClass.config =
        new VicXQuantitativeAxisConfigBuilder().getConfig();
      spyOn(abstractClass.config, 'getNumTicksBySpacing').and.returnValue(22);
      expect((abstractClass as any).getNumTicks()).toEqual(22);
    });
  });

  describe('getValidNumTicksForNumberFormatString', () => {
    let domainSpy: jasmine.Spy;
    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
    });
    it('returns the numTicks argument if numTicks is valid', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 20]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForNumberFormatString(10, ',.0f')
      ).toEqual(10);
    });
    it('returns 1 if the first possible tick is greater than the end of the domain', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 0.5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForNumberFormatString(10, ',.0f')
      ).toEqual(1);
    });
    it('returns the correct value if formatter is for ints and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForNumberFormatString(10, ',.0f')
      ).toEqual(6);
    });
    it('returns the correct value if formatter makes decimals and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForNumberFormatString(
          100,
          ',.1f'
        )
      ).toEqual(51);
    });
    it('returns the correct value if formatter makes percents and numTicks is too big given domain max', () => {
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([0, 5]),
      };
      expect(
        (abstractClass as any).getValidNumTicksForNumberFormatString(
          1000,
          '.0%'
        )
      ).toEqual(501);
    });
  });

  describe('getMaxTicksForDateFormat', () => {
    let domainSpy: jasmine.Spy;

    beforeEach(() => {
      domainSpy = jasmine.createSpy('domain');
      abstractClass.scale = {
        domain: domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 0, 1)),
          new Date(Date.UTC(2021, 11, 31)),
        ]),
      };
    });

    it('returns null if the tickFormat is not a date format', () => {
      expect(
        (abstractClass as any).getMaxTicksForDateFormat('%.0f')
      ).toBeNull();
    });

    it('returns null for unrecognized composite formats', () => {
      expect(
        (abstractClass as any).getMaxTicksForDateFormat('%Y-%m-%d %H:%M')
      ).toBeNull();
    });

    describe('Year formatters', () => {
      it('returns the correct value for %Y format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%Y')).toEqual(
          2
        ); // 2020, 2021
      });

      it('returns the correct value for %y format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%y')).toEqual(
          2
        ); // 20, 21
      });
    });

    describe('Quarter formatters', () => {
      it('returns the correct value for quarter format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%Y Q%q')
        ).toEqual(8); // 2020 Q1-Q4, 2021 Q1-Q4
      });

      it('handles partial quarter ranges correctly', () => {
        // Test with a domain that starts mid-year
        domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 6, 1)),
          new Date(Date.UTC(2021, 2, 31)),
        ]);
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%Y Q%q')
        ).toEqual(3); // 2020 Q3-Q4, 2021 Q1
      });
    });

    describe('Month formatters', () => {
      it('returns the correct value for %B format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%B')).toEqual(
          24
        ); // Jan 2020 - Dec 2021 = 24 months
      });

      it('returns the correct value for %b format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%b')).toEqual(
          24
        );
      });

      it('returns the correct value for %m format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%m')).toEqual(
          24
        );
      });

      it('returns the correct value for %B %Y format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%B %Y')
        ).toEqual(24);
      });

      it('returns the correct value for %b %Y format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%b %Y')
        ).toEqual(24);
      });
    });

    describe('Day formatters', () => {
      it('returns the correct value for %d format', () => {
        // Jan 1, 2020 to Dec 31, 2021 = 731 days (2020 is leap year)
        expect((abstractClass as any).getMaxTicksForDateFormat('%d')).toEqual(
          731
        );
      });

      it('returns the correct value for %e format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%e')).toEqual(
          731
        );
      });

      it('returns the correct value for %j format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%j')).toEqual(
          731
        );
      });

      it('returns the correct value for %B %d, %Y format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%B %d, %Y')
        ).toEqual(731);
      });

      it('returns the correct value for %m/%d/%Y format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%m/%d/%Y')
        ).toEqual(731);
      });

      it('returns the correct value for %Y-%m-%d format', () => {
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%Y-%m-%d')
        ).toEqual(731);
      });
    });

    describe('Week formatters', () => {
      it('returns the correct value for %U format', () => {
        // Approximately 104-105 weeks in 2 years
        const result = (abstractClass as any).getMaxTicksForDateFormat('%U');
        expect(result).toBeGreaterThanOrEqual(104);
        expect(result).toBeLessThanOrEqual(106);
      });

      it('returns the correct value for %W format', () => {
        const result = (abstractClass as any).getMaxTicksForDateFormat('%W');
        expect(result).toBeGreaterThanOrEqual(104);
        expect(result).toBeLessThanOrEqual(106);
      });
    });

    describe('Hour formatters', () => {
      it('returns the correct value for %H format', () => {
        // 731 days * 24 hours = 17,544 hours
        expect((abstractClass as any).getMaxTicksForDateFormat('%H')).toEqual(
          17545
        ); // +1 for inclusive range
      });

      it('returns the correct value for %I format', () => {
        expect((abstractClass as any).getMaxTicksForDateFormat('%I')).toEqual(
          17545
        );
      });
    });

    describe('Minute formatters', () => {
      it('returns the correct value for %M format', () => {
        // 17,544 hours * 60 minutes = 1,052,640 minutes
        expect((abstractClass as any).getMaxTicksForDateFormat('%M')).toEqual(
          1052641
        ); // +1 for inclusive range
      });
    });

    describe('Second formatters', () => {
      it('returns the correct value for %S format', () => {
        // 1,052,640 minutes * 60 seconds = 63,158,400 seconds
        expect((abstractClass as any).getMaxTicksForDateFormat('%S')).toEqual(
          63158401
        ); // +1 for inclusive range
      });
    });

    describe('Edge cases', () => {
      it('handles same start and end dates', () => {
        domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 5, 15)),
          new Date(Date.UTC(2020, 5, 15)),
        ]);

        expect((abstractClass as any).getMaxTicksForDateFormat('%Y')).toEqual(
          1
        );
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%B %Y')
        ).toEqual(1);
        expect((abstractClass as any).getMaxTicksForDateFormat('%d')).toEqual(
          1
        );
      });

      it('handles single day difference', () => {
        domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 5, 15)),
          new Date(Date.UTC(2020, 5, 16)),
        ]);

        expect((abstractClass as any).getMaxTicksForDateFormat('%Y')).toEqual(
          1
        );
        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%B %Y')
        ).toEqual(1);
        expect((abstractClass as any).getMaxTicksForDateFormat('%d')).toEqual(
          2
        );
      });

      it('handles cross-month boundaries', () => {
        domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 0, 31)),
          new Date(Date.UTC(2020, 1, 1)),
        ]);

        expect(
          (abstractClass as any).getMaxTicksForDateFormat('%B %Y')
        ).toEqual(2); // Jan, Feb
        expect((abstractClass as any).getMaxTicksForDateFormat('%d')).toEqual(
          2
        ); // Jan 31, Feb 1
      });

      it('handles leap year correctly', () => {
        // Feb 28, 2020 to Mar 1, 2020 (leap year)
        domainSpy.and.returnValue([
          new Date(Date.UTC(2020, 1, 28)),
          new Date(Date.UTC(2020, 2, 1)),
        ]);

        expect((abstractClass as any).getMaxTicksForDateFormat('%d')).toEqual(
          3
        ); // Feb 28, Feb 29, Mar 1
      });
    });
  });
});
