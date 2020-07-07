import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schemaNameEmail = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
    });

    const schemaPassword = Yup.object().shape({
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schemaNameEmail.isValid(req.body))) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (!(await schemaPassword.isValid(req.body))) {
      return res.status(400).json({
        error: 'Password is required and must be at least 6 digits long',
      });
    }

    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Email has been already used' });
    }

    const { id, name, email, avatar_name } = await User.create(req.body);

    return res.status(201).json({ id, name, email, avatar_name });
  }

  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'avatar_name'],
    });

    return res.json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { id, name, email, avatar_name } = user;

    return res.json({ id, name, email, avatar_name });
  }

  async update(req, res) {
    if (Number(req.params.id) !== Number(req.userId)) {
      return res.status(400).json('Invalid id');
    }

    const schemaNameEmail = Yup.object().shape({
      name: Yup.string().min(2),
      email: Yup.string()
        .email()
        .min(2),
    });

    const schemaPassword = Yup.object().shape({
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schemaNameEmail.isValid(req.body))) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    if (!(await schemaPassword.isValid(req.body))) {
      return res.status(400).json({ error: "Password's validation failed" });
    }

    const user = await User.findByPk(req.params.id);

    const passwordToCheck = req.body.oldPassword
      ? req.body.oldPassword
      : req.body.password;

    if (!(await user.checkPassword(passwordToCheck))) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (
      req.body.email &&
      !(user.email === req.body.email) &&
      (await User.findOne({ where: { email: req.body.email } }))
    ) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const { id, name, email, avatar_name } = await user.update(req.body);

    return res.json({ id, name, email, avatar_name });
  }
}

export default new UserController();
