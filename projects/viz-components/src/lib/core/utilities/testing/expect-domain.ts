import { expect } from 'local-cypress';

type Assert = 'isEqual' | 'isAbove' | 'isBelow' | 'isCloseTo';

/**
 * ValidateValue class
 * @class
 * @classdesc ValidateValue class is used to validate the value of a domain
 * @example
 * const validateValue = new ValidateValue({ value: 10 });
 * validateValue.validate(10);
 * @example
 * const validateValue = new ValidateValue({ value: 10, assertion: 'equal' });
 * validateValue.validate(10);
 * @example
 * const validateValue = new ValidateValue({ value: 10, assertion: 'above' });
 * validateValue.validate(11);
 * @example
 * const validateValue = new ValidateValue({ value: 10, assertion: 'below' });
 * validateValue.validate(9);
 * @example
 * const validateValue = new ValidateValue({ value: 10, assertion: 'closeTo', tolerance: 0.0001 });
 * validateValue.validate(10.00001);
 */
class ValidateValue {
  private value: number;
  private assert: Assert;
  private tolerance: number;

  constructor(options: { value: number; assert?: Assert; tolerance?: number }) {
    this.value = options.value;
    this.assert = options.assert;
    this.tolerance = options.tolerance;
  }

  validate(expected: number): void {
    if (this.assert === undefined) {
      this.assert = 'isEqual';
    }
    if (this.tolerance === undefined && this.assert === 'isCloseTo') {
      this.tolerance = 0.0001;
    }
    switch (this.assert) {
      case 'isEqual':
        expect(expected).to.equal(this.value);
        break;
      case 'isAbove':
        expect(expected).to.be.above(this.value);
        break;
      case 'isBelow':
        expect(expected).to.be.below(this.value);
        break;
      case 'isCloseTo':
        expect(expected).to.be.closeTo(this.value, this.tolerance);
        break;
    }
  }
}

/**
 * ValidateDomain class
 * @class
 * @classdesc ValidateDomain class is used to validate the domain of a chart
 * @example
 * const validateDomain = new ValidateDomain();
 * validateDomain.min(0).max(10);
 * validateDomain.validate();
 * @example
 * const validateDomain = new ValidateDomain();
 * validateDomain.min(0, { assertion: 'above' }).max(10, { assertion: 'below' });
 * validateDomain.validate();
 * @example
 * const validateDomain = new ValidateDomain();
 * validateDomain.min(0, { assertion: 'closeTo', tolerance: 0.0001 }).max(10, { assertion: 'closeTo', tolerance: 0.0001 });
 */
class ValidateDomain {
  private min?: ValidateValue;
  private max?: ValidateValue;
  expected: [number, number];

  constructor(expected: [number, number]) {
    this.expected = expected;
  }

  minToBe(
    min: number,
    options?: {
      assert: Assert;
      tolerance?: number;
    }
  ): ValidateDomain {
    this.min = new ValidateValue({ value: min, ...options });
    return this;
  }

  maxToBe(
    max: number,
    options?: {
      assert: Assert;
      tolerance?: number;
    }
  ): ValidateDomain {
    this.max = new ValidateValue({ value: max, ...options });
    return this;
  }

  validate(): void {
    if (this.min) {
      this.min.validate(this.expected[0]);
    }
    if (this.max) {
      this.max.validate(this.expected[1]);
    }
  }
}

/**
 * expectDomain function
 * @function
 * @functiondesc expectDomain function is used to create a new instance of ValidateDomain
 * @example
 * expectDomain().min(0).max(10).validate();
 * @example
 * expectDomain().min(0, { assertion: 'above' }).max(10, { assertion: 'below' }).validate();
 * @example
 * expectDomain().min(0, { assertion: 'closeTo', tolerance: 0.0001 }).max(10, { assertion: 'closeTo', tolerance: 0.0001 }).validate();
 */
export function expectDomain(values: [number, number]): ValidateDomain {
  return new ValidateDomain(values);
}
