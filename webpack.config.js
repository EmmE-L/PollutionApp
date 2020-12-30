const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')

    },
    module: {
        rules: [
            {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
              },
        ] 
    }, 
    plugins: [
        new Dotenv()
      ],
}; 