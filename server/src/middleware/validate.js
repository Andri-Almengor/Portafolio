import { HttpError } from '../utils/http-error.js';

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return next(
      new HttpError(400, 'Los datos enviados no son válidos.', 'VALIDATION_ERROR', result.error.flatten())
    );
  }
  req[source] = result.data;
  return next();
};
