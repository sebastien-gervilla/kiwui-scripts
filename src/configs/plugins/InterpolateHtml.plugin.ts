import escape from 'escape-string-regexp';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Environment } from '../../types/config';

export default class InterpolateHtmlPlugin {
    constructor(public replacements: Environment) {}

    apply(compiler: any) {
        compiler.hooks.compilation.tap('InterpolateHtmlPlugin', (compilation: any) => {
            HtmlWebpackPlugin
                .getHooks(compilation)
                .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
                    // Makes environment variables available in HTML.
                    let replacedHTML = data.html;
                    for (const key in this.replacements)
                        replacedHTML.replace(
                            new RegExp('%' + escape(key) + '%', 'g'),
                            this.replacements[key]
                        );

                    return {
                        ...data,
                        html: replacedHTML
                    };
                });
        });
    }
}

module.exports = InterpolateHtmlPlugin;