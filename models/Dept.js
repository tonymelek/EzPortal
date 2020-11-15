function Department(sequelize, DataTypes) {
  const Dept = sequelize.define('Dept', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'The Department name should be between 2 and 50 characters',
        },
      },
    },
  });
  Dept.associate = (models) => {
    // Associate roles to department
    Dept.hasMany(models.Role);
  };
  return Dept;
}

module.exports = Department;
