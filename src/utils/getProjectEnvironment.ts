import { ProjectEnvironment } from "../types/config";
import { getApplicationEnvironment } from "./getApplicationEnvironment";
import { loadEnvironment } from "./loadEnvironment";

export const getProjectEnvironment = (): ProjectEnvironment => {

    loadEnvironment();

    const useSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
    const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

    return {
        useSourceMap,
        disableESLintPlugin,
        emitErrorsAsWarnings,
        ...getApplicationEnvironment()
    }
}