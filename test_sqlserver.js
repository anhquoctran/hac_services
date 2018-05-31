const Sequelize = require('sequelize');

var sequelize = new Sequelize({
	dialect: 'mssql',
	dialectModulePath: 'sequelize-msnodesqlv8',
	dialectOptions: {
	  	instanceName: 'SQLEXPRESS',
	  	trustedConnection: true
	},
	host: 'localhost',
	database: 'hac_db',
	operatorsAliases: false,
  });

sequelize.authenticate()
.then(() => {
    console.log("success")
})
.catch(err => {
    console.log(err)
})