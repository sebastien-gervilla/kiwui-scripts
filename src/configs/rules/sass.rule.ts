import { getStyleLoaders } from "../../utils/getStyleLoaders";
import { sassModuleRegex } from "./sassModule.rule";

export const getSassRule = (isProduction: boolean, useSourceMap: boolean) => ({
    test: sassRegex,
    exclude: sassModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 3,
            sourceMap: isProduction
                ? useSourceMap
                : false,
            modules: {
                mode: 'icss',
            },
        },
        useSourceMap,
        isProduction,
        'sass-loader'
    ),
    sideEffects: true,
});

export const sassRegex = /\.(scss|sass)$/;