import path from 'path';
import { WebpackConfiguration } from 'webpack-dev-server';

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
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    }
};

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
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [
                                ["@babel/plugin-transform-react-jsx", {
                                    "pragma": "Sage.createElement"
                                }]
                            ]
                        },
                    },
                    'ts-loader',
                ],
            },
        ],
    }
};