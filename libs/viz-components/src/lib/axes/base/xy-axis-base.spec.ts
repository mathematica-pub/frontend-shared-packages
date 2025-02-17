/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { XyAxisStub } from '../../testing/stubs/xy-axis.stub';
import { VicXOrdinalAxisConfigBuilder } from '../x-ordinal/x-ordinal-axis-builder';
import { VicXQuantitativeAxisConfigBuilder } from '../x-quantitative/x-quantitative-axis-builder';

describe('the XyAxis abstract class', () => {
  let abstractClass: XyAxisStub<number>;
  const mockElementRef = {
    nativeElement: {
      querySelector: jasmine.createSpy('querySelector'),
      style: {},
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XyAxisStub,
        XyChartComponent,
        { provide: ElementRef, useValue: mockElementRef },
      ],
    });
    abstractClass = TestBed.inject(XyAxisStub);
  });

  describe('initFromConfig', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'drawMarks');
    });
    it('calls drawMarks once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.drawMarks).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAxisFromScaleAndConfig', () => {
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
      spyOn(abstractClass, 'setTicks');
      abstractClass.scale = 'class scale' as any;
    });
    it('calls tickSizeOuter once with the correct value if tickSizeOuter is defined', () => {
      abstractClass.config = new VicXOrdinalAxisConfigBuilder()
        .tickSizeOuter(3)
        .getConfig();
      abstractClass.setAxisFromScaleAndConfig();
      expect(tickSizeOuterSpy).toHaveBeenCalledOnceWith(3);
    });
    it('does not call tickSizeOuter if tickSizeOuter is undefined', () => {
      tickSizeOuterSpy.calls.reset();
      abstractClass.config =
        new VicXQuantitativeAxisConfigBuilder().getConfig();
      abstractClass.setAxisFromScaleAndConfig();
      expect(tickSizeOuterSpy).not.toHaveBeenCalled();
    });
    it('calls setTicks once with tickFormat if tickFormat is truthy', () => {
      abstractClass.config = new VicXOrdinalAxisConfigBuilder()
        .tickFormat('.1f')
        .getConfig();
      abstractClass.setAxisFromScaleAndConfig();
      expect(abstractClass.setTicks).toHaveBeenCalledOnceWith('.1f');
    });
    it('does not call setTicks if tickFormat is falsy', () => {
      abstractClass.config = new VicXOrdinalAxisConfigBuilder().getConfig();
      abstractClass.setAxisFromScaleAndConfig();
      expect(abstractClass.setTicks).not.toHaveBeenCalled();
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setAxisFunction');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'setScale');
      spyOn(abstractClass, 'setAxisFromScaleAndConfig');
      spyOn(abstractClass, 'drawAxis');
      spyOn(abstractClass, 'postProcessAxisFeatures');
      spyOn(abstractClass, 'getTransitionDuration').and.returnValue(200);
    });
    it('calls setAxisFunction once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setAxisFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setTranslate once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setTranslate).toHaveBeenCalledTimes(1);
    });
    it('calls setScale once', () => {
      abstractClass.drawMarks();
      expect(abstractClass.setScale).toHaveBeenCalledTimes(1);
    });
    it('calls setAxisFromScaleAndConfig once', () => {
      abstractClass.drawMarks();
      expect(abstractClass.setAxisFromScaleAndConfig).toHaveBeenCalledTimes(1);
    });
    it('calls drawAxis once with the correct value', () => {
      abstractClass.drawMarks();
      expect(abstractClass.drawAxis).toHaveBeenCalledOnceWith(200);
    });
    it('calls postProcessAxisFeatures once', () => {
      abstractClass.drawMarks();
      expect(abstractClass.postProcessAxisFeatures).toHaveBeenCalledTimes(1);
    });
  });
});
