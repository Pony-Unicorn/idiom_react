import { IUserState } from '../store/types';

export const USER_UPDATE = 'USER_UPDATE';

export interface IUserUpdatePayload {
  type: typeof USER_UPDATE;
  data: IUserState;
}

export const userUpdate = (userData: IUserState): IUserUpdatePayload => {
  return {
    type: USER_UPDATE,
    data: userData
  };
}
