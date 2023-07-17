# 基于 `yarn workspace monorepo`+`vue2` 的多模块项目开发实践

- [示例项目源码](https://github.com/chaimzhang/yarn-monorepo-vue2-demo)

## 起因
在开发大型项目时，需要划分业务模块以及不同业务部署到不同服务器上，如果按原来的单页应用开发，业务无法分离，最后打包出来包含了所有项目的页面代码会使包比较大。

Yarn Workspaces（工作区）是Yarn提供的monorepo的依赖管理机制，从Yarn 1.0开始默认支持，用于在代码仓库的根目录下管理多个package的依赖。

使用此方式分成多个子项目分别开发，在上线后，如果只改动其中一个与其他业务不相关的项目模块的代码，其他项目不需要重新打包部署，有利于开发和维护。

---
## 目标
- 多个模块共用相同node_modules依赖，无需重复安装
- 通用方法、组件放到统一目录下，也可以互相引用其它项目内组件、工具方法等
- 每个模块可以独立启动、打包

---

## 步骤
###  工程目录
- 主要目录结构
```
node_modules
packages
    |- common
          |- assets
          |- typings
              shims-vue.d.ts
          |- view
              App.vue
          |- util
          tsconfig.json
    |- project1
        |- public
            index.html
        |- src
            |- assets
            |- router
            |- store
            |- view
                Home.vue
            |- main.ts
        babel.config.js
        package.json
        tsconfig.json
        vue.config.js
    |- project2
        |- public
        |- src
            |- assets
            |- router
            |- store
            |- view
                Home.vue
            |- main.ts
        babel.config.js
        package.json
        tsconfig.json
        vue.config.js
package.json
yarn.lock
```

###   /package.json
- 添加工作区
- 开发、打包脚本
```json
{
      "workspaces":[
          "packages/*"
        ],
      "scripts": {
        "serve:project1": "yarn workspace project1 serve",
        "build:project1": "yarn workspace project1 build",
        "serve:project2": "yarn workspace project2 serve",
        "build:project2": "yarn workspace project2 build",
        "serve": "yarn serve:project1 & yarn serve:project2",
        "build": "yarn build:project1 & yarn build:project2"
      }
}

```
###   /packages/*/package.json
- project1和project2开发、打包脚本，启动的端口设置成不同的
```json
{
  "scripts": {
    "serve": "vue-cli-service serve --port 4201",
    "build": "vue-cli-service build"
  }
}

```
###  /packages/*/tsconfig.json
- 配置路径别名
```json
{
    "compilerOptions": {
        "paths": {
                "@common/*": [
                    "common/*"
                ],
                 "@project1/*": [
                    "project1/src/*"
                ],
                 "@project2/*": [
                    "project2/src/*"
                ]
            }
    },
    "include": [
        "../common/typings"
    ]
}
```
###  /packages/project1/vue.config.js
```javascript
module.exports = defineConfig({
    outputDir:`./dist/project1`,
    configureWebpack: {
        resolve: {
            alias: {
                // 与tsconfig中的paths保持一致；project2的配置同理
                '@project1': path.resolve(__dirname, 'src'),
                '@common': path.resolve(__dirname, '../common'),
                '@project2': path.resolve(__dirname, '../project2/src'),
            },
            extensions:['.ts']
        }
    }
});
```
###  大功告成
- 完成以上配置后，各子项目即可单独启动和打包。
- [示例项源码](https://github.com/chaimzhang/yarn-monorepo-vue2-demo)
