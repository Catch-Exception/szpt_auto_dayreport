<!--
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-03 07:06:47
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-09-06 01:17:09
 * @FilePath: \server_szpt\README.md
 * @Description: 
-->
# 深职院健康系统自动申报
__使用提示：本项目最初目的仅仅只是为了解放双手，疫情期间请保证数据上报真实，预防疫情人人有责！__



## 💡特性
- [x] **全自动**  - 根据所预定的时间自动申报。
- [X] **多账户支持**  - 支持多个账户同时进行申报，一人解决一整个宿舍的问题。
- [X] **消息推送**  - 支持通过Bark/Server酱(支持中)平台推送申报结果到手机上。

## 🙌实现
- 使用`Typescrip`进行编写，遵循[工厂模式](https://zhuanlan.zhihu.com/p/110419316)，代码复用性及扩展性高。
- 使用[Bark](https://github.com/Finb/bark-server)推送消息到手机。

## 👌环境
- 本项目需要在[nodejs](https://nodejs.org/en/)环境下运行。

## 🍗食用方法
1. 配置`config.json`，根据提示依次填写Bark服务器地址，申报时间，设备key以及一网通账号密码。
(*如果不需要Bark推送的话，将`config.json`中的`host` `protocol`以及账号配置下的`bark_key`设置为`null`即可*)
2. 启动项目。

## 😍效果
[![v7MS76.png](https://s1.ax1x.com/2022/09/06/v7MS76.png)](https://imgse.com/i/v7MS76)

## 🆒调试&运行
#### 初始化
```
npm install
```

#### 生产环境测试
```
npm run start
```

#### 开发环境运行
```
npm run dev
```

#### 打包文件
```
npm run build
```

---------
## 协议
❤️Love from szpt_ai 2022

项目遵循MIT协议

Licensed under the MIT license.
