import parseExpression from './parseExpression';
import ERROR_TYPES from './errorTypes';

const createEvaluationResult = options => ({
  result: null,
  error: null,
  symbol: null,
  expression: null,
  ...options,
});

const evaluateExpression = (
  expressionString: string,
  values: { [key: string]: number }
) => {
  const {
    symbol,
    expression,
    parsedExpression,
    valid,
    error,
  } = parseExpression(expressionString);

  if (!valid) {
    return createEvaluationResult({
      error: {
        type: ERROR_TYPES.INVALID_EXPRESSION,
        message: `Invalid expression: ${error}`,
      },
      symbol,
      expression,
    });
  }

  try {
    const result = parsedExpression.evaluate(values);
    return createEvaluationResult({
      result,
      symbol,
      expression,
    });
  } catch (e) {
    return createEvaluationResult({
      error: { type: ERROR_TYPES.UNDEFINED_VARIABLE, message: `${e}` },
      symbol,
      expression,
    });
  }
};

export default evaluateExpression;