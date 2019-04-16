import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

export class Store<T> {
  private subject: BehaviorSubject<T>;
  private observable$: Observable<T>;

  constructor(initialData: any, options: StoreOptions<T>) {
    this.subject = new BehaviorSubject(initialData);

    this.observable$ = this.subject.asObservable().pipe(
      // TODO need to clone data, check if changing data of a subscription can affact others'
      options.sharedSubscription ? shareReplay(1) : map((data: T) => data)
    );
  }

  getValue(): T {
    return this.subject.getValue();
  }

  getObservable(): Observable<T> {
    return this.observable$;
  }

  set(data: T) {
    this.subject.next(data);
  }
}

export interface StoreOptions<T> {
  immuatable: boolean;
  sharedSubscription: boolean;
  getIdentifier?: (model: T) => string | number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreFactory<T> {
  private defaultOptions: StoreOptions<T> = {
    immuatable: true,
    sharedSubscription: false
  };

  build(initialData: T, options = this.defaultOptions): Store<T> {
    return new Store<T>(initialData, options);
  }
}
