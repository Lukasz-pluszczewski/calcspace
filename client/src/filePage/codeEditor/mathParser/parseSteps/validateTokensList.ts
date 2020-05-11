import tokens from '../tokens';
import { ParserError } from '../errors';

const createAdjacentPairs = (tokensList) => {
  const { pairs, previousToken: lastToken } = tokensList.reduce(
    ({ pairs, previousToken }, currentToken) => {
      return {
        pairs: [...pairs, [previousToken, currentToken]],
        previousToken: currentToken,
      };
    },
    { pairs: [], previousToken: null }
  );
  return [...pairs, [lastToken, null]];
};

const validateTokensList = (tokensList) => {
  tokensList.forEach((token) => {
    if (token.type === tokens.SUBEXPRESSION) {
      validateTokensList(token.value);
    }
    if (token.type === tokens.FUNCTION) {
      validateTokensList(token.subexpressionContent);
    }
  });

  const adjacentPairs = createAdjacentPairs(tokensList);

  adjacentPairs.forEach(([previousToken, currentToken]) => {
    if (previousToken && !currentToken) {
      if (previousToken.type === tokens.OPERATOR) {
        throw new ParserError(`Encountered trailing "${previousToken.value}" operator`, {
          start: previousToken.position,
        });
      }
    }

    if (currentToken && currentToken.type === tokens.OPERATOR) {
      if (!previousToken && currentToken.value !== '-') {
        throw new ParserError(`Encountered leading "${currentToken.value}" operator`, {
          end: currentToken.position + currentToken.value.length,
        });
      }
      if (previousToken && previousToken.type === tokens.OPERATOR) {
        throw new ParserError('Encountered two adjacent operators', {
          start: previousToken.position,
          end: currentToken.position + currentToken.value.length,
        });
      }
    }

    if (currentToken && currentToken.type !== tokens.OPERATOR) {
      if (previousToken && previousToken.type !== tokens.OPERATOR) {
        throw new ParserError(
          `Expected an operator but encountered "${currentToken.value}" instead`,
          {
            start: currentToken.position,
            end: currentToken.position + currentToken.value.length,
          }
        );
      }
    }
  });

  return tokensList;
};

export default validateTokensList;
