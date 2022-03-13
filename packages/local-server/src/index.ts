import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { cellRouter } from './routes/cells';
import path from 'path';

export const runServe = (port: number, filename: string, dir: string, isDevelopment: boolean) => {
  const app = express();

  // build up the router for fetching and updating files that store the cells info
  app.use(cellRouter(filename, dir));

  // default request to load up the React App (if no router matches, fall back here)
  /**
   * Serve the static built react project by linking with lerna.
   * "../node_modules/coolbook/build" is a shortcut/symbolic link (not the real
   * copy of the "cookbook/build/") in the development env, which is not supported by the express.
   * But in the production mode, "../node_modules/coolbook/build" is a real path link.
   *
   * So, to correctly start up the app both in the development and production env,
   * the actual path to the "build/" folder on the local machine can be resolved with require.resolve()
   */
  if (!isDevelopment) {
    const pkgPath = require.resolve('coolbook/build/index.html');
    app.use(express.static(path.dirname(pkgPath)));
  } else {
    // navigate to the local react app in the active development env
    // using proxy (creat-react-app server running)
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true, // websocket enabled
        logLevel: 'silent',
      })
    );
  }

  return new Promise<void>((resolve, reject) => {
    app
      .listen(port, () => {
        console.log('Server is listening on port: ' + port);
        resolve();
      })
      .on('error', reject);
  });
};
