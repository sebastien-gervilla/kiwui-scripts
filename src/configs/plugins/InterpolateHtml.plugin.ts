import escape from 'escape-string-regexp';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Environment } from '../../types/config';
import { Compilation, Compiler } from 'webpack';

export default class InterpolateHtmlPlugin {
    constructor(public replacements: Environment) {}

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation: Compilation) => {
            HtmlWebpackPlugin
                .getHooks(compilation)
                .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
                    // Makes environment variables available in HTML.
                    for (const key in this.replacements)
                        data.html = data.html.replace(
                            new RegExp('%' + escape(key) + '%', 'g'),
                            this.replacements[key]
                        );

                    return data;
                });
        });
    }
}

module.exports = InterpolateHtmlPlugin;