const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {}

InitUser = sequelize => {
    User.init({
        id: {
          type: DataTypes.INTEGER(9),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        userName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'user_name'
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: '',
          field: 'password'
        },
        firstName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
          field: 'last_name'
        },
        age: {
          type: DataTypes.INTEGER(3).UNSIGNED,
          allowNull: false,
          field: 'age'
        },
        phone: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          field: 'phone'
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
          defaultValue: '',
          field: 'address'
        },
        profileImage: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'profile_image'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date(),
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'updated_at'
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at'
        },
      }, {
        sequelize,
        modelName: 'User',
        tableName: 'users'
    });

    return User;
} 


module.exports = InitUser;