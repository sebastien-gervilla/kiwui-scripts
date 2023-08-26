import { WebpackConfiguration } from "webpack-dev-server";

export const loggingConfig: WebpackConfiguration = {
    stats: 'none',
    devServer: {
        client: {
            logging: 'none'
        }
    },
    infrastructureLogging: {
        level: 'none'
    }
}