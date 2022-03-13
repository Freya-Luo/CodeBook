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

/**
 * This plugin overwrites the ESBuild default default onLoad() => loading this file functions.
 * @param inputCode user inpu code string
 * @returns customized plugin instance to fetch modules
 */
export const fetchFilePlugin = (inputCode: string) => {
  return {
    name: 'fetch-file-plugin',
    setup(build: esbuild.PluginBuild) {
      // load 1st time entry point file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        }
      })
      // load css files
      build.onLoad({ filter: /(\.css$)/ }, async (args: esbuild.OnLoadArgs) => {
        // check if cached file exists
        const cachedRes = await cache.getItem<esbuild.OnLoadResult>(args.path)
        if (cachedRes) return cachedRes
        // if not, fetch from CDN
        const { data, request } = await axios.get(args.path)
        const normalizeData = data.replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '')
        const contents = `
            const style = document.createElement('style')
            style.innerText = '${normalizeData}'
            document.head.appendChild(style)
        `
        const res: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname, // add path of where we were redirected to for the next nested pkg
        }
        // cache the pkgs
        await cache.setItem(args.path, res)
        return res
      })

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // check if the pkgs have been already in the cache
        // if yes, fetch data from the cache
        const cachedRes = await cache.getItem<esbuild.OnLoadResult>(args.path)
        if (cachedRes) return cachedRes

        // else fetch from the unpkg server
        const { data, request } = await axios.get(args.path)
        const res: esbuild.OnLoadResult = {
          loader: 'jsx',
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
