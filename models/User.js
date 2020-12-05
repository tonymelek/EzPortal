function userFn(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "The first name should be between 2 and 50 characters",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "The last name should be between 2 and 50 characters",
        },
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validatePhone: function (value) {
          value = "0" + value
          if (!/^0(4)\d{8}$/.test(value)) {
            throw new Error('phone format error!')
          }
        }
      }
      // validate: {
      //   len: {
      //     args: [10, 10],
      //     msg: "The mobile number should be exactly 10 characters",
      //   },
      // },

    },
    office_number: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  );

  // Associate users to role
  User.associate = function (models) {
    User.belongsTo(models.Role, {
      foreignKey: {
        allowNull: false,
      },
    });
    // Associate Employees to Tasks
    User.hasMany(models.Task, {
      as: "assigned_by",
      foreignKey: {
        name: "assignedby",
        allowNull: false
      },
    });
    User.hasMany(models.Task, {
      as: "assigned_to",
      foreignKey: {
        name: "assignedto",
        allowNull: false
      },
    });
  };


  // Associate Employees to Time Sheets
  // User.associate = (models) => {
  //     User.hasMany(models.TSheet)
  // }
  return User;
}

module.exports = userFn;
