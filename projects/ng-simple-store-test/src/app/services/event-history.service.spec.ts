import { StoreFactory } from 'projects/ng-simple-store/src/lib/store';
import { EventHistory, EventHistoryBuilder } from './event-history.model';
import { EventHistoryService } from './event-history.service';

describe('EventHistoryService', () => {
    let storeFactory: StoreFactory<EventHistory[]>;
    let service: EventHistoryService;

    beforeEach(() => {
        storeFactory = new StoreFactory<EventHistory[]>();
        service = new EventHistoryService(storeFactory);
    });

    describe('add()', () => {
        fit('should add successfully', () => {
            const eventHistory = EventHistoryBuilder.build();
            service.add(eventHistory);
            expect([eventHistory]).toEqual(service.getValue());
            service.eventHistories$.subscribe((data) => {
                expect([eventHistory]).toEqual(data);
            });
        });
    });
});
