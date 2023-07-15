import path from 'path';
import { WebpackConfiguration } from 'webpack-dev-server';

export const devConfig: WebpackConfiguration = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    stats: 'none',
    devServer: {
        client: {
            logging: 'none'
        }
    },
    infrastructureLogging: {
        level: 'none'
    }
};