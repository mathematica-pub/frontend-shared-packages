import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as lodash from 'lodash';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilitiesService);
  });

  describe('objectChangedNotFirstTime()', () => {
    let isEqualSpy: jasmine.Spy;
    let changes: any;
    let objectName: string;
    beforeEach(() => {
      isEqualSpy = spyOn(lodash, 'isEqual');
      objectName = 'test';
      changes = {
        [objectName]: new SimpleChange('', '', false),
      };
    });

    describe('if testObject has changes', () => {
      describe('if it is not the first change', () => {
        it('returns true if previous testObject value does not equal current testObject value -- deep check', () => {
          isEqualSpy.and.returnValue(false);
          const result = service.objectChangedNotFirstTime(changes, objectName);
          expect(result).toEqual(true);
        });

        it('returns false if previous testObject equals current testObject value -- deep check', () => {
          isEqualSpy.and.returnValue(true);
          const result = service.objectChangedNotFirstTime(changes, objectName);
          expect(result).toEqual(false);
        });
      });

      it('returns false if it is the first change', () => {
        changes = {
          [objectName]: new SimpleChange('', '', true),
        };
        const result = service.objectChangedNotFirstTime(changes, objectName);
        expect(result).toEqual(false);
      });
    });

    it('returns false if changes does not have property for input string', () => {
      changes = { wrong: new SimpleChange('', '', false) };
      const result = service.objectChangedNotFirstTime(changes, objectName);
      expect(result).toEqual(false);
    });
  });
});
