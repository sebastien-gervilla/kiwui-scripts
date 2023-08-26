import { existsSync } from "fs";
import { paths } from "../configs/paths.config";
import { checkRequiredFiles } from "../utils/file.utils";
import { getProductionConfig } from "../configs/webpack.production.config";
import { copySync, emptyDirSync } from "fs-extra";
import { webpack } from "webpack";
import Color from "../helpers/Colors.helper";
import { getProjectConfig } from "../utils/getProjectConfig";

export const build = () => {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';

    if (!checkRequiredFiles([paths.html, paths.index]))
        process.exit(1);

    const projectConfig = getProjectConfig();
    const config = getProductionConfig(projectConfig);

    // Cleaning build folder
    emptyDirSync(paths.build);

    // Adding public directory
    copySync(paths.public, paths.build, {
        dereference: true,
        filter: file => file !== paths.html,
    });

    // Start building
    console.log('Building...');
    const compiler = webpack(config);
    compiler.run((error, stats) => {
        if (!error) {
            console.log(Color.green("Compiled successfully !"));
            process.exit(0);
        }

        console.log(Color.red("Error during compilation."));
        console.log(error);
        process.exit(1);
    })
}

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;