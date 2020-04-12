import { RequestHandler } from 'express';
import { ObjectID } from 'mongodb';
import { Models } from '../models';
import logger from '../logger';
import STRINGS from '../../client/assets/strings.json';

export const UnsubscribeHandler = (models: Models): RequestHandler => {
	return async (req, res) => {
		if (req.query.id) {
			logger.info(`Unsubscribing ${req.query.id} from emails...`);
			models.Hackers.findOneAndUpdate(
				{ _id: ObjectID.createFromHexString(req.query.id) },
				{ $set: { emailUnsubscribed: true } }
			)
				.then(response => {
					logger.info('Unsubscribed user from emails', response);
					return res.redirect(301, STRINGS.HACKATHON_WEBSITE);
				})
				.catch(logger.error);
		} else {
			res.sendStatus(400);
			res.end();
		}
	};
};

export default { UnsubscribeHandler };
