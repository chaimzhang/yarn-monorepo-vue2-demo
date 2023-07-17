const path = require('path');
const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    outputDir:`./dist/project1`,
    configureWebpack: {
        resolve: {
            alias: {
                // 与tsconfig中的paths保持一致
                '@project1': path.resolve(__dirname, 'src'),
                '@common': path.resolve(__dirname, '../common'),
                '@project2': path.resolve(__dirname, '../project2/src'),
            },
            extensions:['.ts']
        }
    }
});
