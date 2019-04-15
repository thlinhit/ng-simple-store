import { Injectable } from '@angular/core';

import { Store } from '../../../../ng-simple-store/src/lib/store';
import { StoreFactory } from './../../../../ng-simple-store/src/lib/store';
import { EventHistory } from './event-history.model';

@Injectable({
  providedIn: 'root'
})
export class EventHistoryService {
  private store: Store<EventHistory>;

  constructor(private storeFactory: StoreFactory<EventHistory>) {
    this.store = storeFactory.build(null);
  }

  loadEventHistories(): void {
      this.store.set(new EventHistory('hehe'));
  }

}
