
/*
  Escapes a string intended to be used as a regular expression.
*/
RegExp.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
