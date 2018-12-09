import { Response, Request } from 'express';

/**
 * GET /api
 * List of API examples.
 */
export let getApi = (_: Request, res: Response) => {
  res.send('api is here!');
};
