import webpack from 'webpack'
import { WebpackConfiguration } from "webpack-dev-server";
import { loggingConfig } from "./defaults.config";
import { paths } from './paths.config';
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { MODULE_EXTENSIONS } from "../utils/file.utils"
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as Rules from "./rules";
import { ProjectConfig } from "../types/config";
import { InterpolateHtmlPlugin, ModuleScopePlugin } from "./plugins";
import TsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import resolve from "resolve";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { existsSync } from 'fs';
import { createEnvironmentHash } from '../utils/createEnvironmentHash';

// TODO: Devtools
export const getDevelopmentConfig = ({ useTypescript, webpackAliases, environment }: ProjectConfig): WebpackConfiguration => ({
    ...loggingConfig,
    mode: 'development',
    bail: false,
    entry: paths.index,
    output: {
        path: paths.build,
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[name].[hash][ext]',
        publicPath: paths.publicUrlOrPath,
    },
    cache: {
        type: 'filesystem',
        version: createEnvironmentHash(environment.application),
        cacheDirectory: paths.webpackCache,
        store: 'pack',
        buildDependencies: {
            defaultWebpack: ['webpack/lib/'],
            config: [__filename],
            tsconfig: [paths.tsConfig, paths.jsConfig].filter(
                file => existsSync(file)
            ),
        },
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        ecma: 5,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // TODO: With devtools
                    keep_classnames: false,
                    keep_fnames: true,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    resolve: {
        modules: ['node_modules', paths.modules],
        extensions: MODULE_EXTENSIONS
            .filter(ext => useTypescript || !ext.includes('ts'))
            .map(ext => `.${ext}`),
        alias: webpackAliases,
        plugins: [
            new ModuleScopePlugin(paths.src, [
                paths.packageJson // TODO: Some more files should be allowed
            ])
        ]
    },
    module: {
        strictExportPresence: true,
        rules: [
            environment.useSourceMap && {
                enforce: 'pre',
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                loader: require.resolve('source-map-loader'),
            },
            {
                oneOf: [
                    Rules.getAssetsRule(environment.imageInlineSizeLimit),
                    useTypescript
                        ? Rules.getTypescriptRule(IS_PRODUCTION)
                        : Rules.getJavascriptRule(IS_PRODUCTION),
                    // TODO: JS Outside babel
                    // TODO: This could use some refactoring
                    Rules.getCssRule(IS_PRODUCTION, environment.useSourceMap),
                    Rules.getCssModuleRule(IS_PRODUCTION, environment.useSourceMap),
                    Rules.getSassRule(IS_PRODUCTION, environment.useSourceMap),
                    Rules.getSassModuleRule(IS_PRODUCTION, environment.useSourceMap),
                    {
                        test: /\.m?js/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                    {
                        // "file-loader", fallback.
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise be processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        type: 'asset/resource',
                    },
                ]
            }
        ],
    },
    plugins: [
        // Generates the `index.html` file with the injected <script>
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.html
        }),

        // Makes application environment variables available in index.html
        new InterpolateHtmlPlugin(environment.application),

        // Makes application environment variables available to the JS code
        new webpack.DefinePlugin(environment.applicationStringyfied),

        // TODO: Remove this from dev when possible (currently causes errors)
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].chunk.css',
        }),

        // Optimize when using moment.js
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),

        // Typescript type checking
        useTypescript &&
            new TsCheckerPlugin({
                async: IS_PRODUCTION,
                typescript: {
                    typescriptPath: resolve.sync('typescript', {
                        basedir: paths.modules,
                    }),
                    configOverwrite: {
                        compilerOptions: {
                            sourceMap: IS_PRODUCTION,
                            skipLibCheck: true,
                            inlineSourceMap: false,
                            declarationMap: false,
                            noEmit: true,
                            incremental: true,
                            tsBuildInfoFile: paths.tsBuildInfoFile
                        },
                    },
                    context: paths.root,
                    diagnosticOptions: {
                        syntactic: true,
                    },
                    mode: 'write-references'
                },
                issue: {
                    // This one is specifically to match during CI tests, as micromatch doesn't match
                    include: [
                        { file: '../**/src/**/*.{ts,tsx}' },
                        { file: '**/src/**/*.{ts,tsx}' },
                    ],
                    exclude: [
                        { file: '**/src/**/__tests__/**' },
                        { file: '**/src/**/?(*.){spec|test}.*' },
                        { file: '**/src/setupProxy.*' },
                        { file: '**/src/setupTests.*' },
                    ],
                }
            }),
        
        // TODO: ESLINT
    ].filter(Boolean)
});

// TODO: Merge dev and prod configs ?
// For better readability
const IS_PRODUCTION = false;