import { realpathSync } from "fs"
import path from "path";

const rootDir = realpathSync(process.cwd());

export const paths = {
    root: rootDir,
    tsConfig: path.join(rootDir, 'tsconfig.json')
}