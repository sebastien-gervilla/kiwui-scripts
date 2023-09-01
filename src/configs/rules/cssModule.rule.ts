import { getStyleLoaders } from "../../utils/getStyleLoaders";

export const getCssModuleRule = (isProduction: boolean, useSourceMap: boolean) => ({
    test: cssModuleRegex,
    use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isProduction
            ? useSourceMap
            : false,
        modules: {
            mode: 'local',
            getLocalIdent: '[name]__[local]--[hash:base64:5]', // TODO: Might need better hash
        },
    }, useSourceMap, isProduction),
})

export const cssModuleRegex = /\.module\.css$/;