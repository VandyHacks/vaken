import { Response, Request } from 'express';

export let createUser = async (_: Request, res: Response) => {
  res.send('stub to create user');
};
