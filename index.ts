const arrPro = Array.prototype
const fnPro = Function.prototype
const noop = function () {}
const errs = ['e', 'err', 'error']

function fnHasError(fn: Function) {
  const matchs = fnPro.toString.call(fn).match(/\((\w+)/)
  if (!matchs) return false
  return errs.indexOf(matchs[1]) > -1
}

class Pea {
  private done: Function = noop
  private stack: Function[] = []
  private head = 0
  private tail = 0

  constructor(beans?: Array<Function | Pea>, done?: Function) {
    if (beans && beans instanceof Array) {
      beans.forEach(bean => this.use(bean))
    } else if (typeof beans === 'function') {
      this.done = beans
    }

    if (typeof done === 'function') {
      this.done = done
    }
  }

  use(bean: Function | Pea): Pea {
    let fn: Function
    if (bean instanceof Pea) {
      var that = this
      fn = function () {
        const args = arrPro.slice.apply(arguments)
        const next = args.pop()
        const beanDone = bean.done

        args.unshift(function () {
          let ret
          try {
            ret = beanDone.apply(bean, arguments)
          } catch(e) {
            return void next(e)
          }
          if (ret !== false) {
            next.apply(that, arguments)
          }
        })
        bean.start.apply(bean, args)
      }
    } else {
      fn = bean
    }
    this.stack.push(fn)
    this.tail = this.stack.length
    return this
  }

  start(done?: Function): void {
    if (done) this.done = arrPro.shift.apply(arguments)
    this.head = 0
    this.next.apply(this, arguments)
  }

  setDone (done: Function): void {
    if (typeof done === 'function') this.done = done
  }

  private next(err): void {
    this.run.apply(this, arguments)
  }

  private run(): void {
    let bean, err, first
    let hasErr = false
    const args = arrPro.slice.apply(arguments)

    if (this.head >= this.tail) return void this.done.apply(this, args)

    first = args[0]

    if (first instanceof Error) {
      hasErr = true
    } else {
      while (args.length && first == undefined) {
        args.shift()
        first = args[0]
      }
    }

    bean = this.stack[this.head++]
    args.push(this.next.bind(this))

    if ((hasErr && fnHasError(bean)) || (!hasErr && !fnHasError(bean))) {
      try {
        bean.apply(this, args)
        return
      } catch (e) {
        err = e
      }
    }
    this.next(err)
  }
}
