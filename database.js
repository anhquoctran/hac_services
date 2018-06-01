const Sequelize = require('sequelize');
const operatorsAliases = require('./operators')

var sequelize = new Sequelize('hac_db', 'sa', 'anhquoc1996@@', {
	logging: true,
	dialect: 'mssql',
	dialectModulePath: 'sequelize-msnodesqlv8',
	dialectOptions: {
		instanceName: 'SQLEXPRESS',
		trustedConnection: true
	},
	host: 'localhost',
	database: 'hac_db',
	operatorsAliases: operatorsAliases,
});

module.exports = sequelize;