import { gameInit, pointPass } from '../api';
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

export const gameInit_ac = (params: { js_code?: string | undefined; uid?: string | undefined; }) =>
  (dispatch: any) => {
    gameInit(params)
      .then((res: any) => {
        localStorage.setItem('uid', res['uid']);
        dispatch(userUpdate(res));
      }).catch(() => {
        // alert('网络出错，请刷新重试');
      })
  }

export const pointPass_ac = (params: string) =>
  (dispatch: any, getState: any) => {
    console.log('中间输出');
    pointPass({ uid: getState()['user']['uid'], type: params })
      .then((res: any) => {
        dispatch(userUpdate(res));
      }).catch(() => {
        // alert('网络出错，请刷新重试');
        console.log('错误输出');
      });
  }
