import tokens from './tokens';
import symbolTypes from './symbolTypes';
import { ParserError } from './errors';

const VARIABLE_SYMBOL_REGEX = /^[A-Za-z]\w*$/;
const NUMERIC_SYMBOL_REGEX = /^((0\.[0-9]+)|([1-9]+[0-9]*\.?[0-9]*))$/;
const NUMERIC_SYMBOL_WITH_UNIT_REGEX = /^(?<number>(0\.[0-9]+)|([1-9]+[0-9]*\.?[0-9]*))(?<unit>[A-Za-z]+)$/;

const classifySymbols = (tokensList) => {
  return tokensList.map((token) => {
    if (token.type !== tokens.SYMBOL) {
      return token;
    }
    if (token.value.match(VARIABLE_SYMBOL_REGEX)) {
      return { ...token, symbolType: symbolTypes.VARIABLE };
    }
    if (token.value.match(NUMERIC_SYMBOL_REGEX)) {
      return {
        ...token,
        symbolType: symbolTypes.NUMERIC,
        number: Number(token.value),
      };
    }
    const numericWithUnitMatch = token.value.match(
      NUMERIC_SYMBOL_WITH_UNIT_REGEX
    );
    if (numericWithUnitMatch) {
      const {
        groups: { number, unit },
      } = numericWithUnitMatch;
      return {
        ...token,
        symbolType: symbolTypes.NUMERIC_WITH_UNIT,
        number: Number(number),
        unit,
      };
    }
    throw new ParserError(`Invalid symbol "${token.value}"`);
  });
};

export default classifySymbols;
