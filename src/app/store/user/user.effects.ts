// src/app/store/user/user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';

@Injectable()
export class UserEffects {
  private baseUrl = 'http://localhost:8080/users';

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap(({ email, password}) =>
        this.http.post<string>(this.baseUrl, { email, password}).pipe(
          map(userId => UserActions.createUserSuccess({ userId })),
          catchError(error => {
            console.error('Error creating user:', error);
            return of(UserActions.createUserFailure({
              error: error.message || 'Failed to create user'
            }));
          })
        )
      )
    )
  );

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      mergeMap(({ userId }) =>
        this.http.get<User>(`${this.baseUrl}/${userId}`).pipe(
          map(user => UserActions.getUserSuccess({ user })),
          catchError(error => {
            console.error('Error fetching user:', error);
            return of(UserActions.getUserFailure({
              error: error.message || 'Failed to get user'
            }));
          })
        )
      )
    )
  );

  activateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.activateUser),
      mergeMap(({ userId }) =>
        this.http.put<void>(`${this.baseUrl}/${userId}/activate`, {}).pipe(
          map(() => UserActions.activateUserSuccess()),
          catchError(error => {
            console.error('Error activating user:', error);
            return of(UserActions.activateUserFailure({
              error: error.message || 'Failed to activate user'
            }));
          })
        )
      )
    )
  );

  deactivateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deactivateUser),
      mergeMap(({ userId }) =>
        this.http.put<void>(`${this.baseUrl}/${userId}/deactivate`, {}).pipe(
          map(() => UserActions.deactivateUserSuccess()),
          catchError(error => {
            console.error('Error deactivating user:', error);
            return of(UserActions.deactivateUserFailure({
              error: error.message || 'Failed to deactivate user'
            }));
          })
        )
      )
    )
  );

  updateUserEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserEmail),
      switchMap(({ userId, email }) =>
        this.http.patch<void>(`${this.baseUrl}/${userId}/email`, { email }).pipe(
          map(() => UserActions.updateUserEmailSuccess()),
          catchError(error => {
            console.error('Error updating email:', error);
            return of(UserActions.updateUserEmailFailure({
              error: error.message || 'Failed to update email'
            }));
          })
        )
      )
    )
  );

  updateUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserPassword),
      switchMap(({ userId, currentPassword, newPassword }) =>
        this.http.put<void>(`${this.baseUrl}/${userId}/password`, { currentPassword, newPassword }).pipe(
          map(() => UserActions.updateUserPasswordSuccess()),
          catchError(error => {
            console.error('Error updating password:', error);
            return of(UserActions.updateUserPasswordFailure({
              error: error.message || 'Failed to update password'
            }));
          })
        )
      )
    )
  );
}
