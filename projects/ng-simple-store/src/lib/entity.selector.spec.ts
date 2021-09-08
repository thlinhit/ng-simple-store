import { EntityState, EntityStore } from './entity.store';
import { EntitySelector } from './entity.selector';
import { API_STATUS } from './api-status';

describe('EntitySelector', () => {
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

    class ExampleSelector extends EntitySelector<ExampleEntityState> {
        constructor(protected store: ExampleStore) {
            super(store);
        }
    }

    let selector: ExampleSelector;

    let successEntity1;
    let successEntity2;
    let loadingEntity;
    let failedEntity;

    beforeEach(() => {
        successEntity1 = new ExampleEntity('1');
        successEntity2 = new ExampleEntity('2');
        loadingEntity = new ExampleEntity('3');
        failedEntity = new ExampleEntity('4');
        const store = new ExampleStore();

        store.addMany([successEntity1, successEntity2], {
            apiStatuses: {
                [successEntity1.id]: API_STATUS.SUCCESS,
                [successEntity2.id]: API_STATUS.SUCCESS,
            },
        });

        store.update({
            apiStatuses: {
                [loadingEntity.id]: API_STATUS.LOADING,
                [failedEntity.id]: API_STATUS.FAIL,
            },
        });

        selector = new ExampleSelector(store);
    });

    describe('selectAll$()', () => {
        it('return an array of all entities', (done) => {
            selector.selectAll$().subscribe((result) => {
                expect(result.length).toBe(2);
                expect(result[0].id).toBe('1');
                expect(result[1].id).toBe('2');
                done();
            });
        });
    });

    describe('selectEntities$()', () => {
        it('return attribute entities in state', (done) => {
            selector.selectEntities$().subscribe((result) => {
                expect(result).toEqual({
                    ['1']: successEntity1,
                    ['2']: successEntity2,
                });
                done();
            });
        });
    });

    describe('selectMany$()', () => {
        it('return entities by ids in state', (done) => {
            selector.selectMany$([successEntity1.id]).subscribe((result) => {
                expect(result).toEqual([successEntity1]);
                done();
            });
        });
    });

    describe('selectOne$()', () => {
        it('return entity by id in state', (done) => {
            selector.selectOne$(successEntity1.id).subscribe((result) => {
                expect(result).toEqual(successEntity1);
                done();
            });
        });
    });

    describe('selectIds$()', () => {
        it('return all ids', (done) => {
            selector.selectIds$().subscribe((result) => {
                expect(result.length).toBe(2);
                expect(result[0]).toBe('1');
                expect(result[1]).toBe('2');
                done();
            });
        });
    });

    describe('isLoading$', () => {
        it('should return false if api status is success', (done) => {
            selector.isLoading$(successEntity1.id).subscribe((result) => {
                expect(result).toBeFalsy();
                done();
            });
        });

        it('should return false if api status is fail', (done) => {
            selector.isLoading$(failedEntity.id).subscribe((result) => {
                expect(result).toBeFalsy();
                done();
            });
        });

        it('should return true if api status is loading', (done) => {
            selector.isLoading$(loadingEntity.id).subscribe((result) => {
                expect(result).toBeTruthy();
                done();
            });
        });
    });

    describe('atLeastOneLoading$', () => {
        it('should return true if there is one loading', (done) => {
            selector.atLeastOneLoading$([successEntity1.id, loadingEntity.id, failedEntity.id]).subscribe((result) => {
                expect(result).toBeTruthy();
                done();
            });
        });

        it('should return false if there is no one loading', (done) => {
            selector.atLeastOneLoading$([successEntity1.id, failedEntity.id]).subscribe((result) => {
                expect(result).toBeFalsy();
                done();
            });
        });
    });

    describe('isLoaded$', () => {
        it('should return false if api status is loading', (done) => {
            selector.isLoaded$(loadingEntity.id).subscribe((result) => {
                expect(result).toBeFalsy();
                done();
            });
        });

        it('should return true if api status is success', (done) => {
            selector.isLoaded$(successEntity1.id).subscribe((result) => {
                expect(result).toBeTruthy();
                done();
            });
        });

        it('should return true if api status is fail', (done) => {
            selector.isLoaded$(failedEntity.id).subscribe((result) => {
                expect(result).toBeTruthy();
                done();
            });
        });
    });
});
