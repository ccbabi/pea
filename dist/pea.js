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
var arrPro = Array.prototype;
var fnPro = Function.prototype;
var noop = function () { };
var errs = ['e', 'err', 'error'];
function fnHasError(fn) {
    var matchs = fnPro.toString.call(fn).match(/\((\w+)/);
    if (!matchs)
        return false;
    return errs.indexOf(matchs[1]) > -1;
}
var Pea = /** @class */ (function () {
    function Pea(beans, done) {
        var _this = this;
        this.done = noop;
        this.stack = [];
        this.head = 0;
        this.tail = 0;
        if (beans && beans instanceof Array) {
            beans.forEach(function (bean) { return _this.use(bean); });
        }
        else if (typeof beans === 'function') {
            this.done = beans;
        }
        if (typeof done === 'function') {
            this.done = done;
        }
    }
    Pea.prototype.use = function (bean) {
        var fn;
        if (bean instanceof Pea) {
            var that = this;
            fn = function () {
                var args = arrPro.slice.apply(arguments);
                var next = args.pop();
                var beanDone = bean.done;
                args.unshift(function () {
                    var args = arrPro.slice.apply(arguments);
                    if (beanDone.apply(arguments) !== false)
                        next.apply(that, args);
                });
                bean.start.apply(bean, args);
            };
        }
        else {
            fn = bean;
        }
        this.stack.push(fn);
        this.tail = this.stack.length;
        return this;
    };
    Pea.prototype.start = function (done) {
        if (!this.stack) {
            throw Error('');
        }
        if (done) {
            this.done = arrPro.shift.apply(arguments);
        }
        this.next.apply(this, arguments);
    };
    Pea.prototype.next = function (err) {
        this.run.apply(this, arguments);
    };
    Pea.prototype.run = function () {
        var bean, err, first;
        var hasErr = false;
        var args = arrPro.slice.apply(arguments);
        if (this.head >= this.tail) {
            this.done && this.done.apply(this, args);
            this.head = 0;
            return;
        }
        first = args[0];
        if (first instanceof Error) {
            hasErr = true;
        }
        else {
            while (args.length && first == undefined) {
                args.shift();
                first = args[0];
            }
        }
        bean = this.stack[this.head++];
        args.push(this.next.bind(this));
        if ((hasErr && fnHasError(bean)) || (!hasErr && !fnHasError(bean))) {
            try {
                bean.apply(this, args);
                return;
            }
            catch (e) {
                err = e;
            }
        }
        this.next(err);
    };
    return Pea;
}());

return Pea;
}));
