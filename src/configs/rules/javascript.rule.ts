import { transformJSX } from 'kiwui-babel-plugin';
import { paths } from '../paths.config';

export const getJavascriptRule = (isProduction: boolean) => ({
    test: /\.(js|jsx)$/,
    include: paths.src,
    exclude: /node_modules/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    "@babel/preset-env"
                ],
                plugins: [
                    [transformJSX]
                ],
                compact: isProduction
            },
        },
    ],
});