import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import { loadItems, loadItemsFailure, loadItemsSuccess } from './items.actions';
import { Item } from '../../models/item.model';

@Injectable()
export class ItemsEffects {
  private itemsUrl = 'http://localhost:8080/items';

  constructor(
    @Inject(Actions) private actions$: Actions,
    private http: HttpClient
  ) {}

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadItems),
      mergeMap(() =>
        this.http.get<Item[]>(this.itemsUrl).pipe(
          map(items => {
            return loadItemsSuccess({ items });
          }),
          catchError(error => of(loadItemsFailure({ error })))
        )
      )
    )
  );

}
