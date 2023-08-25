import { mainPlugin } from 'sage-babel-plugin';
import { paths } from '../paths.config';

export const getTypescriptRule = (isProduction: boolean) => ({
    test: /\.(js|jsx|ts|tsx)$/,
    include: paths.src,
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
                ],
                compact: isProduction
            },
        },
    ],
});