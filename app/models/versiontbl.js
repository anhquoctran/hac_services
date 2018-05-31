/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('versiontbl', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latest: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '((0))'
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'versiontbl', schema: "hac_db_cloned", timestamps: false
  });
};
