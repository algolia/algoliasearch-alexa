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

  describe('when an object is specified', () => {
    describe('when values are all strings', () => {
      it('returns the object as is', () => {
        const params = {
          page: 10,
          hitsPerPage: 12,
        };
        expect(buildParams(params)).toEqual(params);
      });
    });

    describe('when a value is a function', () => {
      it('returns as a value the return value of that function', () => {
        const params = {
          page: 10,
          hitsPerPage (requestBody) {
            return requestBody.request.intent.slots.num.value;
          },
        };
        const body = {request: {intent: {slots: {num: {value: 12}}}}};
        const expected = {
          page: 10,
          hitsPerPage: 12,
        };

        expect(buildParams(params, body)).toEqual(expected);
      });
    });
  });
});
