import { DomainExtent } from '../core/services/data-domain.service';
import { ValueUtilities } from './value-utilities.class';

describe('ValueUtilities', () => {
  describe('integration: getValueRoundedToNSignificantDigits', () => {
    let sigDigits: number;
    let value: number;
    let valueType: DomainExtent;
    describe('value is large/positive integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1234567;
      });
      describe('if domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 1', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(2000000);
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1300000);
        });
        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1235000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = 5998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(6000000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = 9998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(10000000);
        });
        it('returns the correct value if sigDigits is 0', () => {
          sigDigits = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantDigits(
              value,
              sigDigits,
              valueType
            );
          }).toThrow(new Error('sigDigits must be greater than or equal to 1'));
        });
      });
      describe('if domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 1', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1000000);
        });

        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1200000);
        });
        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1234000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = 5998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(5990000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = 9998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(9990000);
        });
        it('returns the correct value if sigDigits is 0', () => {
          sigDigits = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantDigits(
              value,
              sigDigits,
              valueType
            );
          }).toThrow(new Error('sigDigits must be greater than or equal to 1'));
        });
      });
    });

    describe('value is large/negative integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = -1234567;
      });
      describe('if domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 1', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1000000);
        });

        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1200000);
        });
        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1234000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = -5998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-5990000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = -9998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-9990000);
        });
        it('returns the correct value if sigDigits is 0', () => {
          sigDigits = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantDigits(
              value,
              sigDigits,
              valueType
            );
          }).toThrow(new Error('sigDigits must be greater than or equal to 1'));
        });
      });
      describe('if domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 1', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-2000000);
        });

        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1300000);
        });
        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1235000);
        });
        it('returns the correct value if the last rounded sig digit is 9', () => {
          value = -5998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-6000000);
        });
        it('returns the correct value if the last rounded sig digit is 9 and the first digit is rounded up', () => {
          value = -9998877;
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-10000000);
        });
        it('returns the correct value if sigDigits is 0', () => {
          sigDigits = 0;
          expect(function () {
            ValueUtilities.getValueRoundedToNSignificantDigits(
              value,
              sigDigits,
              valueType
            );
          }).toThrow(new Error('sigDigits must be greater than or equal to 1'));
        });
      });
    });

    describe('value is large/positive decimal, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1234.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1240);
        });

        it('returns the correct value if sigDigits is 6', () => {
          sigDigits = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1234.57);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1230);
        });

        it('returns the correct value if sigDigits is 6', () => {
          sigDigits = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1234.56);
        });
      });
    });

    describe('value is large/negative decimal, test with different sigDigits', () => {
      beforeEach(() => {
        value = -1234.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1230);
        });

        it('returns the correct value if sigDigits is 6', () => {
          sigDigits = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1234.56);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1240);
        });

        it('returns the correct value if sigDigits is 6', () => {
          sigDigits = 6;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1234.57);
        });
      });
    });

    describe('value is small/positive integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is less than or equal to length of value', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(2);
        });

        it('returns the correct value if sigDigits is greater than length of value', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(2);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is less than or equal to length of value', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1);
        });

        it('returns the correct value if sigDigits is greater than length of value', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1);
        });
      });
    });

    describe('value is small/negative integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = -1;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is less than or equal to length of value', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1);
        });

        it('returns the correct value if sigDigits is greater than length of value', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is less than or equal to length of value', () => {
          sigDigits = 1;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-2);
        });

        it('returns the correct value if sigDigits is greater than length of value', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-2);
        });
      });
    });

    describe('value is positive decimal, < 100 and > 10, test with different sigDigits', () => {
      beforeEach(() => {
        value = 15.678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(16);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(15.7);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(15);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(15.6);
        });
      });
    });

    describe('value is negative decimal, > -100 and < -10, test with different sigDigits', () => {
      beforeEach(() => {
        value = -15.678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-15);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-15.6);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-16);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-15.7);
        });
      });
    });

    describe('value is small/positive decimal, < 10 and > 1, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1.6);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1.57);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1.5);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1.56);
        });
      });
    });

    describe('value is small/negative decimal, < 10 and > 1, test with different sigDigits', () => {
      beforeEach(() => {
        value = -1.5678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1.5);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1.56);
        });
      });
      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1.6);
        });

        it('returns the correct value if sigDigits is 3', () => {
          sigDigits = 3;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1.57);
        });
      });
    });

    describe('value is small decimal, < 1, test with different sigDigits', () => {
      beforeEach(() => {
        value = 0.0010678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.0011);
        });

        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.001068);
        });

        it('returns the correct value if sigDigits is 1 and sig value ends with 9', () => {
          sigDigits = 1;
          value = 0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.01);
        });

        it('returns the correct value if sigDigits is 2 and sig value ends with 99', () => {
          sigDigits = 2;
          value = 0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.1);
        });

        it('returns the correct value if sigDigits is 2 and value is 0.9', () => {
          sigDigits = 2;
          value = 0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(1);
        });
      });

      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.001);
        });

        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0.001067);
        });

        it('returns the correct value if sigDigits is 1 and sig value ends with 9', () => {
          sigDigits = 1;
          value = 0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigDigits is 2 and sig value ends with 99', () => {
          sigDigits = 2;
          value = 0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigDigits is 2 and value is 0.9', () => {
          sigDigits = 2;
          value = 0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });
      });
    });

    describe('value is small decimal, > -1, test with different sigDigits', () => {
      beforeEach(() => {
        value = -0.0010678;
      });
      describe('if the domain type is max', () => {
        beforeEach(() => {
          valueType = 'max';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.001);
        });

        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.001067);
        });

        it('returns the correct value if sigDigits is 1 and sig value ends with 9', () => {
          sigDigits = 1;
          value = -0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigDigits is 2 and sig value ends with 99', () => {
          sigDigits = 2;
          value = -0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });

        it('returns the correct value if sigDigits is 2 and value is 0.9', () => {
          sigDigits = 2;
          value = -0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(0);
        });
      });

      describe('if the domain type is min', () => {
        beforeEach(() => {
          valueType = 'min';
        });
        it('returns the correct value if sigDigits is 2', () => {
          sigDigits = 2;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.0011);
        });

        it('returns the correct value if sigDigits is 4', () => {
          sigDigits = 4;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.001068);
        });

        it('returns the correct value if sigDigits is 1 and sig value ends with 9', () => {
          sigDigits = 1;
          value = -0.009;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.01);
        });

        it('returns the correct value if sigDigits is 2 and sig value ends with 99', () => {
          sigDigits = 2;
          value = -0.099;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-0.1);
        });

        it('returns the correct value if sigDigits is 2 and value is 0.9', () => {
          sigDigits = 2;
          value = -0.9;
          const result = ValueUtilities.getValueRoundedToNSignificantDigits(
            value,
            sigDigits,
            valueType
          );
          expect(result).toEqual(-1);
        });
      });
    });
  });
});
