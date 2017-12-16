var f = x => x * 10
f(100) //=> 1000

var f = x => console.log(x * 10)
f(100) //=> 1000

(x => console.log(x * 10))(10) //=> 100

(10)(x => console.log(x*10)) // Error

(o => o(10))(x => console.log(x*10)) //=> 100

(o => {o(10); setTimeout(() => o(1)); o(100)})(x => console.log(x*10)) //=> 100

(o => o(10)).call(null, x => console.log(x))

class Observable {
  constructor(sub = () => {}){
    this.sub = sub
  }

  static interval(time) {
    return new Observable(o => {
      var i = 0;
      var disposable = setInterval(() => o(++i), time)
      return () => {
        clearInterval(disposable)
      }
    })
  }

  subscribe(o) {
    return this.sub(o)
  }
}

new Observable(o => o(10)).subscribe(x => console.log(x))

Object.assign(Observable.prototype, {
  map(f) {
    return new Observable(o => {
      this.subscribe(x => o(f(x)))
    })
  },
  filter(f) {
    return new Observable(o => {
      this.subscribe(x => f(x) && o(x))
    })
  }
})

new Observable(o => o(10)).map(x => x * 10).subscribe(x => console.log(x))

var disposable =  Observable.interval(1000).subscribe(x => console.log(x))

setTimeout(() => {
  disposable()
}, 3000);

new Observable(o => o(10)).filter(x => x % 2 === 0).subscribe(x => console.log(x))

// Generator: () => (() => T)
// Observable: (T => ()) => ()