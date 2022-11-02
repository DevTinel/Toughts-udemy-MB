const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    //verificar se o usuario existe
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash('message', 'Usuario não encontrado!');
      res.render('auth/login');
      return;
    }

    //checar se a senha é a mesma do banco

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash('message', 'Senha Inválida!');
      res.render('auth/login');

      return;
    }

    req.session.userid = user.id;
    req.flash('message', 'Autenticação realizada com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
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

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
};
