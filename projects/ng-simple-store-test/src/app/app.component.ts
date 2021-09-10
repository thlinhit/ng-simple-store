import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character, CharacterSelector, CharacterStoreService } from './character';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'ng-simple-store-test';
    characters$: Observable<Character[]> = this.characterSelector.selectAll$();
    characterId: string;
    isLoading$: Observable<boolean>;

    constructor(private characterStoreService: CharacterStoreService, private characterSelector: CharacterSelector) {}

    ngOnInit(): void {
        this.characterStoreService.load(['1', '2']);
    }

    loadCharacter(): void {
        if (this.characterId) {
            this.characterStoreService.load([this.characterId]);
            this.isLoading$ = this.characterSelector.isLoading$(this.characterId);
        }
    }
}
