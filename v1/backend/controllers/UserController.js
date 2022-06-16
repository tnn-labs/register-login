const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório' });
      return;
    }

    if (!email) {
      res.status(422).json({ message: 'O email é obrigatório.' });
      return;
    }

    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória.' });
      return;
    }

    if (!confirmPassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais.' });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({ message: 'Por favorm utilize outro e-mail.' });
      return;
    }

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create a user
    const user = new User({
      name,
      email,
      password: passwordHash
    });

    try {
      const newUser = await user.save();
      res.status(201).json({
        message: 'Usuário criado!',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }  
}