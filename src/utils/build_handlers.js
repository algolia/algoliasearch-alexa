function isFunction(obj) {
  return typeof obj === 'function';
}

function hasAnswerWith(obj) {
  return typeof obj === 'object' && obj.answerWith;
}

export default function buildHandlers (handlersObj, index) {
  Object.keys(handlersObj).map(key => {
    if (isFunction(handlersObj[key])) {
      return handlersObj[key];
    } else if (hasAnswerWith(handlersObj[key])) {
      const func = handlersObj[key].answerWith;
      handlersObj[key] = function() {
        const args = {event: this.event};
        index
          .search(args.event.request.intent.slots.query.value)
          .then((results, err) => {
            Object.assign(args, {err, results});
            func.call(this, args);
          });
      };
      return handlersObj[key];
    } else {
      throw new Error('Intent handler must either be a function or an object' +
      'with key of "answerWith" which is a function.');
    }
  });

  return handlersObj;
}
