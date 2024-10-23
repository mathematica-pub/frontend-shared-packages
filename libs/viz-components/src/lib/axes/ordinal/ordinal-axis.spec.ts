/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { OrdinalAxisStub } from '../../testing/stubs/ordinal-axis.stub';
import { VicXOrdinalAxisConfigBuilder } from '../x-ordinal/x-ordinal-axis-builder';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdinalAxisStub, XyChartComponent],
    });
    abstractClass = TestBed.inject(OrdinalAxisStub);
  });

  describe('setAxisFromScaleAndConfig()', () => {
    let tickSizeOuterSpy: jasmine.Spy;
    beforeEach(() => {
      tickSizeOuterSpy = jasmine
        .createSpy('tickSizeOuter')
        .and.returnValue('tick size' as any);
      abstractClass.axisFunction = () => {
        return {
          tickSizeOuter: tickSizeOuterSpy,
        };
      };
      abstractClass.scale = 'class scale' as any;
      abstractClass.config = new VicXOrdinalAxisConfigBuilder()
        .tickSizeOuter(3)
        .getConfig();
    });
    it('calls tickSizeOuter once with the correct value', () => {
      abstractClass.setAxisFromScaleAndConfig();
      expect(tickSizeOuterSpy).toHaveBeenCalledOnceWith(3);
    });
  });
});
