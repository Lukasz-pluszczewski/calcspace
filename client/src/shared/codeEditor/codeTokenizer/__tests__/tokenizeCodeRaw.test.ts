import tokenizeCode from '../tokenizeCode';
import tokenizedCodeToString from '../tokenizedCodeToString';
import { trimIndentation } from '../testUtils';

describe('tokenizeCode - raw result test', () => {
  [
    {
      it: 'should respect operators precedence',
      code: `
        a = 5
        b = 2

        c = a + b * 2
      `,
      expectedResult: `
        a = 5
        b = 2

        c = a + b * 2 = 9
      `,
    },
    {
      it: 'should not treat symbols after space as units',
      code: `
        a = 5
        10kg / a
      `,
      expectedResult: `
        a = 5
        10kg / a = 2kg
      `,
    },
    {
      it: 'should support comments',
      code: `
        a = 3
        // a = 5
        a
      `,
      expectedResult: `
        a = 3
        // a = 5
        a = 3
      `,
    },
    {
      it: 'should show result in default unit',
      code: `
        10kN / 5m^2
      `,
      expectedResult: `
        10kN / 5m^2 = 2000Pa
      `,
    },
    {
      it: 'should show result in default unit when declaring varaible',
      code: `
        energy = 500N * 3m
      `,
      expectedResult: `
        energy = 500N * 3m = 1500J
      `,
    },
    {
      it: 'should allow specifying result unit',
      code: `
        10kN / 5m^2 = [kPa]
      `,
      expectedResult: `
        10kN / 5m^2 = [kPa] = 2kPa
      `,
    },
    {
      it: 'should allow specifying result unit when declaring varaible',
      code: `
        energy = 500N * 3m = [N*m]
      `,
      expectedResult: `
        energy = 500N * 3m = [N*m] = 1500N*m
      `,
    },
    {
      it: 'should always show result when using question mark notation',
      code: `
        5m = [m]
      `,
      expectedResult: `
        5m = [m] = 5m
      `,
    },
    {
      it: 'should display result unit it the same notation as specified',
      code: `
        5cm*m = [m*cm]
      `,
      expectedResult: `
        5cm*m = [m*cm] = 5m*cm
      `,
    },
    {
      it: 'should accept result units with negative powers',
      code: `
        15m/s = [m*s^-1]
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        15m/s = [m*s^-1] = 15m*s^-1
      `,
    },
    {
      it: 'should display an error when unit after simplification is empty',
      code: `
        5 = [km/m]
      `,
      expectedResult: `
        5 = [km/m]  Error: Desired result unit is empty after simplification
      `,
    },
    {
      it: 'should show full number when exponential notation is off',
      code: `
        1000000 * 2
        -1000000 * 2
      `,
      options: { exponentialNotation: false },
      expectedResult: `
        1000000 * 2 = 2000000
        -1000000 * 2 = -2000000
      `,
    },
    {
      it: 'should use exponential notation when exponential notation is on',
      code: `
        1000000 * 2
        -1000000 * 2
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        1000000 * 2 = 2·106
        -1000000 * 2 = -2·106
      `,
    },
    {
      it: 'should use exponential notation for numbers smaller than 1',
      code: `
        0.000002
        -0.000002
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        0.000002 = 2·10-6
        -0.000002 = -2·10-6
      `,
    },
    {
      it: 'should not use exponential notation for positive numbers smaller than 10000',
      code: `
        4500 * 2
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        4500 * 2 = 9000
      `,
    },
    {
      it: 'should not use exponential notation for negative numbers larger or equal 0.0001',
      code: `
        0.0001
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        0.0001
      `,
    },
    {
      it: 'should not use exponential notation for Infinity',
      code: `
        1.5e400
        -1.5e400
      `,
      options: { exponentialNotation: true },
      expectedResult: `
        1.5e400 = Infinity
        -1.5e400 = -Infinity
      `,
    },
    {
      it: 'should support negative powers for exponential notation',
      code: `
        2e-1
      `,
      expectedResult: `
        2e-1 = 0.2
      `,
    },
  ].forEach((testCaseData) => {
    it(testCaseData.it, () => {
      // when
      const result = tokenizedCodeToString(tokenizeCode(testCaseData.code, testCaseData.options));

      // then
      expect(trimIndentation(result)).toEqual(trimIndentation(testCaseData.expectedResult));
    });
  });
});
