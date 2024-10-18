/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { axisBottom, axisTop } from 'd3';
import { XAxisStub } from '../../testing/stubs/x-axis.stub';
import { VicXQuantitativeAxisConfigBuilder } from '../x-quantitative/x-quantitative-axis-builder';

describe('the XAxis mixin', () => {
  let abstractClass: XAxisStub<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XAxisStub, XyChartComponent],
    });
    abstractClass = TestBed.inject(XAxisStub);
    abstractClass.scales = {
      y: {
        range: jasmine.createSpy().and.returnValue([100, 20]),
      },
      x: 'scale',
    } as any;
    abstractClass.chart = {
      margin: { top: 10 },
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
      expect(abstractClass.translate).toEqual('translate(0, 90)');
    });
  });

  describe('integration: getTranslateDistance', () => {
    it('returns the correct value for the top side', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .side('top')
        .getConfig();
      expect(abstractClass.getTranslateDistance()).toBe(20);
    });
    it('returns the correct value for the bottom side', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .side('bottom')
        .getConfig();
      expect(abstractClass.getTranslateDistance()).toBe(90);
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
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .side('top')
        .getConfig();
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisTop);
    });

    it('sets the axis function to the correct value if side is bottom', () => {
      abstractClass.config = new VicXQuantitativeAxisConfigBuilder()
        .side('bottom')
        .getConfig();
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisBottom);
    });
  });
});
