import { Response, Request } from 'express';
// import UserController from '../controllers/UserController'

const createUser = async (_: Request, res: Response) => {
  // UserController.
  res.send('create user');
};

const deleteUser = async (_: Request, res: Response) => {
  res.send('delete user');
};
const updateUser = async (_: Request, res: Response) => {
  res.send('update user');
};
const listUser = async (_: Request, res: Response) => {
  res.send('list user');
};

export { createUser, deleteUser, listUser, updateUser };
