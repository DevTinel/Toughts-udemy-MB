const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }
  static register(req, res) {
    res.render('auth/register');
  }
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    //verificando se as senhas conferem
    if (password != confirmpassword) {
      req.flash('message', 'As senhas não conferem!');
      res.render('auth/register');

      return;
    }
    //checar se o email ja existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash('message', 'O email ja está cadastrado!');
      res.render('auth/register');
    }
    //criar senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = {
      name,
      email,
      password: hashedPassword,
    };
    try {
      const createdUser = await User.create(user);
      //logar o usuario assim que for cadastrado
      req.session.userid = createdUser.id;
      req.session.save(() => {
        res.redirect('/');
      });

      req.flash('message', 'Cadastro realizao com sucesso');
    } catch (err) {
      console.log(err);
    }
  }
};
