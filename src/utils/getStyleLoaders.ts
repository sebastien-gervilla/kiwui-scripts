import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { paths } from '../configs/paths.config';

export const getStyleLoaders = (cssOptions: Object, isEnvProduction: boolean, useSourceMap: boolean, preProcessor?: string) => {
    let loaders = [];

    if (!isEnvProduction)
        loaders.push(require.resolve('style-loader'));

    // TODO: Remove this from dev when possible (currently causes errors)
    loaders.push({
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.')
            ? { publicPath: '../../' }
            : {},
    });

    // CSS Loader
    loaders.push(
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        }
    );

    // PostCSS loader
    loaders.push(
        {
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
                sourceMap: isEnvProduction ? useSourceMap : false,
            },
        }
    )

    if (!preProcessor) return loaders;

    // Preprocessor (like sass)
    loaders.push(
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: isEnvProduction ? useSourceMap : false,
                root: paths.src,
            },
        },
        {
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: true,
            },
        }
    );

    return loaders;
}