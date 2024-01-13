export interface ProjectConfig {
    useTypescript: boolean
    webpackAliases: {[index: string]: string}
    environment: ProjectEnvironment
}

export interface ProjectEnvironment {
    // Application environment
    application: Environment
    applicationStringyfied: {
        'process.env': Environment
    },

    // Project environment
    useSourceMap: boolean
    disableESLintPlugin: boolean
    emitErrorsAsWarnings: boolean
    imageInlineSizeLimit: number
}

export interface Environment {
    [key: string]: string
}