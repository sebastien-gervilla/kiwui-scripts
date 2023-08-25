import path from "path";
import { paths } from "../configs/paths.config";
import { ProjectConfig } from "../types/config";

/**
 * Gets webpack aliases from the compilerOptions.
*/
export const getWebpackAliases = (options: Props = {}): ProjectConfig['webpackAliases'] => {
    const baseUrl = options.baseUrl;
  
    if (!baseUrl)
        return {};
  
    const baseUrlResolved = path.resolve(paths.root, baseUrl);

    return path.relative(paths.root, baseUrlResolved) === ''
        ? { src: paths.src }
        : {}
}

interface Props {
    baseUrl?: string
}