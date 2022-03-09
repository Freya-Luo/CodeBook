/**
 * This is a customized plugin for loading NPM modules.
 * It supports both CommonJS and ES6 Modules syntax.
 */
import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localforage from 'localforage'

const cache = localforage.createInstance({
    name: 'pkg-cache',
})

// This function overwrites the ESBuild default default onLoad() => loading this file functions.
export const fetchFilePlugin = (inputCode: string) => {
    return {
        name: 'fetch-file-plugin',
        setup(build: esbuild.PluginBuild) {
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
