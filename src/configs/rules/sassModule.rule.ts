import { getStyleLoaders } from "../../utils/getStyleLoaders";

export const getSassModuleRule = (isProduction: boolean, useSourceMap: boolean) => ({
    test: sassModuleRegex,
    use: getStyleLoaders(
        {
            importLoaders: 3,
            sourceMap: isProduction
                ? useSourceMap
                : false,
            modules: {
                mode: 'local',
                getLocalIdent: '[name]__[local]--[hash:base64:5]', // TODO: Might need better hash
            },
        },
        useSourceMap,
        isProduction,
        'sass-loader'
    )
});

export const sassModuleRegex = /\.module\.(scss|sass)$/;