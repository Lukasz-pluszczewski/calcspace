import parseExpression from '../parseExpression';

describe('parseExpression', () => {
  it('should parse a correct expression', () => {
    // given
    const expressionToParse = 'E = m*c^2';

    // when
    const { result, symbol, valid, error } = parseExpression(
      expressionToParse,
      {
        m: 1,
        c: 2,
      }
    );

    // then
    expect(result).not.toEqual(null);
    expect(symbol).toEqual('E');
    expect(valid).toEqual(true);
    expect(error).toEqual(null);
  });

  it('should allow an expression without equal signs', () => {
    // given
    const expressionToParse = 'm*c^2';

    // when
    const { symbol, valid } = parseExpression(expressionToParse, {
      m: 1,
      c: 2,
    });

    // then
    expect(symbol).toEqual(null);
    expect(valid).toEqual(true);
  });

  it('should not allow more than one equal sign', () => {
    // given
    const expressionToParse = 'E = m*c^2 = 2';

    // when
    const { valid, error } = parseExpression(expressionToParse, {
      m: 1,
      c: 2,
    });

    // then
    expect(valid).toEqual(false);
    expect(error).toEqual('Only a single equal sign is allowed');
  });

  it('should allow only a symbol on the left of the equal sign', () => {
    // given
    const expressionToParse = 'a + b = 5';

    // when
    const { valid, error } = parseExpression(expressionToParse, {
      m: 1,
      c: 2,
    });

    // then
    expect(valid).toEqual(false);
    expect(error).toEqual(
      'Only a single symbol is allowed on the left side of the equal sign'
    );
  });
});
