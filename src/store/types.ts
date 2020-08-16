/**
 * 用户信息接口
 */
export interface IUserState {
  readonly uid: string;
  readonly strength: number;
  readonly maxStrength: number;
  readonly userLv: number;
  readonly currentPoint: number;
  readonly pointStatus: boolean;
  readonly coolingTime: number;
  readonly coinAmount: number;
}

export interface IStateAll {
  user: IUserState
}
