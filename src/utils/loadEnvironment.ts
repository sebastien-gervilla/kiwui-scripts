import { existsSync } from "fs";
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { paths } from "../configs/paths.config";

/**
 * @description Loads the environment.
*/
export const loadEnvironment = () => {
    // Make sure we can include paths after loading environment
    delete require.cache[require.resolve('../configs/paths.config')];

    const NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV)
        throw new Error(
            'The NODE_ENV environment variable is required but was not specified.'
        );

    // .env files order:
    // 1 - `.env.[environment].local`
    // 2 - `.env.local`
    // 3 - `.env.[environment]`
    // 4 - `.env`
    const dotenvFiles = [
        `${paths.dotenv}.${NODE_ENV}.local`,
        // Don't include `.env.local` for `test` environment
        // since normally you expect tests to produce the same
        // results for everyone
        NODE_ENV !== 'test' && `${paths.dotenv}.local`,
        `${paths.dotenv}.${NODE_ENV}`,
        paths.dotenv,
    ].filter(Boolean) as string[];

    // Load environment variables from .env* files. 
    // Suppress warnings using silent if this file is missing. 
    // dotenv will never modify any environment variables that have already been set.  
    // Variable expansion is supported in .env files.
    // https://github.com/motdotla/dotenv
    // https://github.com/motdotla/dotenv-expand
    for (const dotenvFile of dotenvFiles)
        if (existsSync(dotenvFile))
            expand(
                dotenv.config({
                    path: dotenvFile,
                })
            );
}