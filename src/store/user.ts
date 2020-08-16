import { IUserUpdatePayload, USER_UPDATE } from '../actions/index';
import { IUserState } from './types';

const initial: IUserState = {
    uid: "",
    /* 体力*/
    strength: 0,
    /* 用户最大体力*/
    maxStrength: 0,
    /* 用户等级*/
    userLv: 0,
    /* 当前关卡*/
    currentPoint: 1,
    /* 当前关卡是否已通过*/
    pointStatus: false,
    /* 下一次体力冷却剩余时间*/
    coolingTime: 0,
    /* 金币余额*/
    coinAmount: 0
}

export const userReducer = (state = initial, action: IUserUpdatePayload) => {
    switch (action.type) {
        case USER_UPDATE:
            return Object.assign({}, state, action.data)
        default:
            return state;
    }
}
