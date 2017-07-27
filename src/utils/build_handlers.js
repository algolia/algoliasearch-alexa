import {isFunction} from './is_of_type.js';
import buildParams from './build_params.js';

function hasAnswerWith(obj) {
  return obj && obj.answerWith !== undefined;
}

export default function buildHandlers (handlersObj, index) {
  Object.keys(handlersObj).map(key => {
    if (isFunction(handlersObj[key])) {
      return handlersObj[key];
    } else if (hasAnswerWith(handlersObj[key])) {
      const func = handlersObj[key].answerWith;
      const paramsObj = handlersObj[key].params;

      handlersObj[key] = function() {
        const args = {event: this.event};
        const params = buildParams(paramsObj, this.event);
        index
          .search(args.event.request.intent.slots.query.value, params)
          .then((results, err) => {
            Object.assign(args, {err, results});
            func.call(this, args);
          });
      };

      return handlersObj[key];
    } else {
      throw new Error('Intent handler must either be a function or an object ' +
      'with key of "answerWith" which is a function.');
    }
  });

  return handlersObj;
}
