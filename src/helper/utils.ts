/**
 * 沉睡一段时间、单位为毫秒
 * 注意：暂时没有取消功能
 * @param {number} duration
 * @returns {Promise<number>}
 */
export const sleep = (duration: number) => new Promise(resole => setTimeout(resole, duration))

/**
 * 对象转数组[{label,value}]
 * @param {Object} obj
 * @returns {Array}
 */
export function obj2arr(obj: { [index: string]: any }) {
  return Object.keys(obj).map(key => ({
    label: obj[key],
    value: key
  }))
}
