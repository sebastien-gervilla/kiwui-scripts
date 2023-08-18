import { mainPlugin } from 'sage-babel-plugin';

export const jsRule = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    "@babel/preset-env"
                ],
                plugins: [
                    [mainPlugin]
                ]
            },
        },
    ],
}