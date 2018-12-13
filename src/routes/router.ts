import { Response, Request, Router } from 'express';
import * as apiController from './Api';
import { createUser, deleteUser, updateUser, listUser } from './UserRoutes';

const router: Router = Router();

router.get('/api', apiController.getApi);

router.post('/user/create', createUser);
router.post('/user/delete', deleteUser);
router.post('/user/update', updateUser);
router.get('/user/list', listUser);

router.get('/', async (_: Request, res: Response) => {
  res.send('hello world');
});

export default router;
