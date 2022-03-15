import { program } from 'commander';
import { serveCmd } from './cmds/serve';

// add customized cmd interface
program.addCommand(serveCmd);

program.parse(process.argv);
