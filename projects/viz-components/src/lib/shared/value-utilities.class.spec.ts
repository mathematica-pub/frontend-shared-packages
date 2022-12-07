import { ValueUtilities } from './value-utilities.class';

describe('ValueUtilities', () => {
  describe('integration: getValueRoundedUpNSignificantDigits', () => {
    let sigDigits: number;
    let value: number;
    describe('value is large integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1234567;
      });
      it('returns the correct value if sigDigits is 1', () => {
        sigDigits = 1;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(2000000);
      });

      it('returns the correct value if sigDigits is 2', () => {
        sigDigits = 2;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1300000);
      });
      it('returns the correct value if sigDigits is 4', () => {
        sigDigits = 4;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1235000);
      });
      it('returns the correct value if sigDigits is 0', () => {
        sigDigits = 0;
        expect(function () {
          ValueUtilities.getValueRoundedUpNSignificantDigits(value, sigDigits);
        }).toThrow(new Error('sigDigits must be greater than or equal to 1'));
      });
    });

    describe('value is large decimal, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1234.5678;
      });
      it('returns the correct value if sigDigits is 3', () => {
        sigDigits = 3;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1240);
      });

      it('returns the correct value if sigDigits is 6', () => {
        sigDigits = 6;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1234.57);
      });
    });

    describe('value is small integer, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1;
      });
      it('returns the correct value if sigDigits is less than or equal to length of value', () => {
        sigDigits = 1;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(2);
      });

      it('returns the correct value if sigDigits is greater than length of value', () => {
        sigDigits = 4;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(2);
      });
    });

    describe('value is decimal, < 100 and > 10, test with different sigDigits', () => {
      beforeEach(() => {
        value = 15.678;
      });
      it('returns the correct value if sigDigits is 2', () => {
        sigDigits = 2;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(16);
      });

      it('returns the correct value if sigDigits is 3', () => {
        sigDigits = 3;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(15.7);
      });
    });

    describe('value is small decimal, < 10 and > 1, test with different sigDigits', () => {
      beforeEach(() => {
        value = 1.5678;
      });
      it('returns the correct value if sigDigits is 2', () => {
        sigDigits = 2;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1.6);
      });

      it('returns the correct value if sigDigits is 3', () => {
        sigDigits = 3;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1.57);
      });
    });

    describe('value is small decimal, < 1, test with different sigDigits', () => {
      beforeEach(() => {
        value = 0.0010678;
      });
      it('returns the correct value if sigDigits is 2', () => {
        sigDigits = 2;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(0.0011);
      });

      it('returns the correct value if sigDigits is 4', () => {
        sigDigits = 4;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(0.001068);
      });

      it('returns the correct value if sigDigits is 1 and sig value ends with 9', () => {
        sigDigits = 1;
        value = 0.009;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(0.01);
      });

      it('returns the correct value if sigDigits is 2 and sig value ends with 99', () => {
        sigDigits = 2;
        value = 0.099;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(0.1);
      });

      it('returns the correct value if sigDigits is 2 and value is 0.9', () => {
        sigDigits = 2;
        value = 0.9;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(1);
      });
    });

    describe('value is negative', () => {
      beforeEach(() => {
        value = -123456;
      });
      it('returns the value rounded down / to a higher negative number', () => {
        sigDigits = 2;
        const result = ValueUtilities.getValueRoundedUpNSignificantDigits(
          value,
          sigDigits
        );
        expect(result).toEqual(-130000);
      });
    });
  });
});
