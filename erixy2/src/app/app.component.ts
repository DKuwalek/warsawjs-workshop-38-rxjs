import { Component } from '@angular/core';
import { of, interval, fromEvent, merge, BehaviorSubject, throwError, from } from 'rxjs';
import { map, filter, throttleTime, take, takeUntil, takeWhile, catchError, delay, concatAll } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { parse, stringify } from "query-string";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  contacts = [
    { name: 'Joe', phone: 1234234 },
    { name: 'Mike', phone: 81234234 },
    { name: 'Bob', phone: 41234234 },
    { name: 'Jack', phone: 34234 },
    { name: 'Carlos', phone: 234234 }
  ];

  images = [
    'https://api.debugger.pl/assets/tomato.jpg',
    'https://api.debugger.pl/assets/pumpkin.jpg',
    'https://api.debugger.pl/assets/potatoes.jpg'
  ];

  observableAndObserver() {
    of('hello') // to jest obiekt Observable! Pierwsza częśc kodu
      .subscribe( //do tej funkcji, która jest Observer mozemy przekazac 3 parametry: next, error i complete
        console.log, //next
        console.error, //error
        () => { console.log('complete'); } //complete
      );
  }
  observables() {
    interval(1000) //Observable
      .pipe( //middleware czyli etap przejsciowy
        // map((value)=>{ //otwarcie nawiasu z wasem wymaga na pisania slowa return
        //   // debugger; // BAAARDZO UZYTECZNE DO DEBUGOWANIA
        //   return value * 2;

        // })
        map((value) => value * 2), //Transformation operator
        filter((value) => value % 2 === 0) //Filtering operator
      ) //Pipe!
    // .subscribe( //Observer
    //   console.log,
    //   null,
    //   ()=>{console.log("complete")}
    // );

    //zapisujemy do zmiennej a dolar w nazwie to konwencja
    const mouseEv$ = fromEvent(document, 'mousemove')
      .pipe(map(
        ({ clientX, clientY }: MouseEvent) => ({ clientX, clientY }) // w lambdzie uzywamy destructurize zeby wybrac z obiektu tylko clientX i clientY
      ),
        throttleTime(100)) // co 100 milisekund zdarzenie przechodzi dalej
      .subscribe(console.log);
  }
  subjects() {
    const filters = new BehaviorSubject({
      currentPage: 1,
      itemsPerPage: 5
    });
    filters.subscribe(
      (val) => {
        const params = stringify(val);
        // debugger;
        ajax(`https://api.debugger.pl/items?${params}`)
          .pipe(
            map(({ response }) => response),

            catchError((err) => {
              // debugger;
              console.log(err);
              return throwError(err);
            })

          ).subscribe(console.log)
      }
    );

    // filters.next({currentPage: 1, itemsPerPage: 10}); // metoda next jest dedykowana dla Subject! Na observable nie ma opcji zrobienia next
    //next nadpisuje zupełnie dane
    //obj2 = {...obj}

    fromEvent(document, 'click')
      .subscribe(() => {
        filters.next({ ...filters.value, itemsPerPage: Math.ceil(Math.random() * 10) })
      })
  }
  operatorsFiltering() {
    interval(1000)
      .pipe(
        take(25),
        takeWhile((val) => val < 5), // wykonuj dopuki numer interwalu jest mniejszy od liczby
        takeUntil(fromEvent(document, 'click'))
      )
      .subscribe(console.log, null, () => { console.log('complete') });
  }
  operatorsTransformation() {
    throw new Error("Method not implemented.");
  }
  operatorsCombination() {
    //zapisujemy do zmiennej a dolar w nazwie to konwencja
    const mouseEv$ = fromEvent(document, 'mousemove')
      .pipe(map(
        ({ clientX, clientY }: MouseEvent) => ({ clientX, clientY }) // w lambdzie uzywamy destructurize zeby wybrac z obiektu tylko clientX i clientY
      ),
        throttleTime(100)
      ); // co 100 milisekund zdarzenie przechodzi dalej
    const mouseClick$ = fromEvent(document, 'click')
      .pipe(
        map(({ type }: MouseEvent) => ({ type }))
      );
    // .subscribe(console.log);
    //Combination operators
    merge(
      mouseEv$,
      mouseClick$
    )
      .subscribe(console.log);
  }
  hotvscold() {
    throw new Error("Method not implemented.");
  }
  higherOrder() {
    const urls = [
      'https://api.debugger.pl/big-deal/10000',
      'https://api.debugger.pl/big-deal/1000000',
      'https://api.debugger.pl/big-deal/1'
    ];
    from(urls)
    .pipe(
      map((url)=>(ajax(url))),
      concatAll(),
      // tap(console.log)
      // mergeAll()
      map(({response})=>response)
    )
    .subscribe(console.log);
    // from(this.contacts)
    // .pipe(
    //   map((val)=>of(val).pipe(delay(1000))),
    //   concatAll() // Higher order
    // )
    // .subscribe(console.log);
  }
  customOperator() {
    throw new Error("Method not implemented.");
  }

  title = 'erixy2';

  constructor() {
    //     this.observableAndObserver();
    // this.observables();
    // this.subjects();
    // this.operatorsFiltering();
    //     this.operatorsTransformation();
    // this.operatorsCombination();
    //     this.hotvscold();
    this.higherOrder()
    //     this.customOperator();    
  }
}


