// src/app/store/user/user.actions.ts
import { createAction, props } from '@ngrx/store';
import { User} from '../../models/user.model';

// Create User
export const createUser = createAction(
  '[User] Create User',
  props<{ email: string; password: string}>()
);
export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ userId: string }>()
);
export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: string }>()
);

// Get User
export const getUser = createAction(
  '[User] Get User',
  props<{ userId: string }>()
);
export const getUserSuccess = createAction(
  '[User] Get User Success',
  props<{ user: User }>()
);
export const getUserFailure = createAction(
  '[User] Get User Failure',
  props<{ error: string }>()
);

// Activate User
export const activateUser = createAction(
  '[User] Activate User',
  props<{ userId: string }>()
);
export const activateUserSuccess = createAction(
  '[User] Activate User Success'
);
export const activateUserFailure = createAction(
  '[User] Activate User Failure',
  props<{ error: string }>()
);

// Deactivate User
export const deactivateUser = createAction(
  '[User] Deactivate User',
  props<{ userId: string }>()
);
export const deactivateUserSuccess = createAction(
  '[User] Deactivate User Success'
);
export const deactivateUserFailure = createAction(
  '[User] Deactivate User Failure',
  props<{ error: string }>()
);

// Update Email
export const updateUserEmail = createAction(
  '[User] Update User Email',
  props<{ userId: string; email: string }>()
);
export const updateUserEmailSuccess = createAction(
  '[User] Update User Email Success'
);
export const updateUserEmailFailure = createAction(
  '[User] Update User Email Failure',
  props<{ error: string }>()
);

// Update Password
export const updateUserPassword = createAction(
  '[User] Update User Password',
  props<{ userId: string; currentPassword: string; newPassword: string }>()
);
export const updateUserPasswordSuccess = createAction(
  '[User] Update User Password Success'
);
export const updateUserPasswordFailure = createAction(
  '[User] Update User Password Failure',
  props<{ error: string }>()
);
