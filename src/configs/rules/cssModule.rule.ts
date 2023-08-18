export const cssModuleRule = {
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
}