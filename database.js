const Sequelize = require('sequelize');

var sequelize = new Sequelize('hac_db', 'sa', '@Hueic2018', {
	logging: true,
	dialect: 'mssql',
	dialectModulePath: 'sequelize-msnodesqlv8',
	host: '127.0.0.1',
	database: 'hac_db',
	operatorsAliases: false,
});

module.exports = sequelize;