/*!
 * pea-js 0.2.0
 * Pea is a middleware layer for web, inspired by the connect
 * Copyright 2017, ccbabi <kxxw28@gmail.com>
 * Released under the MIT license.
*/

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Pea = factory();
  }
}(this, function() {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrPro = Array.prototype;
var fnPro = Function.prototype;
var noop = function noop() {};
var errs = ['e', 'err', 'error'];
function fnHasError(fn) {
    var matchs = fnPro.toString.call(fn).match(/\((\w+)/);
    if (!matchs) return false;
    return errs.indexOf(matchs[1]) > -1;
}

var Pea = function () {
    function Pea(beans, done) {
        var _this = this;

        _classCallCheck(this, Pea);

        this.done = noop;
        this.stack = [];
        this.head = 0;
        this.tail = 0;
        if (beans && beans instanceof Array) {
            beans.forEach(function (bean) {
                return _this.use(bean);
            });
        } else if (typeof beans === 'function') {
            this.done = beans;
        }
        if (typeof done === 'function') {
            this.done = done;
        }
    }

    _createClass(Pea, [{
        key: 'use',
        value: function use(bean) {
            var fn = void 0;
            if (bean instanceof Pea) {
                var that = this;
                fn = function fn() {
                    var args = arrPro.slice.apply(arguments);
                    var next = args.pop();
                    var beanDone = bean.done;
                    args.unshift(function () {
                        var ret = void 0;
                        try {
                            ret = beanDone.apply(bean, arguments);
                        } catch (e) {
                            return void next(e);
                        }
                        if (ret !== false) {
                            next.apply(that, arguments);
                        }
                    });
                    bean.start.apply(bean, args);
                };
            } else {
                fn = bean;
            }
            this.stack.push(fn);
            this.tail = this.stack.length;
            return this;
        }
    }, {
        key: 'start',
        value: function start(done) {
            if (done) this.done = arrPro.shift.apply(arguments);
            this.head = 0;
            this.next.apply(this, arguments);
        }
    }, {
        key: 'setDone',
        value: function setDone(done) {
            if (typeof done === 'function') this.done = done;
        }
    }, {
        key: 'next',
        value: function next(err) {
            this.run.apply(this, arguments);
        }
    }, {
        key: 'run',
        value: function run() {
            var bean = void 0,
                err = void 0,
                first = void 0;
            var hasErr = false;
            var args = arrPro.slice.apply(arguments);
            if (this.head >= this.tail) return void this.done.apply(this, args);
            first = args[0];
            if (first instanceof Error) {
                hasErr = true;
            } else {
                while (args.length && first == undefined) {
                    args.shift();
                    first = args[0];
                }
            }
            bean = this.stack[this.head++];
            args.push(this.next.bind(this));
            if (hasErr && fnHasError(bean) || !hasErr && !fnHasError(bean)) {
                try {
                    bean.apply(this, args);
                    return;
                } catch (e) {
                    err = e;
                }
            }
            this.next(err);
        }
    }]);

    return Pea;
}();
return Pea;
}));
