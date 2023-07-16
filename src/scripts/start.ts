import webpack from 'webpack';
import WebpackDevServer, { Configuration } from 'webpack-dev-server';
import { devConfig, tsDevConfig } from '../configs/webpack.dev.config';
import Color from '../helpers/Colors.helper';
import { existsSync } from 'fs';
import { paths } from '../configs/paths.config';

export const start = () => {
    const devServerOptions: Configuration = {
        host: 'localhost',
        port: 3000,
        hot: true
    };

    const useTypeScript = existsSync(paths.tsConfig);

    const compiler = webpack(useTypeScript ? tsDevConfig : devConfig);
    const devServer = new WebpackDevServer(devServerOptions, compiler);

    // Start the server
    devServer.startCallback(error => {
        if (!error) return console.log(Color.cyan(
            '🚀 Server ready at http://localhost:3000 \n'
        ));

        console.error(error);
    });
}