'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = buildHandlers;
function isFunction(obj) {
  return typeof obj === 'function';
}

function hasAnswerWith(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.answerWith;
}

function buildHandlers(handlersObj, index) {
  var intentHandlers = handlersObj.intentHandlers; // Error when this doesn't exist

  Object.keys(intentHandlers).map(function (key) {
    if (isFunction(intentHandlers[key])) {
      return intentHandlers[key];
    } else if (hasAnswerWith(intentHandlers[key])) {
      var _ret = function () {
        var func = intentHandlers[key].answerWith;
        intentHandlers[key] = function (intent, session, response) {
          var args = { intent: intent, session: session, response: response };
          index.search(intent.slots.query.value).then(function (err, content) {
            Object.assign(args, { err: err, content: content });
            func(args);
          });
        };
        return {
          v: intentHandlers[key]
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else {
      throw new Error('Intent handler must either be a function or an object' + 'with key of "answerWith" which is a function.');
    }
  });

  return handlersObj;
}