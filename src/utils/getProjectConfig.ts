import { existsSync } from "fs";
import { paths } from "../configs/paths.config";
import resolve from "resolve";
import { getWebpackAliases } from "./getWebpackAliases";
import { ProjectConfig } from "../types/config";
import { getProjectEnvironment } from "./getProjectEnvironment";

export const getProjectConfig = (): ProjectConfig => {
    // Get config files
    const hasTsConfig = existsSync(paths.tsConfig);
    const hasJsConfig = existsSync(paths.jsConfig);
  
    if (hasTsConfig && hasJsConfig)
        throw new Error(
            "Found both tsconfig.json and jsconfig.json.\n" +
            "If you are using TypeScript please remove your jsconfig.json file."
        ); 
  
    let config;
  
    // If there's a tsconfig.json we assume it's a TypeScript project 
    // The configuration will then be based on tsconfig.json
    if (hasTsConfig) {
      const ts = require(resolve.sync('typescript', {
        basedir: paths.modules,
      }));
      config = ts.readConfigFile(paths.tsConfig, ts.sys.readFile).config;
      // Otherwise we'll check if there is jsconfig.json
      // for non TS projects.
    } else if (hasJsConfig) {
      config = require(paths.jsConfig);
    }
  
    config = config || {};
    const options = config.compilerOptions || {};
  
    return {
        useTypescript: hasTsConfig,
        webpackAliases: getWebpackAliases(options),
        environment: getProjectEnvironment()
    };
}