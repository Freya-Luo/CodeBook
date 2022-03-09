/**
 * This is a customized plugin for figuring out NPM modules' path.
 *
 * ESbuild will repeat the onResolve & onLoad processed once it sees "import/require/exports" statements.
 * 1) "filter" - for different types of files;
 * 2) "namespace" - for separating 2 process for differ files
 *
 */
import * as esbuild from 'esbuild-wasm'

// This function overwrites the ESBuild default onResolve() => find out the file path
// The setup() is auto called by ESBuild with "build" arg  (represent the whole bundling process )
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // resolve index.js file
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return { path: 'index.js', namespace: 'a' }
            })
            // resolve relative/dependent pkgs(files) whose path starts with "./" or "../"
            build.onResolve({ filter: /^\.+\// }, async (args: any) => {
                return {
                    path: new URL(
                        args.path,
                        'https://unpkg.com' + args.resolveDir + '/' // trailing '/' to avoid merging last part
                    ).href,
                    namespace: 'a',
                }
            })
            // resolve 1st level(parent) pkg
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: 'a',
                }
            })
        },
    }
}
