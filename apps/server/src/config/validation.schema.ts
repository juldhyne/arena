import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // JWT
  JWT_SECRET: Joi.string().min(10).required(),

  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_WEB_API_KEY: Joi.string().required(),
});
