/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usertbl', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    id_faculty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_group: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_room: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id_tariff: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: 'GETDATE()'
    },
    idnumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    fullnameEN: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '(NULL)'
    },
    account: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: "IMAGE",
      allowNull: true,
      defaultValue: null
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'GETDATE()'
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    vehicletype: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    vehiclenumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    vehiclecost: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    vehicledescription: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    starttime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    endtime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    supportdevices: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '(NULL)'
    },
    availableTimes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '((0))'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cardid_print: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'usertbl', schema: 'hac_db_cloned', timestamps: false
  });
};
