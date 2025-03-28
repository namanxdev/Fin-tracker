import { ExpressError } from '../utils/ErrorHandler.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(el => el.message).join(',');
      throw new ExpressError(message, 400);
    } else {
      next();
    }
  };
};