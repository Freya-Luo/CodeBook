import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const runServe = (port: number, filename: string, dir: string) => {
  const app = express();
  // load up the react app
  // default request navigating to the local react app in the active development env (creat-react-app server running)
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3000',
      ws: true, // websocket enabled
      logLevel: 'silent',
    })
  );

  return new Promise<void>((resolve, reject) => {
    app
      .listen(port, () => {
        console.log('Server is listening on port: ' + port);
        resolve();
      })
      .on('error', reject);
  });
};
