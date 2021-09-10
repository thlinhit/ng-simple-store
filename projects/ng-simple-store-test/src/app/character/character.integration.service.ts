import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Character } from './character.model';

const BASE_URL = 'https://breakingbadapi.com/api/characters';

@Injectable({
    providedIn: 'root',
})
export class CharacterIntegrationService {
    constructor(private http$: HttpClient) {}

    public getCharacter(characterId: string): Observable<Character> {
        return this.http$.get<Character>(`${BASE_URL}/${characterId}`).pipe(
            retry(3),
            map((response) => response?.[0])
        );
    }
}
