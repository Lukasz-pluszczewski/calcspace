import evaluateExpression from './mathEngine/evaluateExpression';
import { constants, functions, unitsMap } from './constants';

export const tokens = {
  NORMAL: 'NORMAL',
  VIRTUAL: 'VIRTUAL',
  ERROR: 'ERROR',
  COMMENT: 'COMMENT',
};

const valueWithUnitToString = ({ number, unit }) =>
  `${number}${unit.map((u) => `${u.unit}${u.power === 1 ? '' : `^${u.power}`}`).join('*')}`;

const tokenizeLine = (values, expression) => {
  const sanitizedExpression = expression.trimStart();

  if (sanitizedExpression === '') {
    return {
      values,
      tokenizedLine: [],
    };
  }

  if (sanitizedExpression.substring(0, 2) === '//') {
    return {
      values,
      tokenizedLine: [{ value: expression, tags: [tokens.COMMENT] }],
    };
  }

  const { result, error, symbol, expression: expStr } = evaluateExpression(
    expression,
    values,
    functions,
    unitsMap
  );
  const showResult = result !== null && expStr !== valueWithUnitToString(result);
  const resultString = showResult ? ` = ${valueWithUnitToString(result)}` : '';
  const tokenizedLine = [
    {
      value: expression,
      tags: [tokens.NORMAL, ...(error ? [tokens.ERROR] : [])],
    },
    ...(resultString === '' ? [] : [{ value: resultString, tags: [tokens.VIRTUAL] }]),
    ...(!error ? [] : [{ value: `  ${error.message}`, tags: [tokens.VIRTUAL] }]),
  ];

  return {
    values: symbol && result !== null ? { [symbol]: result } : {},
    tokenizedLine,
  };
};

const evaluateCode = (code) => {
  const codeLines = code.split('\n');
  const initialState = { values: constants, evaluatedLines: [] };
  const { evaluatedLines } = codeLines.reduce((acc, expression) => {
    const { values, tokenizedLine } = tokenizeLine(acc.values, expression);
    return {
      values: { ...acc.values, ...values },
      evaluatedLines: [...acc.evaluatedLines, tokenizedLine],
    };
  }, initialState);
  return evaluatedLines;
};

export default evaluateCode;
