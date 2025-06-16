// src/app/store/user/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { initialState } from './user.state';

export const userReducer = createReducer(
  initialState,

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.createUserSuccess, (state, { userId }) => ({
    ...state,
    userId,
    loading: false
  })),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Get User
  on(UserActions.getUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.getUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false
  })),
  on(UserActions.getUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Activate/Deactivate User
  on(UserActions.activateUser, UserActions.deactivateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.activateUserSuccess, (state) => ({
    ...state,
    currentUser: state.currentUser ? { ...state.currentUser, active: true } : null,
    loading: false
  })),
  on(UserActions.deactivateUserSuccess, (state) => ({
    ...state,
    currentUser: state.currentUser ? { ...state.currentUser, active: false } : null,
    loading: false
  })),
  on(UserActions.activateUserFailure, UserActions.deactivateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Email & Password
  on(UserActions.updateUserEmail, UserActions.updateUserPassword, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.updateUserEmailSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(UserActions.updateUserPasswordSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(UserActions.updateUserEmailFailure, UserActions.updateUserPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
