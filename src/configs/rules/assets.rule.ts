export const getAssetsRule = (imageInlineSizeLimit: number) => ({
    test: [/\.jpe?g$/, /\.png$/, /\.svg$/, /\.gif$/, /\.avif$/, /\.bmp$/],
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: imageInlineSizeLimit,
        },
    },
});