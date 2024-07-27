const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      filename: 'index.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx']
    },  
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
              },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    externals: {
        react: 'react'
    },
};