/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { axisLeft, axisRight } from 'd3';
import { YAxisStub } from '../../testing/stubs/y-axis.stub';
import { VicYQuantitativeAxisConfigBuilder } from '../y-quantitative-axis/y-quantitative-axis-builder';

describe('the YAxis mixin', () => {
  let abstractClass: YAxisStub<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YAxisStub, XyChartComponent],
    });
    abstractClass = TestBed.inject(YAxisStub);
    abstractClass.scales = {
      x: {
        range: jasmine.createSpy().and.returnValue([30, 100]),
      },
      y: 'scale',
    } as any;
    abstractClass.chart = {
      margin: { right: 10 },
    } as any;
  });

  describe('setTranslate()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getTranslateDistance').and.returnValue(90);
      abstractClass.setTranslate();
    });
    it('calls getTranslateDistance once', () => {
      expect(abstractClass.getTranslateDistance).toHaveBeenCalledTimes(1);
    });
    it('returns the correct string', () => {
      expect(abstractClass.translate).toEqual('translate(90, 0)');
    });
  });

  describe('integration: getTranslateDistance', () => {
    it('returns the correct value for the left side', () => {
      abstractClass.config = new VicYQuantitativeAxisConfigBuilder()
        .side('left')
        .getConfig();
      expect(abstractClass.getTranslateDistance()).toBe(30);
    });

    it('returns the correct value for the right side', () => {
      abstractClass.config = new VicYQuantitativeAxisConfigBuilder()
        .side('right')
        .getConfig();
      expect(abstractClass.getTranslateDistance()).toBe(110);
    });
  });

  describe('setScale', () => {
    it('sets scale to the correct value', () => {
      abstractClass.setScale();
      expect(abstractClass.scale).toBe('scale');
    });
  });

  describe('setAxisFunction', () => {
    it('sets the axis function to the correct value if side is top', () => {
      abstractClass.config = new VicYQuantitativeAxisConfigBuilder()
        .side('left')
        .getConfig();
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisLeft);
    });

    it('sets the axis function to the correct value if side is bottom', () => {
      abstractClass.config = new VicYQuantitativeAxisConfigBuilder()
        .side('right')
        .getConfig();
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisRight);
    });
  });
});
