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
