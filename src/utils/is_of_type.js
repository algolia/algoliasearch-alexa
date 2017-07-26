function isOfType(signature) {
  return function(param) {
    return Object.prototype.toString.call(param) === signature;
  };
}

const isObject = isOfType('[object Object]');
const isFunction = isOfType('[object Function]');

export {isOfType, isObject, isFunction};
