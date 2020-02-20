import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import order from './routes/order';
import agendash from './routes/agendash';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	order(app);

	return app
}