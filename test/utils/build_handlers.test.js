/* global
  it, expect, describe, jest, beforeEach
*/

import buildHandlers from '../../src/utils/build_handlers.js';
import {isArray, isObject} from '../../src/utils/is_of_type.js';
import {StateString} from 'alexa-sdk';

describe('handlers', () => {
  const searchSpy = jest.fn(() => Promise.resolve());
  const index = {
    search: searchSpy,
  };

  const handlers = {
    state: 'START_STATE',
    LaunchRequest () {},
    spyIntent: {
      answerWith () {},
    },
    withParamsIntent: {
      answerWith () {},
      params: {
        page: 10,
      },
    },
    withParamsWithFunctionIntent: {
      answerWith () {},
      params: {
        page (requestBody) {
          return requestBody.request.intent.slots.page.value;
        },
      },
    },
    unChangedIntent () {},
  };
  const builtHandlers = buildHandlers(handlers, index, StateString);
  const expectedQuery = 'query';
  const scope = {
    event: {
      request: {
        intent: {
          slots: {
            query: {
              value: expectedQuery,
            },
            page: {
              value: 5,
            },
          },
        },
      },
    },
  };

  beforeEach(() => {
    searchSpy.mockClear();
  });

  describe('when intent handler is specified', () => {
    describe('in a single object', () => {
      it('returns an array', () => {
        expect(isArray(builtHandlers)).toBe(true);
      });
    });

    describe('in an array of objects', () => {
      const multipleHandlers = buildHandlers([handlers, handlers], index, StateString);

      it('returns an array', () => {
        expect(isArray(multipleHandlers)).toBe(true);
      });

      it('returns an array of objects', () => {
        const allObjects = multipleHandlers.every(handler => isObject(handler));
        expect(allObjects).toBe(true);
      });
    });

    describe('is an object', () => {
      it('has a state', () => {
        expect(builtHandlers[0][StateString]).toEqual(handlers.state);
      });

      describe('with answerWith', () => {
        describe('without params to merge', () => {
          const expectedParams = {};

          describe('without a query slot', () => {
            const withoutQuery = JSON.parse(JSON.stringify(scope));
            delete withoutQuery.event.request.intent.slots.query;

            builtHandlers[0].spyIntent.call(withoutQuery);

            expect(searchSpy).toHaveBeenCalledWith('', expectedParams);
          });

          describe('when handler is invoked', () => {
            it('searches Algolia', () => {
              builtHandlers[0].spyIntent.call(scope);

              expect(searchSpy).toHaveBeenCalledWith(expectedQuery, expectedParams);
            });
          });
        });

        describe('with params to merge', () => {
          describe('when handler is invoked', () => {
            it('searches Algolia with params', () => {
              const expectedParams = {page: 10};

              builtHandlers[0].withParamsIntent.call(scope);

              expect(searchSpy).toHaveBeenCalledWith(expectedQuery, expectedParams);
            });
          });

          describe('with params with function', () => {
            const expectedParams = {page: 5};

            builtHandlers[0].withParamsWithFunctionIntent.call(scope);

            expect(searchSpy).toHaveBeenCalledWith(expectedQuery, expectedParams);
          });
        });
      });

      describe('without answerWith', () => {
        it('throws an error', () => {
          const newHandlers = {withoutAnswerWithIntent: {}};
          Object.assign(newHandlers, handlers);

          expect(() => {
            buildHandlers(newHandlers, index);
          }).toThrow();
        });
      });
    });

    describe('is a function', () => {
      it('does not search Algolia', () => {
        buildHandlers(handlers, index)[0].unChangedIntent();
        expect(searchSpy).not.toHaveBeenCalled();
      });
    });
  });
});
