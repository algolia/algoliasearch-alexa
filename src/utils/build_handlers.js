import {isFunction, isArray, isObject} from './is_of_type.js';
import buildParams from './build_params.js';

function hasAnswerWith(obj) {
  return obj && obj.answerWith !== undefined;
}

function buildFromObject(obj, index, stateString) {
  const result = Object.keys(obj).reduce((object, key) => {
    if (key === 'state') {
      return object;
    }

    if (isFunction(obj[key])) {
      object[key] = obj[key];
      return object;
    } else if (hasAnswerWith(obj[key])) {
      const func = obj[key].answerWith;
      const paramsObj = obj[key].params;

      object[key] = function() {
        const args = {event: this.event};
        const params = buildParams(paramsObj, this.event);
        let query = '';
        if (args.event.request.intent.slots && args.event.request.intent.slots.query) {
          query = args.event.request.intent.slots.query.value;
        }

        index
          .search(query, params)
          .then((results, err) => {
            Object.assign(args, {err, results});
            func.call(this, args);
          });
      };

      return object;
    } else {
      throw new Error('Intent handler must either be a function or an object ' +
      'with key of "answerWith" which is a function.');
    }
  }, {});

  Object.defineProperty(result, stateString, {
    value: obj.state || '',
  });

  return [result];
}

function buildFromArray(arr, index, stateString) {
  return arr.map(obj => buildFromObject(obj, index, stateString)[0]);
}

export default function buildHandlers (handlers, index, stateString) {
  if (isArray(handlers)) {
    return buildFromArray(handlers, index, stateString);
  } else if (isObject(handlers)) {
    return buildFromObject(handlers, index, stateString);
  } else {
    throw new Error('Handlers must be either an array or an object.');
  }
}
