import { ProjectEnvironment } from "../types/config";
import { getApplicationEnvironment } from "./getApplicationEnvironment";
import { loadEnvironment } from "./loadEnvironment";

export const getProjectEnvironment = (): ProjectEnvironment => {

    loadEnvironment();

    const useSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
    const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
    const imageInlineSizeLimit = parseInt(
        process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
    );

    return {
        useSourceMap,
        disableESLintPlugin,
        emitErrorsAsWarnings,
        imageInlineSizeLimit,
        ...getApplicationEnvironment()
    }
}