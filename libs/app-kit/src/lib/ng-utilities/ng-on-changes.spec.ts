/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleChange } from '@angular/core';
import { NgOnChangesUtilities } from './ng-on-changes';

describe('ngInputObjectChangedNotFirstTime()', () => {
  let ngInputObjectChanged: jasmine.Spy;
  let changes: any;
  let inputName: string;
  beforeEach(() => {
    ngInputObjectChanged = spyOn(
      NgOnChangesUtilities,
      'inputObjectChanged'
    ).and.returnValue(true);
    inputName = 'test';
    changes = {
      [inputName]: {
        previousValue: '',
        currentValue: '',
        isFirstChange: () => false,
      },
    };
  });

  describe('if input has changed', () => {
    describe('if it is not the first change', () => {
      it('returns true if objectChanges returns true', () => {
        const result = NgOnChangesUtilities.inputObjectChangedNotFirstTime(
          changes,
          inputName
        );
        expect(result).toEqual(true);
      });

      it('returns false if objectOnNgChanges returns false', () => {
        ngInputObjectChanged.and.returnValue(false);
        const result = NgOnChangesUtilities.inputObjectChangedNotFirstTime(
          changes,
          inputName
        );
        expect(result).toEqual(false);
      });
    });

    it('returns false if it is the first change', () => {
      changes[inputName].isFirstChange = () => true;
      const result = NgOnChangesUtilities.inputObjectChangedNotFirstTime(
        changes,
        inputName
      );
      expect(result).toEqual(false);
    });
  });

  it('returns false if changes does not have property for input string', () => {
    changes = { wrong: new SimpleChange('', '', false) };
    const result = NgOnChangesUtilities.inputObjectChangedNotFirstTime(
      changes,
      inputName
    );
    expect(result).toEqual(false);
  });
});

describe('ngInputObjectChanged()', () => {
  let changes: any;
  let objectName: string;
  let prevObj: any;
  let currObj: any;
  beforeEach(() => {
    objectName = 'test';
    prevObj = { hello: 'world' };
    currObj = { hello: 'earth' };
    changes = {
      [objectName]: {
        previousValue: prevObj,
        currentValue: currObj,
        isFirstChange: () => false,
      },
    };
  });

  describe('if testObject has changed', () => {
    describe('if it is not the first change', () => {
      it('returns true if previous testObject value does not equal current testObject value -- deep check', () => {
        const result = NgOnChangesUtilities.inputObjectChanged(
          changes,
          objectName
        );
        expect(result).toEqual(true);
      });
      it('returns true if previous testObject value does not equal current testObject value -- deep check, with property name', () => {
        const result = NgOnChangesUtilities.inputObjectChanged(
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
        const result = NgOnChangesUtilities.inputObjectChanged(
          changes,
          objectName
        );
        expect(result).toEqual(false);
      });
    });
  });

  it('returns false if changes does not have property for input string', () => {
    changes = { wrong: new SimpleChange('', '', false) };
    const result = NgOnChangesUtilities.inputObjectChanged(changes, objectName);
    expect(result).toEqual(false);
  });
});
