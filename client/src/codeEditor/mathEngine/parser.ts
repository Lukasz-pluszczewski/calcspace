import { Parser } from 'expr-eval';

const parser = new Parser({
  allowMemberAccess: false,
  operators: {
    add: true,
    comparison: false,
    concatenate: false,
    conditional: false,
    divide: true,
    factorial: true,
    logical: false,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,
    sin: true,
    cos: true,
    tan: true,
    asin: true,
    acos: true,
    atan: true,
    sinh: true,
    cosh: true,
    tanh: true,
    asinh: true,
    acosh: true,
    atanh: true,
    sqrt: true,
    log: true,
    ln: true,
    lg: true,
    log10: true,
    abs: true,
    ceil: true,
    floor: true,
    round: true,
    trunc: true,
    exp: true,
    length: false,
    in: false,
    random: false,
    min: true,
    max: true,
    assignment: false,
    fndef: false,
    cbrt: true,
    expm1: false,
    log1p: true,
    sign: true,
    log2: true,
  },
});

export default parser;