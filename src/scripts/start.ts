import webpack from 'webpack';
import WebpackDevServer, { Configuration } from 'webpack-dev-server';
import { devConfig } from '../configs/webpack.dev.config';
import Color from '../helpers/Colors.helper';

export const start = () => {
    const devServerOptions: Configuration = {
        host: 'localhost',
        port: 3000,
        hot: true
    };

    const compiler = webpack(devConfig);
    const devServer = new WebpackDevServer(devServerOptions, compiler);

    // Start the server
    devServer.startCallback(error => {
        if (!error) return console.log(Color.cyan(
            '🚀 Server ready at http://localhost:3000'
        ));

        console.error(error);
    });
}