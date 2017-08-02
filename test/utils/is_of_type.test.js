/* global
  it, expect, describe
*/

import {isOfType, isObject, isFunction, isArray} from '../../src/utils/is_of_type.js';

describe('isOfType', () => {
  it('returns a function', () => {
    expect(isOfType('[object Object]')).toBeInstanceOf(Function);
  });
});

describe('isObject', () => {
  it('return true if an object', () => {
    expect(isObject({})).toEqual(true);
  });

  it('return false if not an object', () => {
    expect(isObject([])).toEqual(false);
  });
});

describe('isFunction', () => {
  it('return true if a function', () => {
    expect(isFunction(() => {})).toEqual(true);
  });

  it('return false if not a function', () => {
    expect(isFunction({})).toEqual(false);
  });
});

describe('isArray', () => {
  it('return true if a array', () => {
    expect(isArray([])).toEqual(true);
  });

  it('return false if not a array', () => {
    expect(isArray({})).toEqual(false);
  });
});
