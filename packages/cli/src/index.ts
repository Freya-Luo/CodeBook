import { program } from 'commander';
import { serveCmd } from './cmds/serve';

program.addCommand(serveCmd);

program.parse(process.argv);
