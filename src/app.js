import Rx from 'rxjs'
const Observable = Rx.Observable;


// App logic
const startButton = document.querySelector('#start');
const halfButton = document.querySelector('#half');
const quarterButton = document.querySelector('#quarter');

const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

const input = document.querySelector('#input');

const start$ = Observable.fromEvent(startButton, 'click');
const half$ = Observable.fromEvent(halfButton, 'click');
const quarter$ = Observable.fromEvent(quarterButton, 'click');

const stop$ = Observable.fromEvent(stopButton, 'click');
const reset$ = Observable.fromEvent(resetButton, 'click');

const input$ = Observable.fromEvent(input, 'input')
    .map(event => event.target.value);


const data = {count:0};
const inc = (acc)=> ({count: acc.count + 1});
const reset = (acc)=> data;

const starters$ = Observable.merge(
    start$.mapTo(1000),
    half$.mapTo(500),
    quarter$.mapTo(250)
);

const intervalActions = (time)=> Observable.merge(
    Observable.interval(time)
        .takeUntil(stop$).mapTo(inc),
    reset$.mapTo(reset)
);

const timer$ = starters$
    .switchMap(intervalActions)
    .startWith(data)
    .scan((acc, curr)=> curr(acc))


Observable.combineLatest(
    timer$,
    input$,
    (timer, input)=> ({count: timer.count, text: input})
)
    .do((x) => console.log(x))
    .takeWhile((data) => data.count <= 3)
    .filter(data => data.count === parseInt(data.text))
    .reduce((acc, curr) => acc + 1, 0)
    .subscribe(
        (x)=> console.log(x),
        err=> console.log(err),
        ()=> console.log('complete')
    );