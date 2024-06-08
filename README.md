# Vue开发桌面应用框架介绍
> 我们不生产框架，我们是优秀框架的搬运工

这是一个用Vite+vue3基于electron开发跨平台电脑桌面应用的框架。前端开发者用一套熟悉的vue框架就可以开发电脑应用，无需在学习其他语言，只要你会vue前端开发就可以开发桌面应用。
<br/>
只要经过GoFly技术团队处理过的框架都会变得简单，GoFly技术团队始终坚持“大道至简”理念让开发变得简单，唯有简单才是解决开发效率和让开发者快乐办法。
## 项目结构
```

├── dist-electron           # 初始运行生成代码
├── electron                # 编辑electron代码
│   ├── renderers           # 编辑各个electron接口代码
│   │  ├── effect.js        # 定义渲染进程调用主程序方法
│   │  ├── example.js       # electron的demo测试
│   │  ├── framework.js     # 网络通讯
│   │  ├── hardware.js      # 硬件调用
│   │  └── os.js            #  os
│   └── main.js             # electron主程序
├── public                  # 附件
├── release                 # 打包生成程序目录
├── resources               # 静态资源
├── src                     #vue 代码
│   ├── api                 # 后台管理应用模块
│   ├── assets              # vue静态文件图片、css、js等
│   ├── components          # 组件
│   ├── layouts             # 框架布局
│   ├── router              # 页面路由
│   ├── utils               # js封装工具
│   │  ├── ipcMainApi.js    # 定义渲染进程调用主程序方法
│   │  └── ipcRenderer.js   # 统一引入Renderer.ipcRenderer、 Renderer.contextBridge等
│   ├── views               # vue页面
│   ├── App.vue             # vue 入口
│   ├── main.js             #  
│   └── style.css           # 公共样式
├── index.html              # 页面入口
├── vite.config.js          # vite配置
├── package.json            # 依赖        
└── README.md               # 项目介绍
```

## 快速开始
gitee 下载框架代码到本地
```
 git clone https://gitee.com/huang_li_shi_admin/vite_electron.git
```
## 初始项目
如果初始下载失败，请更改资源镜像（淘宝镜像）
```
 yarn install
```
## 运行项目
```
yarn dev

```
可以看到创建了一个dist-electron文件夹，同时打开了一个桌面应用
## 打包项目
```
yarn build

```
成功后会生成一个release文件夹，在里面就能看到打包好的exe安装包了。

## 安装Electron（选择安装 如果yarn install 可以跑就不用安装）
### 1.先配置下镜像
不安装下载和打包时可能会超时出错
```
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/

yarn config set electron_builder_binaries_mirror https://npm.taobao.org/mirrors/electron-builder-binaries/

```
### 2.接下来开始安装electron
```
yarn add electron -D

```
### 3.接着安装vite-plugin-electron插件
该插件用于配置electron打包编译的文件入口
``` 
yarn add vite-plugin-electron -D

```
## 开发注意事项
1. ctrl+shift+i 切换开发者控制台
2. electron框架API代码electron\renderers下添加
3. vue页面调用Electron框架的API方法在src\utils\ipcMainApi.js统一管理

## 开发文档
开发参考我们封装框架的[GoFly桌面快速开发框架文档](https://doc.goflys.cn/docview?id=33)，需要框electron请[electron官方文档](https://www.electronjs.org/zh/docs/latest/api/app)，我们框架集成了vue的UI框架方便您快速开发应用，无需自己搭建基础依赖和技术选择。
 

## 桌面应用框架预览图
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/5a6ea5d31124da7da727c086d0a62736.png)
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/2fdeb46cab3c1c7f4f1bc5624fbf45ed.png)
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/b13abd631010403c6e3990a4fcb399e8.png)
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/f0e82038df95434ddbc721e98d79f6da.png)
黑暗主题
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/63db520580ba3cc9d6049fc3d3ff2477.png)
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/259d56eff07542506ffc4d34987931f0.png)
播放视频
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/259d56eff07542506ffc4d34987931f0.png)
小窗口
![](https://api.goflys.cn/common/uploadfile/get_image?url=resource/uploads/20240102/3fea647fa0ab8b96471b333ba1284534.png)

## 联系我们
如果使用过程有问题，可以添加GoFly技术客服咨询（微信：goflycn）:
<div align="center">
 <img src=https://goflys.cn/assets/itservice-6334c7e6.jpg width=220 />
</div>
