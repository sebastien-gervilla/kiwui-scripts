import { paths } from "../configs/paths.config";
import { Environment } from "../types/config";

export const getApplicationEnvironment = () => {
    const publicUrl = paths.publicUrlOrPath;

    let applicationEnvironment: Environment = {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches Kiwui into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',

        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        // We remove the trailing slash because %PUBLIC_URL%/stuff looks better
        // than %PUBLIC_URL%stuff
        PUBLIC_URL: publicUrl.slice(0, -1),
    };

    for (const key in process.env)
        applicationEnvironment[key] = process.env[key] || ''
    
    // Stringify all values so we can feed into webpack DefinePlugin
    let stringified: Environment = {};
    for (const key in applicationEnvironment)
        stringified[key] = JSON.stringify(applicationEnvironment[key]);
  
    return {
        application: applicationEnvironment,
        applicationStringyfied: {
            'process.env': stringified
        }
    };
}

const KIWUI_APP_REGEX = /^KIWUI_APP_/i;