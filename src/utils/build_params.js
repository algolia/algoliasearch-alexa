import {isObject, isFunction} from './is_of_type.js';

export default function buildParams (params, event) {
  if (params === undefined || params === null) {
    return {};
  }

  if (!isObject(params)) {
    throw new Error('params must be an object');
  }

  for (const prop in params) {
    if (params.hasOwnProperty(prop)) {
      if (isFunction(prop)) {
        params[prop] = params[prop](event);
      }
    }
  }

  return params;
}
