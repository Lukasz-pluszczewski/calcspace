import {
  parseExpression as parse,
  evaluateParsedExpression,
} from '../mathParser';

const ERRORS = {
  SINGLE_EQUAL_ALLOWED: 'Only a single equal sign is allowed',
  SINGLE_SYMBOL_ON_THE_LEFT_ALLOWED:
    'Only a single symbol is allowed on the left side of the equal sign',
};

const ALL_WHITESPACES_REGEX = /\s/g;
const IS_SYMBOL_REGEX = /^[A-Za-z]\w*$/;

const functions = {
  sqrt: Math.sqrt,
  log: Math.log,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
};

const createErrorResult = (error) => ({
  valid: false,
  error,
  symbol: null,
  expression: null,
  parsedExpression: null,
  result: null,
});

const createValidResult = (symbol, expression, result) => ({
  valid: true,
  error: null,
  symbol,
  expression,
  result,
});

const parseExpression = (expressionToParse: string, values) => {
  const expressionWithoutWhitespaces = expressionToParse.replace(
    ALL_WHITESPACES_REGEX,
    ''
  );
  const splittedByEquals = expressionWithoutWhitespaces.split('=');
  if (splittedByEquals.length > 2) {
    return createErrorResult(ERRORS.SINGLE_EQUAL_ALLOWED);
  }
  const [symbol, expression] =
    splittedByEquals.length === 2
      ? splittedByEquals
      : [null, splittedByEquals[0]];

  if (symbol !== null && !symbol.match(IS_SYMBOL_REGEX)) {
    return createErrorResult(ERRORS.SINGLE_SYMBOL_ON_THE_LEFT_ALLOWED);
  }

  const { parsedExpression, isValid, errorMessage } = parse(expression);
  if (!isValid) {
    return createErrorResult(errorMessage);
  }
  try {
    const result = evaluateParsedExpression(parsedExpression, {
      values: { PI: Math.PI, ...values },
      functions,
    });
    return createValidResult(symbol, expression, result);
  } catch (error) {
    return createErrorResult(error && error.message);
  }
};

export default parseExpression;
