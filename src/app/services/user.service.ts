// src/app/services/user.service.ts
import { Injectable } from "@angular/core";
import {
  selectCurrentUser,
  selectUserError,
  selectUserLoading,
  selectUserId
} from "../store/user/user.selectors";
import { UserState } from "../store/user/user.state";
import { Store } from "@ngrx/store";
import * as UserActions from '../store/user/user.actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store: Store<UserState>) {}

  createUserSignal(email: string, password: string) {
    this.store.dispatch(UserActions.createUser({ email, password }));
    return this.store.selectSignal(selectUserId);
  }

  getUserSignal(userId: string) {
    this.store.dispatch(UserActions.getUser({ userId }));
    return this.store.selectSignal(selectCurrentUser);
  }

  activateUser(userId: string) {
    this.store.dispatch(UserActions.activateUser({ userId }));
  }

  deactivateUser(userId: string) {
    this.store.dispatch(UserActions.deactivateUser({ userId }));
  }

  updateUserEmail(userId: string, email: string) {
    this.store.dispatch(UserActions.updateUserEmail({ userId, email }));
  }

  updateUserPassword(userId: string, newPassword: string) {
    this.store.dispatch(UserActions.updateUserPassword({ userId, newPassword }));
  }

  getUserLoadingSignal() {
    return this.store.selectSignal(selectUserLoading);
  }

  getUserErrorSignal() {
    return this.store.selectSignal(selectUserError);
  }
}
