export default function(obj, key) {
  const dup = Object.assign({}, obj);
  delete dup[key];
  return dup;
}
