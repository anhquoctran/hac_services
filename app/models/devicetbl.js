module.exports = function (sequelize, DataTypes) { 
    return sequelize.define('platetbl', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		description: {
			type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
		},
		device_type: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		is_deleted: {
			type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
		},
		last_update: {
			type: DataTypes.DATE,
            allowNull: true,
            defaultValue: '(getdate())'
		},
		username: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ''
        },
        position_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
  	}, {
		tableName: 'devicetbl', schema: 'hac_db_cloned', timestamps: false
  	});
}