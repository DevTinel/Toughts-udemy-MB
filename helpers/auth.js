//Caso usuario nao esteja logado essa funcao levara ele para a barra de login

module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid;

  if (!userId) {
    res.redirect('/login');
  }
  next();
};
