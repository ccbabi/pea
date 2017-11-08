/*!
 * pea-js 0.2.1
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
var errs = ['e', 'err', 'error'];
function fnHasError(fn) {
    var matchs = fnPro.toString.call(fn).match(/\((\w+)/);
    if (!matchs) return false;
    return errs.indexOf(matchs[1]) > -1;
}

var Pea = function () {
    function Pea(beans) {
        var _this = this;

        _classCallCheck(this, Pea);

        this.stack = [];
        this.head = 0;
        this.tail = 0;
        if (beans && beans instanceof Array) {
            beans.forEach(function (bean) {
                return _this.use(bean);
            });
        }
    }

    _createClass(Pea, [{
        key: 'use',
        value: function use(bean) {
            var fn = void 0;
            if (bean instanceof Pea) {
                fn = function () {
                    var pnext = arrPro.pop.apply(arguments);
                    bean.use(function () {
                        arrPro.pop.apply(arguments);
                        pnext.apply(this, arguments);
                    });
                    bean.use(function (e, next) {
                        if (e) pnext(e);
                    });
                    bean.start.apply(bean, arguments);
                }.bind(this);
            } else {
                fn = bean;
            }
            this.tail = this.stack.push(fn);
            return this;
        }
    }, {
        key: 'start',
        value: function start() {
            this.head = 0;
            this.next.apply(this, arguments);
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
                err = void 0;
            var args = arrPro.slice.apply(arguments);
            var first = args[0];
            if (first instanceof Error) err = first;
            if (this.head >= this.tail) {
                if (err) throw err;
                return;
            }
            while (!err && args.length && first == undefined) {
                args.shift();
                first = args[0];
            }
            bean = this.stack[this.head++];
            if (err && fnHasError(bean) || !err && !fnHasError(bean)) {
                args.push(this.next.bind(this));
                try {
                    return void bean.apply(this, args);
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
