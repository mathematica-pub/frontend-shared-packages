import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DataMarksBaseStub } from '../testing/stubs/data-marks-base.stub';

describe('DataMarksBase abstract class', () => {
  let abstractClass: DataMarksBaseStub<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataMarksBaseStub],
    });
    abstractClass = TestBed.inject(DataMarksBaseStub);
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    beforeEach(() => {
      spyOn(abstractClass, 'initFromConfig');
      configChange = {
        userConfig: new SimpleChange({ num: 'one' }, { num: 'two' }, false),
      };
    });
    it('should call initFromConfig once if userConfig changes exist, if not first change, and if curr value is different from prev value', () => {
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(1);
    });
    it('should call not call initFromConfig if curr value and prev value are the same', () => {
      configChange = {
        userConfig: new SimpleChange({ num: 'one' }, { num: 'one' }, false),
      };
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
    it('should not call initFromConfig if firstChange', () => {
      configChange = {
        userConfig: new SimpleChange(1, 1, true),
      };
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
    it('should not call initFromConfig if userConfig changes do not exist', () => {
      configChange = {};
      abstractClass.ngOnChanges(configChange);
      expect(abstractClass.initFromConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('initFromConfig()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setConfig');
      spyOn(abstractClass, 'setPropertiesFromConfig');
      spyOn(abstractClass, 'setPropertiesFromRanges');
      abstractClass.initFromConfig();
    });
    it('calls setConfig()', () => {
      expect(abstractClass.setConfig).toHaveBeenCalledTimes(1);
    });
    it('calls setPropertiesFromConfig()', () => {
      expect(abstractClass.setPropertiesFromConfig).toHaveBeenCalledTimes(1);
    });
    it('calls setPropertiesFromRanges()', () => {
      expect(abstractClass.setPropertiesFromRanges).toHaveBeenCalledTimes(1);
    });
  });

  describe('deepCloneObject()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'assignValue');
      spyOn(abstractClass, 'structuredCloneValue');
      spyOn(abstractClass, 'deepCloneObject').and.callThrough();
    });
    it('correctly handles values that are functions', () => {
      const obj = {
        a: () => {
          return 1;
        },
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are arrays', () => {
      const obj = {
        a: [1, 2, 3],
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are number', () => {
      const obj = {
        a: 1,
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are strings', () => {
      const obj = {
        a: '1',
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are booleans', () => {
      const obj = {
        a: true,
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are null', () => {
      const obj = {
        a: null,
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are undefined', () => {
      const obj = {
        a: undefined,
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are 0', () => {
      const obj = {
        a: 0,
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are dates', () => {
      const obj = {
        a: new Date(),
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(1);
    });
    it('correctly handles values that are other objects', () => {
      const obj = {
        a: {
          b: 'c',
        },
      };
      abstractClass.deepCloneObject(obj);
      expect(abstractClass.assignValue).toHaveBeenCalledTimes(0);
      expect(abstractClass.structuredCloneValue).toHaveBeenCalledTimes(1);
      expect(abstractClass.deepCloneObject).toHaveBeenCalledTimes(2);
    });
  });
});
