/* global
  it, expect, describe
*/

import buildParams from '../../src/utils/build_params.js';

describe('buildParams', () => {
  describe('when nothing is specified', () => {
    it('returns an empty object if undefined', () => {
      expect(buildParams(undefined)).toEqual({});
    });

    it('returns an empty object if null', () => {
      expect(buildParams(null)).toEqual({});
    });
  });

  describe('when a non-object something is specified', () => {
    it('throws for a string', () => {
      expect(() => {
        buildParams('');
      }).toThrow();
    });

    it('throws for a boolean', () => {
      expect(() => {
        buildParams(true);
      }).toThrow();
    });

    it('throws for an array', () => {
      expect(() => {
        buildParams([]);
      }).toThrow();
    });

    it('throws for a number', () => {
      expect(() => {
        buildParams(1);
      }).toThrow();
    });

    it('throws for a set', () => {
      expect(() => {
        buildParams(new Set());
      }).toThrow();
    });

    it('throws for a map', () => {
      expect(() => {
        buildParams(new Map());
      }).toThrow();
    });

    it('throws for a function', () => {
      expect(() => {
        buildParams(() => {});
      }).toThrow();
    });
  });
});
