# 起因
在开发大型项目时，需要划分分业务模块以及不同业务部署到不同服务器上，如果按原来的单页应用开发，业务无法分离，最后打包出来包含了所有项目的页面代码会使包比较大。

在上线后，如果只改动其中一个与其他业务不相关的业务模块的代码，其他项目不需要重新打包部署，有利于开发和维护。

---
# 目标
- 多个项目共用一套配置、node_modules依赖
- 可以互相引用其它项目内组件、工具方法
- 每个项目可以独立启动、打包

---

# 步骤
## 1. 工程目录
- 工程目录主要结构
```
node_modules
common
    |- assets
    |- public
        |- config.js
        | favicon.ico
    |- view
        |- App.vue
    |- util
project1
    |- assets
    |- public
    |- router
    |- store
    |- view
        |- home.vue
    |- main.ts
project2
    |- assets
    |- public
    |- router
    |- store
    |- view
        |- home.vue
    |- main.ts
typings
    |- shims-vue.d.ts
index.html
package.json
package-lock.json
tsconfig.json
vue.config.js
```

## 2. package.json
- 增加开发、打包脚本
```json
{
    "scripts": {
         "serve:project1": "cross-env projectDir=project1 vue-cli-service serve --port 4201",
         "build:project1": "cross-env projectDir=project1 vue-cli-service build",
         "serve:project2": "cross-env projectDir=project2 vue-cli-service serve --port 4202",
         "build:project2": "cross-env projectDir=project2 vue-cli-service build",
         "build": "start npm run build:project1 & start npm run build:project2"
    }
}

```
## 3. tsconfig.json
- 配置路径别名
- 包含工程代码ts,vue文件
```json
{
    "compilerOptions": {
        "paths": {
                "@common/*": [
                    "common/*"
                ],
                 "@project1/*": [
                    "project1/*"
                ],
                 "@project2/*": [
                    "project2/*"
                ]
            }
    },
    "include": [
        "typings",
        "common/**/*.ts",
        "common/**/*.vue",
        "project1/**/*.ts",
        "project1/**/*.vue",
        "project2/**/*.ts",
        "project2/**/*.vue"
    ]
}
```
## 4. vue.config.js
```javascript
const path = require('path');
const projectDir = process.env.projectDir;
const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    chainWebpack: config => {
        config.plugin('copy').use(require('copy-webpack-plugin'), [{
            patterns:
                [{from: './common/public', to: './'},
                    {from: `./${projectDir}/public`, to: './'}
                ]
        }
        ])
    },
    pages: {
        // 这里为了简单，直接使用传入的projectDir，如果每个项目需要不同的配置，可根据项目名直接全部列出来，在打包命令里指定入口文件
        [projectDir]: {
            entry: `./${projectDir}/main.ts`,
            // 这里因为基础模板都一样，因此使用了同一个模板；有需要也可以根据项目不同传入不同的路径。
            template: './index.html',
            filename: 'index.html',
            title: `vue2-multi-project-demo-${projectDir}`
        },
    },
    outputDir:`./dist/${projectDir}`,
    configureWebpack: {
        resolve: {
            alias: {
                // 与tsconfig中的paths保持一致
                '@common': path.resolve(__dirname, 'common'),
                '@project1': path.resolve(__dirname, 'project1'),
                '@project2': path.resolve(__dirname, 'project2'),
            }
        }
    }
});
```
## 5. main.ts
- 每个项目根目录的main.ts文件，根据每个项目不同需要导入各插件、依赖。
```typescript
    import Vue from 'vue';
  
    // 由于App.vue内容都一样，这里所有的项目模板都引用了common下的App.vue
    import App from '@common/view/App.vue';
    import router from './router';
    import store from './store';
    
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
```
## 6. 大功告成
- 完成以上配置后，即可以单独启动和打包。
- 参考：[示例项目代码](https://github.com/chaimzhang/vue2-mulit-project-demo)