"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj, key) {
  var dup = Object.assign({}, obj);
  delete dup[key];
  return dup;
};