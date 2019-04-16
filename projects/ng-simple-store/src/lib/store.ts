import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class Store<T> {
  private subject: BehaviorSubject<T>;

  constructor(initialData: any, options: StoreOptions<T>) {
    this.subject = new BehaviorSubject(initialData);
  }

  getValue(): T {
    return this.subject.getValue();
  }

  getObservable(): Observable<T> {
    return this.subject.asObservable();
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
