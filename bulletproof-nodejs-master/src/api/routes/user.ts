import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import UserService from '../../services/user';
import { UserDTO } from '../../dto/UserDTO';

const route = Router();


export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });

  route.get('/user/:id', async (req: Request, res: Response) => {
    try {
      const userServiceInstance = Container.get(UserService);
      const user = await userServiceInstance.FindById(req.params.id);
      return res.status(200).json({ user });
    } catch (e) {
     // logger.error('🔥 error: %o', e);
      return e;
    }
  });

  route.put(
    '/me',
    middlewares.isAuth,
    middlewares.isClient,
    celebrate({
      body: Joi.object({
        role: Joi.string().required(),
        _id: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
      try {
        const userServiceInstance = Container.get(UserService);
        const user = await userServiceInstance.Update(req.body as UserDTO);
        return res.status(200).json({ user });
      } catch (e) {
        //logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
