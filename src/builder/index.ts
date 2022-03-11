import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path'
import { fetchFilePlugin } from './plugins/fetch-file'

let service: esbuild.Service

/**
 * This function works as a builder (transpiles and bundles) of the input raw code.
 * It pass the input code to the ESBuild service and generates the bundled code.
 *
 * @param inputCode the string literal of user input raw code
 * @returns bundled code
 */
const Builder = async (inputCode: string) => {
  if (!service) {
    // initialize the ESBuild
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  // get the builder (combined transpiler & bundler) from ESBuild
  const builder = service.build
  try {
    const res = await builder({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchFilePlugin(inputCode)],
      define: {
        'process.env.NODE_ENV': '"production"', // to get the string 'production' not a var
        global: 'window',
      },
    })
    // return the transpiled and bundled code
    return {
      code: res.outputFiles[0].text,
      err: '',
    }
  } catch (error: any) {
    return {
      code: '',
      err: error.message,
    }
  }
}

export default Builder
