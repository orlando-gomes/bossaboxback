import 'dotenv/config';

export default {
  generator: process.env.APP_GENERATOR,
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
