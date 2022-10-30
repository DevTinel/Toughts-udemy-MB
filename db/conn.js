const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', 'chocolattra123', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  sequelize.authenticate();
  console.log('conectamos ao MySql');
} catch (err) {
  console.log(`Não foi possivel conectar ao banco: ${err}`);
}

module.exports = sequelize;
