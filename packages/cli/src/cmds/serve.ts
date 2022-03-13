import path from 'path';
import { Command } from 'commander';
import { runServe } from 'local-server';

export const serveCmd = new Command()
  .command('serve [filename]')
  .description('start the code book application')
  .option('-p, --port <number>', 'port to run the server on', '8017')
  .action((filename = 'coolbook.js', options: { port: string }) => {
    const dir = path.join(process.cwd(), path.dirname(filename));
    runServe(parseInt(options.port), path.basename(filename), dir);
  });
