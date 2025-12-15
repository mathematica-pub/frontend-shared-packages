import { ValueExtent } from '../types/values';
import { ValueUtilities } from './values';

describe('ValueUtilities', () => {
  describe('integration: getValueRoundedToNSignificantDigits', () => {
    let sigFigures: number;
    let value: number;
    let valueExtent: ValueExtent;
    describe('value is large/positive integer, test with different sigFigures', () => {
      beforeEach(() => {
        value = 1234567;
      });
      describe('if domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 1', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(2000000);
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1300000);
        });
        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1235000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = 5998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(6000000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = 9998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(10000000);
        });
        it('returns the correct value if sigFigures is 0', () => {
          sigFigures = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantFigures(
              value,
              sigFigures,
              valueExtent
            );
          }).toThrow(
            new Error('sigFigures must be greater than or equal to 1')
          );
        });
      });
      describe('if domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 1', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1000000);
        });

        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1200000);
        });
        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1234000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = 5998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(5990000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = 9998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(9990000);
        });
        it('returns the correct value if sigFigures is 0', () => {
          sigFigures = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantFigures(
              value,
              sigFigures,
              valueExtent
            );
          }).toThrow(
            new Error('sigFigures must be greater than or equal to 1')
          );
        });
      });
    });

    describe('value is large/negative integer, test with different sigFigures', () => {
      beforeEach(() => {
        value = -1234567;
      });
      describe('if domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 1', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1000000);
        });

        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1200000);
        });
        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1234000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = -5998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-5990000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = -9998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-9990000);
        });
        it('returns the correct value if sigFigures is 0', () => {
          sigFigures = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantFigures(
              value,
              sigFigures,
              valueExtent
            );
          }).toThrow(
            new Error('sigFigures must be greater than or equal to 1')
          );
        });
      });
      describe('if domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 1', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-2000000);
        });

        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1300000);
        });
        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1235000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = -5998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-6000000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = -9998877;
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-10000000);
        });
        it('returns the correct value if sigFigures is 0', () => {
          sigFigures = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantFigures(
              value,
              sigFigures,
              valueExtent
            );
          }).toThrow(
            new Error('sigFigures must be greater than or equal to 1')
          );
        });
      });
    });

    describe('value is large/positive decimal, test with different sigFigures', () => {
      beforeEach(() => {
        value = 1234.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1240);
        });

        it('returns the correct value if sigFigures is 6', () => {
          sigFigures = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1234.57);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1230);
        });

        it('returns the correct value if sigFigures is 6', () => {
          sigFigures = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1234.56);
        });
      });
    });

    describe('value is large/negative decimal, test with different sigFigures', () => {
      beforeEach(() => {
        value = -1234.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1230);
        });

        it('returns the correct value if sigFigures is 6', () => {
          sigFigures = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1234.56);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1240);
        });

        it('returns the correct value if sigFigures is 6', () => {
          sigFigures = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1234.57);
        });
      });
    });

    describe('value is small/positive integer, test with different sigFigures', () => {
      beforeEach(() => {
        value = 1;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is less than or equal to length of value', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(2);
        });

        it('returns the correct value if sigFigures is greater than length of value', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(2);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is less than or equal to length of value', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1);
        });

        it('returns the correct value if sigFigures is greater than length of value', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1);
        });
      });
    });

    describe('value is small/negative integer, test with different sigFigures', () => {
      beforeEach(() => {
        value = -1;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is less than or equal to length of value', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1);
        });

        it('returns the correct value if sigFigures is greater than length of value', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is less than or equal to length of value', () => {
          sigFigures = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-2);
        });

        it('returns the correct value if sigFigures is greater than length of value', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-2);
        });
      });
    });

    describe('value is positive decimal, < 100 and > 10, test with different sigFigures', () => {
      beforeEach(() => {
        value = 15.678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(16);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(15.7);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(15);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(15.6);
        });
      });
    });

    describe('value is negative decimal, > -100 and < -10, test with different sigFigures', () => {
      beforeEach(() => {
        value = -15.678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-15);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-15.6);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-16);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-15.7);
        });
      });
    });

    describe('value is small/positive decimal, < 10 and > 1, test with different sigFigures', () => {
      beforeEach(() => {
        value = 1.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1.6);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1.57);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1.5);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1.56);
        });
      });
    });

    describe('value is small/negative decimal, < 10 and > 1, test with different sigFigures', () => {
      beforeEach(() => {
        value = -1.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1.5);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1.56);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1.6);
        });

        it('returns the correct value if sigFigures is 3', () => {
          sigFigures = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1.57);
        });
      });
    });

    describe('value is small decimal, < 1, test with different sigFigures', () => {
      beforeEach(() => {
        value = 0.0010678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.0011);
        });

        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.001068);
        });

        it('returns the correct value if sigFigures is 1 and sig value ends with 9', () => {
          sigFigures = 1;
          value = 0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.01);
        });

        it('returns the correct value if sigFigures is 2 and sig value ends with 99', () => {
          sigFigures = 2;
          value = 0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.1);
        });

        it('returns the correct value if sigFigures is 2 and value is 0.9', () => {
          sigFigures = 2;
          value = 0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(1);
        });
      });

      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.001);
        });

        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0.001067);
        });

        it('returns the correct value if sigFigures is 1 and sig value ends with 9', () => {
          sigFigures = 1;
          value = 0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigFigures is 2 and sig value ends with 99', () => {
          sigFigures = 2;
          value = 0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigFigures is 2 and value is 0.9', () => {
          sigFigures = 2;
          value = 0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });
      });
    });

    describe('value is small decimal, > -1, test with different sigFigures', () => {
      beforeEach(() => {
        value = -0.0010678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.max;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.001);
        });

        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.001067);
        });

        it('returns the correct value if sigFigures is 1 and sig value ends with 9', () => {
          sigFigures = 1;
          value = -0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigFigures is 2 and sig value ends with 99', () => {
          sigFigures = 2;
          value = -0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigFigures is 2 and value is 0.9', () => {
          sigFigures = 2;
          value = -0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(0);
        });
      });

      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueExtent = ValueExtent.min;
        });
        it('returns the correct value if sigFigures is 2', () => {
          sigFigures = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.0011);
        });

        it('returns the correct value if sigFigures is 4', () => {
          sigFigures = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.001068);
        });

        it('returns the correct value if sigFigures is 1 and sig value ends with 9', () => {
          sigFigures = 1;
          value = -0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.01);
        });

        it('returns the correct value if sigFigures is 2 and sig value ends with 99', () => {
          sigFigures = 2;
          value = -0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-0.1);
        });

        it('returns the correct value if sigFigures is 2 and value is 0.9', () => {
          sigFigures = 2;
          value = -0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantFigures(
            value,
            sigFigures,
            valueExtent
          );
          expect(result).toEqual(-1);
        });
      });
    });
  });
});
