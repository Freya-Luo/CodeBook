import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  cellype: 'CODE' | 'MARKDOWN';
}

export const cellRouter = (filename: string, dir: string) => {
  const router = express.Router();
  const filepath = path.join(dir, filename);
  router.use(express.json()); // add body-parsing middleware to get request.body

  /**
   * This router provides an API that gets the file and extract a list of cells out of it.
   * If the file does not exist, create it and set up the default content;
   * otherwise just directly parse the file.
   */
  router.get('/cells', async (request, response) => {
    try {
      const res = await fs.readFile(filepath, { encoding: 'utf-8' });

      response.send(JSON.parse(res));
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.log(err.message);
      } else {
        await fs.writeFile(filepath, '[]', 'utf-8');
        response.send([]);
      }
    }
  });

  /**
   * This router provides an API that writes any updates back to the file.
   * If the file does not exist, it will be created automatically.
   */
  router.post('/cells', async (request, response) => {
    const { cells }: { cells: Cell[] } = request.body;

    await fs.writeFile(filepath, JSON.stringify(cells), 'utf-8');

    response.send({ status: 'success' });
  });

  return router;
};
