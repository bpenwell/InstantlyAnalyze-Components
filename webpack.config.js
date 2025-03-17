const path = require('path');

module.exports = {
    mode: 'production',
    //devtool: 'source-map',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      filename: 'index.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
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
                use: ['style-loader', 'css-loader','postcss-loader'],
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader', // Injects styles into DOM
                'css-loader',   // Translates CSS into CommonJS
                'sass-loader'   // Compiles Sass to CSS
              ],
            },
        ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      '@bpenwell/instantlyanalyze-module': '@bpenwell/instantlyanalyze-module',
      '@auth0/auth0-react': '@auth0/auth0-react',
      '@mapbox/search-js-react': '@mapbox/search-js-react',
      '@cloudscape-design/global-styles': '@cloudscape-design/global-styles',
      '@mui/material': '@mui/material',
      '@mui/icons-material': '@mui/icons-material',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
      '@cloudscape-design/chat-components': '@cloudscape-design/chat-components',
      '@cloudscape-design/components': '@cloudscape-design/components',
    },
};