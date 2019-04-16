import { Injectable } from '@angular/core';

import { Store } from '../../../../ng-simple-store/src/lib/store';
import { StoreFactory } from './../../../../ng-simple-store/src/lib/store';
import { EventHistory } from './event-history.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventHistoryService {
  private store: Store<EventHistory[]>;

  eventHistories$: Observable<EventHistory[]>;

  constructor(private storeFactory: StoreFactory<EventHistory[]>) {
    this.store = storeFactory.build([], {
      immuatable: true,
      sharedSubscription: true
    });
    this.eventHistories$ = this.store.getObservable();
  }

  add(eventHistory: EventHistory): void {
    const currentEventHistories = this.getValue();
    currentEventHistories.push(eventHistory);
    this.store.set(currentEventHistories);
  }

  getValue(): EventHistory[] {
    return this.store.getValue();
  }
}
