import { getStyleLoaders } from "../../utils/getStyleLoaders";
import { cssModuleRegex } from "./cssModule.rule";

export const getCssRule = (isProduction: boolean, useSourceMap: boolean) => ({
    test: cssRegex,
    exclude: cssModuleRegex,
    use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isProduction
            ? useSourceMap
            : false,
        modules: {
            mode: 'icss',
        },
    }, useSourceMap, isProduction),
    sideEffects: true,
})

export const cssRegex = /\.css$/;