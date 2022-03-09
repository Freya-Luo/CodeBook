/**
 * This is a customized plugin for fetching NPM dependencies.
 * It supports both CommonJS and ES6 Modules syntax.
 *
 * ESbuild will repeat the onResolve & onLoad processed once it sees "import/require/exports" statements.
 * 1) "filter" - for different types of files;
 * 2) "namespace" - for separating 2 process for differ files
 *
 */
import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localforage from 'localforage'

const cache = localforage.createInstance({
    name: 'pkg-cache',
})

const pluginOnResolve = async (args: any) => {
    if (args.path === 'index.js') {
        return { path: args.path, namespace: 'a' }
    }
    // fetch from unpkg public CDN
    let configURL
    if (args.path.includes('./') || args.path.includes('../')) {
        // fetch fetch other files
        configURL = new URL(
            args.path,
            'https://unpkg.com' + args.resolveDir + '/' // trailing '/' to avoid merging last part
        ).href
    } else {
        // fetch the main file (entry point) of the package
        configURL = `https://unpkg.com/${args.path}`
    }
    return {
        path: configURL,
        namespace: 'a',
    }
}

export const unpkgPathPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-path-plugin',
        // auto called by ESBuild with "build" arg  (represent the whole bundling process )
        setup(build: esbuild.PluginBuild) {
            // overwrite the ESBuild default onResolve() => find out the file path
            build.onResolve({ filter: /.*/ }, pluginOnResolve)

            // overwrite the ESBuild default onLoad() => loading this file
            build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
                let res: esbuild.OnLoadResult | null
                // 1st time entry point file
                if (args.path === 'index.js') {
                    res = {
                        loader: 'jsx',
                        contents: inputCode,
                    }
                    return res
                }
                // check if the pkgs have been already in the cache
                // if yes, fetch data from the cache
                const cachedRes = await cache.getItem<esbuild.OnLoadResult>(args.path)
                if (cachedRes) return cachedRes

                // else fetch from the unpkg server
                const { data, request } = await axios.get(args.path)
                res = {
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname, // add path of where we were redirected to for the next nested pkg
                }
                // cache the pkgs
                await cache.setItem(args.path, res)
                return res
            })
        },
    }
}
