## 成语填空 react 版

### 原打算仿照（京东、饿了吗）做个项目了，逛了一圈 github 发现都有人做过，再做就没什么意义了，想了想本人做游戏出身，就用 react 做个小游戏吧，github 独一份，免得大家互相猜疑。

### 启动步骤
 * `yarn`

 * `yarn start`

 * `yarn build`

### 技术栈：
 * 基础框架 react 完全使用 16.8 新增的 Hook 特性开发。
 * 开发语言：typescript
 * 路由：react-router-dom
 * 数据管理：redux
 * 异步中间件：redux-thunk，这么小的数据量完全没有必要使用 saga 增加复杂度
 * UI 框架目前还真没找到一款适合游戏开发的 ui 框架，做游戏还是自己封装吧