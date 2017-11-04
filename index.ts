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
  private done = noop
  private stack: Function[] = []
  private head = 0
  private tail = 0
  private one = false

  constructor(beans: Array<Function | Pea> = []) {
    beans.forEach(bean => this.use(bean))
  }

  use(bean: Function | Pea): Pea {
    let fn: Function
    if (bean instanceof Pea) {
      fn = function () {
        const args = arrPro.slice.apply(arguments)
        args.unshift(args.pop())
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
    if (!this.stack) {
      throw Error('')
    }
    if (done) {
      this.done = arrPro.shift.apply(arguments)
    }
    this.next.apply(this, arguments)
  }

  oneStart (): void {
    this.one = true
    this.start.apply(this, arguments)
  }

  destroy (): void {
    this.head = 0
    this.tail = 0
    this.stack.length = 0
  }

  private next(err): void {
    this.run.apply(this, arguments)
  }

  private run(): void {
    let bean, err, first
    let hasErr = false
    const args = arrPro.slice.apply(arguments)

    if (this.head >= this.tail) {
      this.done && this.done.apply(this, args)
      this.head = 0
      if (this.one) {
        this.destroy()
      }
      return
    }

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
