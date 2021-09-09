import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@sstore/core';
import { Character } from './character.model';

export interface CharacterState extends EntityState<Character> {}

export const initialState: CharacterState = {};

@Injectable({
    providedIn: 'root',
})
export class CharacterStore extends EntityStore<CharacterState> {
    constructor() {
        super((character: Character) => character.char_id, initialState);
    }
}
