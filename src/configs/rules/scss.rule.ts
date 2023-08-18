export const scssRule = {
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
}