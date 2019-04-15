import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export class Store<T> {
  private subject: BehaviorSubject<T>;

  constructor(initialData: any) {
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

@Injectable({
    providedIn: 'root'
})
export class StoreFactory<T> {
    build(initialData: T): Store<T> {
        return new Store<T>(initialData);
    }
}
