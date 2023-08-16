import path from 'path';
import { WebpackConfiguration } from 'webpack-dev-server';
import { mainPlugin } from 'sage-babel-plugin';

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
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-env", 
                                "@babel/preset-typescript"
                            ],
                            plugins: [
                                [mainPlugin]
                            ]
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    require.resolve('style-loader'), 
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 3,
                            sourceMap: true,
                            modules: {
                                mode: 'icss',
                            },
                        },
                    },
                    {
                        // Options for PostCSS as we reference these options twice
                        // Adds vendor prefixing based on your specified browser support in package.json
                        loader: require.resolve('postcss-loader'),
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                config: false,
                                plugins: [
                                    'postcss-flexbugs-fixes',
                                    [
                                        'postcss-preset-env',
                                        {
                                            autoprefixer: {
                                                flexbox: 'no-2009',
                                            },
                                            stage: 3,
                                        },
                                    ],
                                    // Resets css with default options, 
                                    // which allows support for browserslist (package.json)
                                    'postcss-normalize',
                                ]
                            },
                            sourceMap: true,
                        },
                    },
                    {
                        loader: require.resolve('resolve-url-loader'),
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    }
};