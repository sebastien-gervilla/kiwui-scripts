import path from 'path';
import { WebpackConfiguration } from 'webpack-dev-server';
import { cssModuleRule, cssRule, jsRule, scssRule, tsRule } from './rules';

const defaultConfig: WebpackConfiguration = {
    stats: 'none',
    devServer: {
        client: {
            logging: 'none'
        }
    },
    infrastructureLogging: {
        level: 'none'
    }
}

export const devConfig: WebpackConfiguration = {
    ...defaultConfig,
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
            jsRule,
            cssRule,
            scssRule,
            cssModuleRule,
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    }
};

// TODO: Have a sage.config.ts, that contains config you want,
// like scss or css support, which adds loaders
export const tsDevConfig: WebpackConfiguration = {
    ...defaultConfig,
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            tsRule,
            cssRule,
            scssRule,
            cssModuleRule,
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    }
};