import { createHash } from 'crypto';
import { Environment } from "../types/config";

export const createEnvironmentHash = (env: Environment) => {
    const hash = createHash('md5');
    hash.update(JSON.stringify(env));

    return hash.digest('hex');
};