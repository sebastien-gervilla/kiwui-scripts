import webpack from 'webpack';
import WebpackDevServer, { Configuration } from 'webpack-dev-server';
import { getDevelopmentConfig } from '../configs/webpack.dev.config';
import Color from '../helpers/Colors.helper';
import { paths } from '../configs/paths.config';
import { getProjectConfig } from '../utils/getProjectConfig';
import { checkRequiredFiles } from '../utils/file.utils';

export const dev = () => {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';

    if (!checkRequiredFiles([paths.html, paths.index]))
        process.exit(1);

    const projectConfig = getProjectConfig();
    const config = getDevelopmentConfig(projectConfig);

    const { PORT = 3000 } = process.env;
    const devServerOptions: Configuration = {
        host: 'localhost',
        port: PORT,
        hot: true
    };

    const compiler = webpack(config);
    const devServer = new WebpackDevServer(devServerOptions, compiler);

    // Start the server
    devServer.startCallback(error => {
        if (!error) return console.log(Color.cyan(
            `🚀 Server ready at http://localhost:${PORT} \n`
        ));

        console.error(error);
    });
}