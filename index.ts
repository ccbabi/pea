const fnPro = Function.prototype
const errs = ['e', 'err', 'error']

function fnHasError(fn: Function): boolean {
  const matchs = fnPro.toString.call(fn).match(/\((\w+)/)
  if (!matchs) return false
  return errs.indexOf(matchs[1]) > -1
}

export default class Pea {
  private __stack: Function[] = []
  private __head = 0
  private __tail = 0

  constructor(beans?: Array<(...args: any[])=>void>)
  constructor(beans?: Array<Pea>)
  constructor(beans?: Array<((...args: any[])=>void)|Pea>) {
    if (beans && beans instanceof Array) beans.forEach(bean => this.use((bean as Pea)))
  }

  use(bean: (...args: any[]) => void): Pea
  use(bean: Pea): Pea
  use(bean: ((...args: any[]) => void)|Pea): Pea {
    let fn: Function
    if (bean instanceof Pea) {
      if ((bean as Pea) === this) return this
      fn = (...args: any[]) => {
        const pnext = args.pop()

        bean.use((...args) => {
          args.pop()
          pnext.apply(this, args)
        })
        bean.use((e) => void pnext(e))
        bean.start.apply(bean, args)
      }
    } else fn = bean
    this.__tail = this.__stack.push(fn)
    return this
  }

  start(...args: any[]): void {
    this.__head = 0
    this.__next.apply(this, args)
  }

  private __next(err?: Error, ...args: any[]): void {
    this.__run.apply(this, arguments)
  }

  private __run(...args: any[]): void {
    let bean, err
    let first = args[0]

    if (first instanceof Error) err = first

    if (this.__head >= this.__tail) {
      if (err) throw err
      return
    }

    if (first == undefined && args.length) args.shift()

    bean = this.__stack[this.__head++]
    if ((err && fnHasError(bean)) || (!err && !fnHasError(bean))) {
      args.push(this.__next.bind(this))
      try {
        return void bean.apply(this, args)
      } catch (e) {
        err = e
      }
    }
    this.__next(err)
  }
}
