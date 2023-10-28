import path from "path";
import { paths } from "../configs/paths.config";
import { ProjectConfig } from "../types/config";

/**
 * Gets webpack aliases the compilerOptions.
*/
export const getWebpackAliases = (options: Props): ProjectConfig['webpackAliases'] => {
    const aliases = getWebpackBaseUrlAlias(options.baseUrl);

    if (!paths)
        return aliases;

    for (const alias in options.paths)
        aliases[trimAlias(alias)] = path.resolve(
            paths.root, 
            trimAlias(options.paths[alias][0])
        );

    return aliases;
}

const getWebpackBaseUrlAlias = (baseUrl: string | undefined): ProjectConfig['webpackAliases'] => {
    if (!baseUrl)
        return {};
  
    const baseUrlResolved = path.resolve(paths.root, baseUrl);

    return path.relative(paths.root, baseUrlResolved) === ''
        ? { src: paths.src }
        : {}
}

const trimAlias = (alias: string) => {
    return alias.endsWith('/*')
        ? alias.slice(0, -2)
        : alias
}

interface Props {
    baseUrl?: string
    paths?: {
        [alias: string]: [string]
    }
}