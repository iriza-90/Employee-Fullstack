'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Employee.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    position: DataTypes.STRING,
    salary: {
      type: DataTypes.FLOAT,
      validate: { min: 0 }
    },
    hireDate: DataTypes.DATE,

    //  Add userId to track ownership
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });

  return Employee;
};
