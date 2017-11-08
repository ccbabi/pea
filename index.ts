const arrPro = Array.prototype
const fnPro = Function.prototype
const errs = ['e', 'err', 'error']

function fnHasError(fn: Function) {
  const matchs = fnPro.toString.call(fn).match(/\((\w+)/)
  if (!matchs) return false
  return errs.indexOf(matchs[1]) > -1
}

class Pea {
  private stack: Function[] = []
  private head = 0
  private tail = 0

  constructor(beans?: Array<Function | Pea>) {
    if (beans && beans instanceof Array) {
      beans.forEach(bean => this.use(bean))
    }
  }

  use(bean: Function | Pea): Pea {
    let fn: Function
    if (bean instanceof Pea) {
      fn = function () {
        const pnext = arrPro.pop.apply(arguments)

        bean.use(function () {
          arrPro.pop.apply(arguments)
          pnext.apply(this, arguments)
        })

        bean.use(function (e, next) {
          if (e) pnext(e)
        })

        bean.start.apply(bean, arguments)
      }.bind(this)
    } else {
      fn = bean
    }
    this.tail = this.stack.push(fn)
    return this
  }

  start(): void {
    this.head = 0
    this.next.apply(this, arguments)
  }

  private next(err?: Error): void {
    this.run.apply(this, arguments)
  }

  private run(): void {
    let bean, err
    const args = arrPro.slice.apply(arguments)
    let first = args[0]

    if (first instanceof Error) err = first
    if (this.head >= this.tail) {
      if (err) throw err
      return
    }

    while (!err && args.length && first == undefined) {
      args.shift()
      first = args[0]
    }

    bean = this.stack[this.head++]

    if ((err && fnHasError(bean)) || (!err && !fnHasError(bean))) {
      args.push(this.next.bind(this))
      try {
        return void bean.apply(this, args)
      } catch (e) {
        err = e
      }
    }
    this.next(err)
  }
}
