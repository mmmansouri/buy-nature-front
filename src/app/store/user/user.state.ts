import { User } from '../../models/user.model';

export interface UserState {
  currentUser: User | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  currentUser: null,
  userId: null,
  loading: false,
  error: null
};
