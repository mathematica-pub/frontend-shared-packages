import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  let service: UtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilitiesService);
  });

  describe('objectOnNgChangesNotFirstTime()', () => {
    let objectOnNgChangesSpy: jasmine.Spy;
    let changes: any;
    let objectName: string;
    beforeEach(() => {
      objectOnNgChangesSpy = spyOn(
        service,
        'objectOnNgChangesChanged'
      ).and.returnValue(true);
      objectName = 'test';
      changes = {
        [objectName]: new SimpleChange('', '', false),
      };
    });

    describe('if testObject has changes', () => {
      describe('if it is not the first change', () => {
        it('returns true if objectChanges returns true', () => {
          const result = service.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(true);
        });

        it('returns false if objectOnNgChanges returns false', () => {
          objectOnNgChangesSpy.and.returnValue(false);
          const result = service.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(false);
        });
      });

      it('returns false if it is the first change', () => {
        changes = {
          [objectName]: new SimpleChange('', '', true),
        };
        const result = service.objectOnNgChangesChangedNotFirstTime(
          changes,
          objectName
        );
        expect(result).toEqual(false);
      });
    });

    it('returns false if changes does not have property for input string', () => {
      changes = { wrong: new SimpleChange('', '', false) };
      const result = service.objectOnNgChangesChangedNotFirstTime(
        changes,
        objectName
      );
      expect(result).toEqual(false);
    });
  });

  describe('objectOnNgChanges()', () => {
    let changes: any;
    let objectName: string;
    let prevObj: any;
    let currObj: any;
    beforeEach(() => {
      objectName = 'test';
      prevObj = { hello: 'world' };
      currObj = { hello: 'earth' };
      changes = {
        [objectName]: new SimpleChange(prevObj, currObj, false),
      };
    });

    describe('if testObject has changes', () => {
      describe('if it is not the first change', () => {
        it('returns true if previous testObject value does not equal current testObject value -- deep check', () => {
          const result = service.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(true);
        });
        it('returns true if previous testObject value does not equal current testObject value -- deep check, with property name', () => {
          const result = service.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName,
            'hello'
          );
          expect(result).toEqual(true);
        });
        it('returns false if previous testObject equals current testObject value -- deep check', () => {
          changes = {
            [objectName]: new SimpleChange(prevObj, { hello: 'world' }, false),
          };
          const result = service.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(false);
        });
      });
    });

    it('returns false if changes does not have property for input string', () => {
      changes = { wrong: new SimpleChange('', '', false) };
      const result = service.objectOnNgChangesChangedNotFirstTime(
        changes,
        objectName
      );
      expect(result).toEqual(false);
    });
  });
});
