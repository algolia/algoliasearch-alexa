function isFunction(obj) {
  return typeof obj === 'function';
}

function hasAnswerWith(obj) {
  return typeof obj === 'object' && obj.answerWith;
}

export default function buildHandlers (handlersObj, index) {
  const intentHandlers = handlersObj.intentHandlers; // Error when this doesn't exist

  Object.keys(intentHandlers).map(key => {
    if (isFunction(intentHandlers[key])) {
      return intentHandlers[key];
    } else if (hasAnswerWith(intentHandlers[key])) {
      const func = intentHandlers[key].answerWith;
      intentHandlers[key] = function(intent, session, response) {
        const args = {intent, session, response};
        index
          .search(intent.slots.query.value)
          .then((err, content) => {
            Object.assign(args, {err, content});
            func(args);
          });
      };
      return intentHandlers[key];
    } else {
      throw new Error('Intent handler must either be a function or an object' +
      'with key of "answerWith" which is a function.');
    }
  });

  return handlersObj;
}
