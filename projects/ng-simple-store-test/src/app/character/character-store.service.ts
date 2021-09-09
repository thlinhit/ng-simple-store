import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { CharacterStore } from './character.store';
import { CharacterIntegrationService } from './character.integration.service';
import { buildFailStatuses, buildLoadingStatuses, buildSuccessStatuses, compact, notEmpty } from '@sstore/core';
import { Character } from './character.model';

@Injectable({
    providedIn: 'root',
})
export class CharacterStoreService {
    private load$: BehaviorSubject<string[]>;

    constructor(private store: CharacterStore, private integration: CharacterIntegrationService) {
        this.load$ = new BehaviorSubject<string[]>(null);
        this.load$
            .pipe(
                filter(notEmpty),
                map((charIds: string[]) => compact(charIds)),
                map((charIds: string[]) => {
                    return charIds.filter((charId) => !this.store.hasProceeded(charId));
                }),
                filter(notEmpty),
                tap((charIds: string[]) => {
                    this.store.update(buildLoadingStatuses(charIds));
                }),
                switchMap((charIds) => this._load$(charIds))
            )
            .subscribe();
    }

    public load(charIds: string[]): void {
        this.load$.next(charIds);
    }

    private _load$(charIds: string[]): Observable<Character[]> {
        return forkJoin(
            charIds.map((charId) =>
                this.integration.getCharacter(charId).pipe(
                    take(1),
                    catchError((_) => {
                        this.store.update(buildFailStatuses(charId));
                        return of(null);
                    })
                )
            )
        ).pipe(
            map((characters: Character[]) => {
                this.store.addMany(characters, buildSuccessStatuses(characters.map((character) => character.char_id)));
                return characters;
            })
        );
    }
}
