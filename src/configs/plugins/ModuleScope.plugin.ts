import os from 'os';
import path from 'path';

import { ResolvePluginInstance, Resolver } from 'webpack';
import Color from '../../helpers/Colors.helper';


export default class ModuleScopePlugin implements ResolvePluginInstance {

    public appSrcs: string[];
    public allowedFiles: Set<string>;
    public allowedPaths: string[];

    constructor(appSrc: string, allowedFiles: string[] = []) {
        this.appSrcs = Array.isArray(appSrc) ? appSrc : [appSrc];
        this.allowedFiles = new Set(allowedFiles);
        this.allowedPaths = [...allowedFiles]
            .map(path.dirname)
            .filter(p => path.relative(p, process.cwd()) !== '');
    }

    apply(resolver: Resolver) {
        const { appSrcs } = this;
        // @ts-ignore
        resolver.hooks.file.tapAsync(
            'ModuleScopePlugin',
            // TODO: Type these when webpack provides them
            (request: any, contextResolver: any, callback: any) => {
                // Unknown issuer, probably webpack internals
                if (!request.context.issuer)
                    return callback();

                // Make sure this request was manual
                if (!request.__innerRequest_request)
                    return callback();

                // If this resolves to a node_module, we don't care what happens next
                if (
                    request.descriptionFileRoot.indexOf('/node_modules/') !== -1 ||
                    request.descriptionFileRoot.indexOf('\\node_modules\\') !== -1
                ) return callback();

                // Resolve the issuer from our src and make sure it's one of our files
                if (
                    appSrcs.every(appSrc => {
                        const relative = path.relative(appSrc, request.context.issuer);
                        // If it's not in one of our app src or a subdirectory, not our request!
                        return relative.startsWith('../') || relative.startsWith('..\\');
                    })
                ) return callback();

                const requestFullPath = path.resolve(
                    path.dirname(request.context.issuer),
                    request.__innerRequest_request
                );

                if (this.allowedFiles.has(requestFullPath))
                    return callback();

                if (this.allowedPaths.some(allowedFile => requestFullPath.startsWith(allowedFile)))
                    return callback();

                // Find path from src to the requested file
                // Error if in a parent directory of all given appSrcs
                if (
                    !appSrcs.every(appSrc => {
                        const requestRelative = path.relative(appSrc, requestFullPath);
                        return (
                            requestRelative.startsWith('../') ||
                            requestRelative.startsWith('..\\')
                        );
                    })
                ) return callback();

                // Else error
                const error = this.getScopeError(request.__innerRequest_request)
                callback(error, request);
            }
        );
    }

    getScopeError(outPath: string) {
        const scopeError = new Error(
            `You attempted to import ${Color.cyan(outPath)} which falls outside of the project ${Color.cyan('src/')} directory. ` +
            os.EOL +
            `Relative imports outside of ${Color.cyan('src/')} are not supported.` +
            os.EOL +
            `You can either move it inside ${Color.cyan('src/')}, or add a symlink to it from project's ${Color.cyan('node_modules/')}.`
        );

        Object.defineProperty(scopeError, '__module_scope_plugin', {
            value: true,
            writable: false,
            enumerable: false,
        });

        return scopeError;
    }
}