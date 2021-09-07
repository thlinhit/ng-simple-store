import { Store } from './store';

describe('Store', () => {
    describe('_getState()', () => {
        it('return current state', () => {
            // Given
            const store = new Store<string>('');

            // When
            store._set('new');

            // Then
            expect(store._getState()).toEqual('new');
        });
    });

    describe('select()', () => {
        it('should return partial state', (done) => {
            // Given
            const state = {
                loaded: false,
            };
            const store = new Store(state);

            // When and Then
            store
                .select((s) => s.loaded)
                .subscribe((value) => {
                    expect(value).toBeFalsy();
                    done();
                });
        });
    });

    describe('reset()', () => {
        it('should get back the initial state', () => {
            // Given
            const initialState = {
                loaded: false,
            };
            const store = new Store(initialState);

            store._set({
                loaded: true,
            });

            // When
            store.reset();

            // Then
            expect(store._getState().loaded).toBeFalsy();
        });
    });
});
