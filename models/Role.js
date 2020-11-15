function roleFn (sequelize, DataTypes) {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The Role title should be between 2 and 50 characters',
        },
      },
    },
    hourly_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [20],
          msg: 'All wages should be more than $20/hr',
        },
        max: {
          args: [100],
          msg: 'All wages should be no more than $100/hr',
        },
      },
    },
    management_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Least Managemnt Level is Junior Employee which is assigned Level 1',
        },
        max: {
          args: [100],
          msg: 'The highest managemnt Level is 100 which is granted for IT admin only to create new users',
        },
      },
    },
  },
  );

  // Associate Roles to Department
  Role.associate = function(models) {
    Role.belongsTo(models.Dept, {
      foreignKey: {
        allowNull: false,
      },
    });
    Role.hasMany(models.User,{ onDelete: 'cascade'});
  };
  // Associate Employees to Role
 
  return Role;
};

module.exports = roleFn;
