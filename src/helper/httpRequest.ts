import { AxiosInstance } from 'axios';

type argsObjType = { [index: string]: string | number | undefined };

/**
 * 拼接 get 请求字符串
 * @param {*} argsObj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
const splicingQueryString = (argsObj: argsObjType, format = (v: any) => v) => {
    if (typeof argsObj === 'undefined') return '';

    const params: Array<string> = [];

    Object.keys(argsObj).forEach(key => params.push([key, format(argsObj[key])].join('=')));

    return '?' + params.join('&');
}

/**
 * 创建 http 请求
 * @param {AxiosInstance} httpHandle 
 */
const createHttpRequest = (httpHandle: AxiosInstance) => {

    /**
     * 发起 get 请求
     * @param {string} route - 路由
     * @param {{[key: string]: any}} args 
     */
    const fetchGetApi = <T>(route: string, args: argsObjType) =>
        httpHandle.get(`${route}${splicingQueryString(args)}`)
            .then((response: { data: T }) => response.data);

    /**
     * 发起 post 请求
     * @param {string} route - 路由
     * @param {{[key: string]: any}} args 
     */
    const fetchPostApi = <T>(route: string, args: argsObjType) =>
        httpHandle.post(route, args)
            .then(response => <T>response.data);

    return {
        fetchGetApi,
        fetchPostApi
    }
}

export default createHttpRequest;
