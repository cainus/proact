var React = require('react/addons');
var util = React.addons.TestUtils;
var jsdom = require('jsdom');

process.env.ENV = 'test';
console.log("set process.env.ENV to ", process.env.ENV);

CONFIG = require('./config');

var dominate = function(){
  if (this instanceof dominate) {
  } else {
    return new dominate();
  }
};

dominate.prototype.fromHtml = function(html, cb){
  var dom = jsdom.jsdom;
  var that = this;
  jsdom.env(
    html,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      if (!errors){
        that.window = window;
        that.$ = window.$;
      }
      return cb(errors, window);
    }
  );
}

dominate.prototype.fromReact = function(reactObject, cb){
  var html = React.renderComponentToString(reactObject);
  this.fromHtml(html, cb);
};

dominate.prototype.getText = function(el){
  el = el || 'body';
  var $ = this.$;
  return $(el).find(":not(iframe)").addBack().contents()
          .filter(function() {
            return this.nodeType == 3;
          })
          .map(function(idx, el){
            return $(el).text();
          })
          .toArray();
};

exports.dominate = dominate;
