import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import { loadItems, loadItemsFailure, loadItemsSuccess } from './items.actions';
import { Item } from '../../models/item.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ItemsEffects {
  private itemsUrl = `${environment.apiUrl}/items`;

  constructor(
    @Inject(Actions) private actions$: Actions,
    private http: HttpClient
  ) {}

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      mergeMap(() => {
        console.log('🔵 Loading items from:', this.itemsUrl);
        return this.http.get<Item[]>(this.itemsUrl).pipe(
          map(items => {
            console.log('✅ Items loaded successfully:', items);
            return loadItemsSuccess({ items });
          }),
          catchError(error => {
            console.error('❌ Items loading failed:', error);
            return of(loadItemsFailure({ error }));
          })
        );
      })
    )
  );

}
