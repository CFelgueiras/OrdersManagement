import jwt from 'express-jwt';
import config from '../../config';
import {Container} from "typedi";
import jwt_decode from 'jwt-decode';

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
const getTokenFromHeader = (req: any) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return '';
};
const isClient = (req: any, res: any, next: any) => {
  const Logger = Container.get('logger');
  try {
    const token = getTokenFromHeader;
    const { _id, role, name, exp, iat } = jwt_decode(token.toString());

    if (role !== 'user') {
      return res.sendStatus(403);
    }
    return next();
  } catch (e) {
    // Logger.error('🔥 Error attaching user to req: %o', e);
    return res.sendStatus(500);
  }
};

export default isClient;
