import {isFunction, isArray, isObject} from './is_of_type.js';
import buildParams from './build_params.js';

function hasAnswerWith(obj) {
  return obj && obj.answerWith !== undefined;
}

function buildFromObject(obj, index, STATE_STRING) {
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
        index
          .search(args.event.request.intent.slots.query.value, params)
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

  delete result.STATE_STRING;

  Object.defineProperty(result, STATE_STRING, {
    value: obj.state || '',
  });

  return [result];
}

function buildFromArray(arr, index, STATE_STRING) {
  return arr.map(obj => buildFromObject(obj, index, STATE_STRING)[0]);
}

export default function buildHandlers (handlers, index, STATE_STRING) {
  let result;

  if (isArray(handlers)) {
    result = buildFromArray(handlers, index, STATE_STRING);
  } else if (isObject(handlers)) {
    result = buildFromObject(handlers, index, STATE_STRING);
  } else {
    throw new Error('Handlers must be either an array or an object.');
  }

  return result;
}
