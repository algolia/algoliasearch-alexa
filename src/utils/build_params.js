import {isObject, isFunction} from './is_of_type.js';

export default function buildParams (params, event) {
  if (params === undefined || params === null) {
    return {};
  }

  if (!isObject(params)) {
    throw new Error('params must be an object');
  }
  
  // Copy the params object, to avoid overriding the original keys/value pairs
  const builtParams = Object.assign({}, params);
  for (const prop in builtParams) {
    if (builtParams.hasOwnProperty(prop)) {
      if (isFunction(builtParams[prop])) {
        builtParams[prop] = builtParams[prop](event);
      }
    }
  }

  return builtParams;
}
