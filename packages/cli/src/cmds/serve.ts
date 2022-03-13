import path from 'path';
import { Command } from 'commander';
import { runServe } from 'local-server';

// right before deploying, set the NODE_ENV to 'production'
const isProduction = process.env.NODE_ENV === 'production';

export const serveCmd = new Command()
  .command('serve [filename]')
  .description('start the code book application')
  .option('-p, --port <number>', 'port to run the server on', '8017')
  .action(async (filename = 'coolbook.js', options: { port: string }) => {
    const dir = path.join(process.cwd(), path.dirname(filename));
    // catch any possible errors
    // listening on a port is an asyn operation
    try {
      await runServe(parseInt(options.port), path.basename(filename), dir, !isProduction);
      console.log(`
        Opened ${filename}. Run on Local: http://localhost:${options.port}.
      `);
    } catch (err: any) {
      console.log(err.message);
      process.exit(1);
    }
  });
