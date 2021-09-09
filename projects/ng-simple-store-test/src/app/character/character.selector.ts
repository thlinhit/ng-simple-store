import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { compact, EntitySelector, isEmpty } from '@sstore/core';
import { CharacterState, CharacterStore } from './character.store';
import { Character } from './character.model';

@Injectable({
    providedIn: 'root',
})
export class CharacterSelector extends EntitySelector<CharacterState> {
    constructor(protected store: CharacterStore) {
        super(store);
    }

    getCharacters$(charIds: string[]): Observable<Character[]> {
        return this.selectEntities$().pipe(
            map((entities) => {
                const result = [];

                if (isEmpty(charIds)) {
                    return result;
                }

                return compact(charIds.map((charId) => (charId ? entities[charId] : null)));
            })
        );
    }
}
