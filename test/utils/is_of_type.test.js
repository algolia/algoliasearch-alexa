/* global
  it, expect, describe
*/

import {isOfType, isObject, isFunction} from '../../src/utils/is_of_type.js';

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
  it('return true if an object', () => {
    expect(isFunction(() => {})).toEqual(true);
  });

  it('return false if not an object', () => {
    expect(isFunction({})).toEqual(false);
  });
});
