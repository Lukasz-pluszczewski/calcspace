import tokens from './tokens';

const evaluateSubexpression = (subexpressionToken, values, functions) => {
  return evaluateSum(subexpressionToken.value, values, functions);
};

const evaluateFunction = (functionToken, values, functions) => {
  const func = functions[functionToken.name];
  if (typeof func !== 'function') {
    throw new Error(`Missing or invalid function ${functionToken.name}`);
  }
  const argumentValue = evaluateSum(
    functionToken.subexpressionContent,
    values,
    functions
  );
  const result = func(argumentValue);
  if (typeof result !== 'number') {
    throw new Error(`Invalid result type from function ${functionToken.name}`);
  }
  return result;
};

const evaluateSymbol = (symbolToken, values) => {
  if (!Number.isNaN(Number(symbolToken.value))) {
    return Number(symbolToken.value);
  }
  const value = values[symbolToken.value];
  if (typeof value !== 'number') {
    throw new Error(`Missing or invalid value for symbol ${symbolToken.value}`);
  }
  return values[symbolToken.value];
};

const evaluateToken = (token, values, functions) => {
  switch (token.type) {
    case tokens.SYMBOL:
      return evaluateSymbol(token, values);
    case tokens.SUBEXPRESSION:
      return evaluateSubexpression(token, values, functions);
    case tokens.FUNCTION:
      return evaluateFunction(token, values, functions);
    default:
      throw new Error(`Unexpected token type '${token.type}'`);
  }
};

const evaluatePower = (elements, values, functions) => {
  const evaluatedElements = elements.map((element) =>
    evaluateToken(element, values, functions)
  );
  return [...evaluatedElements]
    .reverse()
    .reduce((acc, currentValue) => currentValue ** acc);
};

const evaluateProduct = (elements, values, functions) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluatePower(element, values, functions)
      : evaluateToken(element, values, functions)
  );
  return evaluatedElements.reduce((acc, currentValue) => acc * currentValue, 1);
};

const evaluateSum = (elements, values, functions) => {
  const evaluatedElements = elements.map((element) =>
    Array.isArray(element)
      ? evaluateProduct(element, values, functions)
      : evaluateToken(element, values, functions)
  );
  return evaluatedElements.reduce((acc, currentValue) => acc + currentValue, 0);
};

const evaluateParsedExpression = (
  parsedExpression,
  { values = {}, functions = {} } = {}
) => {
  return evaluateSum(parsedExpression, values, functions);
};

export default evaluateParsedExpression;
