/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataMarksStub } from '../testing/stubs/data-marks.stub';

describe('DataMarks abstract class', () => {
  let abstractClass: DataMarksStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataMarksStub],
    });
    abstractClass = TestBed.inject(DataMarksStub);
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    beforeEach(() => {
      spyOn(abstractClass, 'initFromConfig');
      configChange = {
        config: new SimpleChange({ num: 'one' }, { num: 'two' }, false),
      };
    });
    it('should call initFromConfig once if config changes exist, if not first change, and if curr value is different from prev value', () => {
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
    it('should call not call initFromConfig if curr value and prev value are the same', () => {
      configChange = {
        config: new SimpleChange({ num: 'one' }, { num: 'one' }, false),
      };
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
    it('should not call initFromConfig if firstChange', () => {
      configChange = {
        config: new SimpleChange(1, 1, true),
      };
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
    it('should not call initFromConfig if config changes do not exist', () => {
      configChange = {};
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('initFromConfig()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setPropertiesFromRanges');
      abstractClass.initFromConfig();
    });
    it('calls setPropertiesFromRanges()', () => {
      expect(abstractClass.setChartScalesFromRanges).toHaveBeenCalledTimes(1);
    });
  });
});
