import { Store } from './store';
import { getEntityType, isNil, notEmpty } from './helper';
import { API_STATUS } from './api-status';

export interface ApiStatuses {
    [id: string]: API_STATUS;
}

export interface EntityState<EntityType = any> {
    entities?: { [id: string]: EntityType };
    ids?: string[];
    apiStatuses?: ApiStatuses;
}

const getInitialEntitiesState = (): EntityState =>
    ({
        entities: {},
        ids: [],
        apiStatuses: {},
    } as EntityState);

export interface UpdateEntity<T> {
    id: string;
    changes: Partial<T>;
}

export class EntityStore<S extends EntityState, EntityType = getEntityType<S>> extends Store<S> {
    constructor(private _getId: (entity: EntityType) => string, protected initialState: Partial<S> = {}) {
        super({ ...getInitialEntitiesState(), ...initialState });
    }

    add(entity: EntityType, newState: Partial<S> = {}): void {
        this.addMany(isNil(entity) ? [] : [entity], newState);
    }

    addMany(entities: EntityType[], newState: Partial<S> = {}): void {
        entities = isNil(entities) ? [] : entities;

        const newEntities: { [id: string]: EntityType } = {};
        const newIds: string[] = [];

        for (const entity of entities) {
            const newId = this._getId(entity);
            if (!this.hasEntity(newId)) {
                newEntities[newId] = entity;
                newIds.push(newId);
            }
        }

        newState.entities = newEntities;
        newState.ids = newIds;
        this._set(this._mergeState(newState));
    }

    /**
     * @description:
     * update({ loading: true });
     * update(1, {id: 2});
     * update(1, { id: 2 }, { loading: true })
     */
    update(newState: Partial<S>): void;
    update(id: string, changes: Partial<EntityType>, newState?: Partial<S>): void;
    update(idOrNewState: string | Partial<S>, changes?: Partial<EntityType>, newState?: Partial<S>): void {
        if (typeof idOrNewState === 'string') {
            const updateEntity: UpdateEntity<EntityType> = { id: idOrNewState, changes };
            this.updateMany([updateEntity], newState || {});
            return;
        }

        this._set(this._mergeState(idOrNewState));
    }

    updateMany(updates: UpdateEntity<EntityType>[], newState: Partial<S> = {}): void {
        const updatedEntities: { [id: string]: EntityType } = {};
        const currentState = this._getState();

        if (notEmpty(updates)) {
            for (const update of updates) {
                if (isNil(update)) {
                    continue;
                }

                const id = update.id;
                const newData: Partial<EntityType> = update.changes;

                if (isNil(id) || isNil(newData)) {
                    continue;
                }

                if (this.hasEntity(id)) {
                    const oldEntity: EntityType = currentState.entities[id];
                    updatedEntities[id] = Object.assign({}, oldEntity, newData);
                }
            }
        }

        if (notEmpty(updatedEntities) || notEmpty(newState)) {
            newState.entities = updatedEntities;
            this._set(this._mergeState(newState));
        }
    }

    hasEntity(entityId: string): boolean {
        const currentEntities = this._getState().entities;
        return currentEntities.hasOwnProperty(entityId);
    }

    hasProceeded(id: string): boolean {
        return (this._getState().apiStatuses || {}).hasOwnProperty(id);
    }

    private _mergeState(newState: Partial<S> | S): S {
        const currentState = this._getState();

        return {
            ...currentState,
            ...newState,
            entities: {
                ...currentState.entities,
                ...(newState.entities || []),
            },
            ids: [...currentState.ids, ...(newState.ids || [])],
            apiStatuses: {
                ...currentState.apiStatuses,
                ...(newState.apiStatuses || {}),
            },
        };
    }
}
