/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { XyChartComponent } from '@hsi/viz-components';
import { XyAxisStub } from '../../testing/stubs/xy-axis.stub';

describe('the XyAxis abstract class', () => {
  let abstractClass: XyAxisStub<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XyAxisStub, XyChartComponent],
    });
    abstractClass = TestBed.inject(XyAxisStub);
  });

  describe('initFromConfig', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setAxisFunction');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'drawMarks');
    });
    it('calls setAxisFunction once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setAxisFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setTranslate once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.setTranslate).toHaveBeenCalledTimes(1);
    });
    it('calls drawMarks once', () => {
      abstractClass.initFromConfig();
      expect(abstractClass.drawMarks).toHaveBeenCalledTimes(1);
    });
  });

  describe('drawMarks', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'initFromConfig');
      spyOn(abstractClass, 'setScale');
      spyOn(abstractClass, 'setAxisFromScaleAndConfig');
      spyOn(abstractClass, 'drawAxis');
      spyOn(abstractClass, 'postProcessAxisFeatures');
      spyOn(abstractClass, 'getTransitionDuration').and.returnValue(200);
    });
    it('calls initFromConfig once if axisFunction is falsy', () => {
      abstractClass.axisFunction = undefined;
      abstractClass.drawMarks();
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
    it('does not call initFromConfig if axisFunction is truthy', () => {
      abstractClass.axisFunction = 'func' as any;
      abstractClass.drawMarks();
      expect(abstractClass.initFromConfig).not.toHaveBeenCalled();
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
