import { realpathSync } from "fs"
import path from "path";
import { Resolve } from "../types/path";
import { resolveModule } from "../utils/file.utils";
import { getPublicUrlOrPath } from "../utils/getPublicUrlOrPath";

const rootDir = realpathSync(process.cwd());

const resolveRoot: Resolve = (relativePath: string) => 
    path.join(rootDir, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    require(resolveRoot('package.json')).homepage,
    process.env.PUBLIC_URL
);

export const paths = {
    // General
    root: resolveRoot('.'),
    build: resolveRoot('build'),
    publicUrlOrPath,

    // Public
    public: resolveRoot('public'),
    html: resolveRoot('public/index.html'),

    // Src
    src: resolveRoot('src'),
    index: resolveModule(resolveRoot, 'src/index'),
    serviceWorker: resolveModule(resolveRoot, 'src/service-worker'),

    // Modules
    modules: resolveRoot('node_modules'),
    webpackCache: resolveRoot('node_modules/.cache'),

    // Config
    dotenv: resolveRoot('.env'),
    packageJson: resolveRoot('package.json'),
    tsConfig: resolveRoot('tsconfig.json'),
    jsConfig: resolveRoot('jsconfig.json')
}