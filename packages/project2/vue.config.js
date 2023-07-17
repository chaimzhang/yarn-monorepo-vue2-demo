const path = require('path');
const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    outputDir:`./dist/project2`,
    configureWebpack: {
        resolve: {
            alias: {
                // 与tsconfig中的paths保持一致
                '@project2': path.resolve(__dirname, 'src'),
                '@common': path.resolve(__dirname, '../common'),
                '@project1': path.resolve(__dirname, '../project2/src'),
            },
            extensions:['.ts']
        }
    }
});
