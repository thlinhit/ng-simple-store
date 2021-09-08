import { EntityState, EntityStore } from './entity.store';
import { API_STATUS } from './api-status.constant';

describe('EntityStore', () => {
    class ExampleEntity {
        constructor(public id: string, public content?: string, public content2?: number) {}
    }

    interface ExampleEntityState extends EntityState<ExampleEntity> {}

    const initialState: ExampleEntityState = {
        apiStatuses: null,
    };

    class ExampleStore extends EntityStore<ExampleEntityState> {
        constructor() {
            super((entity: ExampleEntity) => entity.id, initialState);
        }
    }

    let store: ExampleStore;

    beforeEach(() => {
        store = new ExampleStore();
    });

    describe('add()', () => {
        it('should add one entity to Store', () => {
            // Given
            const entity = new ExampleEntity('1');

            // When
            store.add(entity, {
                apiStatuses: {
                    [entity.id]: API_STATUS.SUCCESS,
                },
            });

            // Then
            expect(store._getState().apiStatuses).toEqual({ ['1']: API_STATUS.SUCCESS });
            expect(store._getState().entities['1']).toEqual(entity);
            expect(store._getState().ids).toEqual(['1']);
        });

        it('should not add if entity is already existed', () => {
            // Given
            const entity = new ExampleEntity('1');

            // When
            store.add(entity, {
                [entity.id]: API_STATUS.SUCCESS,
            });

            store.add(
                { ...entity, content: 'content' },
                {
                    [entity.id]: API_STATUS.SUCCESS,
                }
            );

            // Then
            expect(store._getState().entities['1'].content).toBeUndefined();
        });
    });

    describe('addMany()', () => {
        it('should add entities to Store', () => {
            // Given
            const entity1 = new ExampleEntity('1');
            const entity2 = new ExampleEntity('2');

            // When
            store.addMany([entity1, entity2], {
                apiStatuses: {
                    [entity1.id]: API_STATUS.SUCCESS,
                    [entity2.id]: API_STATUS.SUCCESS,
                },
            });

            // Then
            expect(store._getState().apiStatuses).toEqual({
                ['1']: API_STATUS.SUCCESS,
                ['2']: API_STATUS.SUCCESS,
            });
            expect(Object.keys(store._getState().entities).length).toBe(2);
            expect(store._getState().entities['1']).toEqual(entity1);
            expect(store._getState().entities['2']).toEqual(entity2);
            expect(store._getState().ids).toEqual(['1', '2']);
        });

        it('should not add if entities are already existed', () => {
            // Given
            const entity1 = new ExampleEntity('1');
            const entity2 = new ExampleEntity('2');

            // When
            store.addMany([entity1, entity2], {
                apiStatuses: {
                    [entity1.id]: API_STATUS.SUCCESS,
                    [entity2.id]: API_STATUS.SUCCESS,
                },
            });

            store.addMany(
                [
                    { ...entity1, content: 'content' },
                    { ...entity2, content: 'content' },
                ],
                {
                    apiStatuses: {
                        [entity1.id]: API_STATUS.SUCCESS,
                        [entity2.id]: API_STATUS.SUCCESS,
                    },
                }
            );

            // Then
            expect(store._getState().entities['1'].content).toBeUndefined();
            expect(store._getState().entities['2'].content).toBeUndefined();
        });
    });

    describe('update', () => {
        it('should update state', () => {
            // Given
            const entity = new ExampleEntity('1');
            store.add(entity, {
                apiStatuses: {
                    [entity.id]: API_STATUS.SUCCESS,
                },
            });

            // When
            store.update({
                apiStatuses: {
                    [entity.id]: API_STATUS.LOADING,
                },
            });

            // Then
            expect(store._getState().apiStatuses).toEqual({ ['1']: API_STATUS.LOADING });
        });

        it('should update entity', () => {
            // Given
            const entity = new ExampleEntity('1');
            store.add(entity, {
                apiStatuses: {
                    [entity.id]: API_STATUS.SUCCESS,
                },
            });

            // When
            store.update('1', { content: 'content' });

            // Then
            expect(store._getState().entities['1'].content).toBe('content');
        });

        it('should update state and entity', () => {
            // Given
            const entity = new ExampleEntity('1');
            store.add(entity, {
                apiStatuses: {
                    [entity.id]: API_STATUS.SUCCESS,
                },
            });

            // When
            store.update(
                '1',
                { content: 'content' },
                {
                    apiStatuses: {
                        [entity.id]: API_STATUS.LOADING,
                    },
                }
            );

            // Then
            expect(store._getState().entities['1'].content).toBe('content');
            expect(store._getState().apiStatuses).toEqual({ [entity.id]: API_STATUS.LOADING });
        });

        it('should do nothing if entity does not exist', () => {
            // When
            store.update('1', { content: 'content' });

            // Then
            expect(store._getState().entities['1']).toBeUndefined();
        });
    });

    describe('updateMany()', () => {
        it('should update many entities and state', () => {
            // Given
            const entity1 = new ExampleEntity('1');
            const entity2 = new ExampleEntity('2');
            store.addMany([entity1, entity2], {
                apiStatuses: {
                    [entity1.id]: API_STATUS.LOADING,
                    [entity2.id]: API_STATUS.LOADING,
                },
            });

            // When
            store.updateMany(
                [
                    { id: '1', changes: { content: 'content1' } },
                    { id: '2', changes: { content: 'content2' } },
                ],
                {
                    apiStatuses: {
                        [entity1.id]: API_STATUS.SUCCESS,
                        [entity2.id]: API_STATUS.SUCCESS,
                    },
                }
            );

            // Then
            expect(store._getState().entities['1'].content).toBe('content1');
            expect(store._getState().entities['2'].content).toBe('content2');
            expect(store._getState().apiStatuses).toEqual({
                ['1']: API_STATUS.SUCCESS,
                ['2']: API_STATUS.SUCCESS,
            });
        });

        it('should do nothing if entity does not exist', () => {
            // When
            store.updateMany([{ id: '1', changes: { content: 'content1' } }]);

            // Then
            expect(store._getState().entities['1']).toBeUndefined();
        });
    });

    describe('hasEntity()', () => {
        it('should return true if having entity', () => {
            // Given
            const entity = new ExampleEntity('1');
            store.add(entity);

            // When
            const hasEntity = store.hasEntity('1');

            // Then
            expect(hasEntity).toBeTruthy();
        });

        it('should return false if not having entity', () => {
            // When
            const hasEntity = store.hasEntity('1');

            // Then
            expect(hasEntity).toBeFalsy();
        });
    });

    describe('hasProceeded()', () => {
        it('should return true if already receiving id', () => {
            // Given
            store.update({
                apiStatuses: {
                    ['1']: API_STATUS.LOADING,
                },
            });

            // When
            const hasEntity = store.hasProceeded('1');

            // Then
            expect(hasEntity).toBeTruthy();
        });

        it('should return false if not receiving yet', () => {
            // When
            const hasEntity = store.hasProceeded('1');

            // Then
            expect(hasEntity).toBeFalsy();
        });
    });
});
