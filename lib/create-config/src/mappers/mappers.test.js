/* eslint-disable jest/max-expects */
import { toNumber } from './mappers';

describe('# @lib/create-config:mappers', () => {
  describe('## toNumber', () => {
    describe('when passed string is representation of number', () => {
      it('should return number', () => {
        expect(toNumber('-1000')).toBe(-1000);
        expect(toNumber('0')).toBe(0);
        expect(toNumber('568')).toBe(568);
        expect(toNumber('1.2')).toBe(1.2);
        expect(toNumber('1.2e-10')).toBe(1.2e-10);
      });
    });

    describe('when passed string is not representation of number', () => {
      it('should return NaN', () => {
        expect(toNumber('a')).toBeNaN();
        expect(toNumber('true')).toBeNaN();
        expect(toNumber('false')).toBeNaN();
        expect(toNumber('null')).toBeNaN();
      });
    });
    describe('when passed undefined', () => {
      it('should return undefined', () => {
        expect(toNumber()).toBeUndefined();
      });
    });
  });
});
