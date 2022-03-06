import * as esbuild from 'esbuild-wasm'
import axios from 'axios'

// ESbuild will repeat the onResolve & onLoad processed once
// it sees "import/require/exports" statements
// => filter for different types of files;
// => namespace for separating 2 process for differ files
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        // auto called by ESBuild with "build" arg  (represent the whole bundling process )
        setup(build: esbuild.PluginBuild) {
            // overwrite the ESBuild default onResolve() => find out the file path
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (args.path === 'index.js') {
                    return { path: args.path, namespace: 'a' }
                }
                // fetch from unpkg public CDN
                // fetch the main file (entry point) of the package

                const configURL = `https://unpkg.com/${args.path}`
                return {
                    path: configURL,
                    namespace: 'a',
                }
                // else fetch other files
            })
            // overwrite the ESBuild default onLoad() => loading this file
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args)

                // 1st time entry point file
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            import message from './message';
                            console.log(message);
                        `,
                    }
                }
                // dependent packages
                const { data } = await axios.get(args.path)
                return {
                    loader: 'jsx',
                    contents: data,
                }
            })
        },
    }
}
