module.exports = function(sequelize, DataTypes) {
  return sequelize.define('platetbl', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		camera_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		frametime: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: '(getdate())'
		},
		encoded_vehicle_image: {
			type: DataTypes.STRING,
			allowNull: false
		},
		encoded_plate_image: {
			type: DataTypes.STRING,
			allowNull: false
		},
		vehicle_plate: {
			type: DataTypes.STRING,
			allowNull: false
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_deleted: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
  	}, {
		tableName: 'platetbl', schema: 'hac_db_cloned', timestamps: false
  	});
};
