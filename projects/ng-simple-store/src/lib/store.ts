import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Store<S = any> {
    private store: BehaviorSubject<Readonly<S>>;
    private state: S;
    private readonly _initialState: Partial<S>;

    constructor(protected initialState: Partial<S>) {
        this._initialState = { ...initialState };
        this._set(initialState as S);
    }

    public select<R>(project: (state: S) => R): Observable<R> {
        return this.store.asObservable().pipe(
            map((state) => project(state)),
            distinctUntilChanged()
        );
    }

    public reset(): void {
        this._set({ ...this._initialState } as S);
    }

    public destroy(): void {
        this.store.complete();
    }

    /** @internal */
    _getState(): S {
        return this.state;
    }

    /** @internal */
    /** @visibleForTesting */
    _set(newState: S): void {
        this.state = newState;

        if (!this.store) {
            this.store = new BehaviorSubject(this.state);
            return;
        }

        this._dispatch(this.state);
    }

    private _dispatch(state: S): void {
        this.store.next(state);
    }
}
