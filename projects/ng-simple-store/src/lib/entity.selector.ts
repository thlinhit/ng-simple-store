import { Store } from './store';
import { EntityState } from './entity.store';
import { getEntityType, isEmpty, isNil, compact } from './helper';
import { combineLatest, Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { API_STATUS } from './api-status';

export abstract class EntitySelector<S extends EntityState, EntityType = getEntityType<S>> {
    protected constructor(protected store: Store<S>) {}

    selectAll$(): Observable<EntityType[]> {
        return combineLatest([this.selectIds$(), this.selectEntities$()]).pipe(
            map(([ids, entities]) => {
                return ids.length === 0 || isEmpty(entities) ? [] : ids.map((id) => entities[id]);
            }),
            publishReplay(1),
            refCount()
        );
    }

    selectOne$(id: string): Observable<EntityType> {
        return this.selectEntities$().pipe(
            map((entities) => {
                return (id && entities[id]) ?? null;
            })
        );
    }

    selectMany$(ids: string[]): Observable<EntityType[]> {
        return this.selectEntities$().pipe(
            map((entities) => {
                if (isNil(ids)) {
                    return [];
                }

                const result = [];
                if (ids.length === 0) {
                    return result;
                }
                return compact(ids.map((id) => (id ? entities[id] : null)));
            })
        );
    }

    selectEntities$(): Observable<{ [id: string]: EntityType }> {
        return this.store.select((state) => state.entities);
    }

    selectIds$(): Observable<string[]> {
        return this.store.select((state) => state.ids);
    }

    isLoading$(id: string): Observable<boolean> {
        return this.store.select((state) => state.apiStatuses[id] === API_STATUS.LOADING);
    }

    atLeastOneLoading$(ids: string[]): Observable<boolean> {
        return combineLatest(ids.map((id) => this.isLoading$(id))).pipe(
            map((results: boolean[]) => {
                for (const result of results) {
                    if (result === true) {
                        return true;
                    }
                }
                return false;
            })
        );
    }

    isLoaded$(id: string): Observable<boolean> {
        return this.store.select((state) => {
            return [API_STATUS.SUCCESS, API_STATUS.FAIL].includes(state.apiStatuses[id]);
        });
    }
}
