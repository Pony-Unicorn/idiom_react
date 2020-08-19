// 模块化后，最终移除这个文件

import serverRouter from './serverRouter';
import { httpRequestEmpty } from './wrapperHttpRequest';

// 获取 token 详情
export const gameInit = (params: { js_code?: string, uid?: string }): Promise<{}> => httpRequestEmpty.fetchGetApi(serverRouter.gameInit, params);

export const pointPass = (params: { uid: string, type: string }): Promise<{}> => httpRequestEmpty.fetchGetApi(serverRouter.pointPass, params);
