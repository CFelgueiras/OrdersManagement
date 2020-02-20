import { OrderInputDTO } from './../../dto/OderInputDTO';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from '../../services/auth';
import OrderService from '../../services/order';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { OrderDTO } from '../../dto/OrderDTO';

const route = Router();

export default (app: Router) => {
  app.use('/orders', route);

  route.post(
    '/order',

    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
      try {
        const orderServiceInstance = Container.get(OrderService);
        const order = await orderServiceInstance.Create(req.body as OrderInputDTO);
        return res.status(201).json({ order });
      } catch (e) {
        if (e instanceof Error) {
          return res.status(400).send(e.message);
        } else {
          // logger.error('🔥 error: %o', e);
          return next(e);
        }
      }
    },
  );

  route.put(
    '/order/status',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        orderStatus: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
      try {
        const userServiceInstance = Container.get(OrderService);
        const user = await userServiceInstance.UpdateStatus(req.body as OrderDTO);
        return res.status(200).json({ user });
      } catch (e) {
        //logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.put(
    '/order',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        id_product: Joi.string().required(),
        quantity: Joi.number().integer(),
        deliveryDateRequested: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      //logger.debug('Calling Sign-Up endpoint with body: %o', req.body )
      try {
        const userServiceInstance = Container.get(OrderService);
        const user = await userServiceInstance.Update(req.body as OrderDTO);
        return res.status(200).json({ user });
      } catch (e) {
        //logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

};
