import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const userExists = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!(await userExists.checkPassword(req.body.password))) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      const { id, name, email, avatar_name } = userExists;

      const token = jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      return res.status(201).json({
        user: {
          id,
          name,
          email,
          avatar_name,
        },
        token,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SessionController();
