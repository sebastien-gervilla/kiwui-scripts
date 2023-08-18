import { mainPlugin } from 'sage-babel-plugin';

export const tsRule = {
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
}