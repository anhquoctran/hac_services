const Sequelize = require('sequelize');
const operatorsAliases = require('./operators')

var sequelize = new Sequelize('hac_db', 'sa', 'anhquoc1996@@', {
	logging: false,
	dialect: 'mssql',
	dialectModulePath: 'sequelize-msnodesqlv8',
	host: '127.0.0.1',
	database: 'hac_db',
	operatorsAliases: operatorsAliases,
});

module.exports = sequelize;