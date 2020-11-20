const taskFn = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // Associate task to user assigned_by
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      as: "assigned_by",
      foreignKey: {
        name: "assignedby"
      },

    });
    Task.belongsTo(models.User, {
      as: "assigned_to",
      foreignKey: {
        name: "assignedto"
      },
    });
    // Associate task to pre_defined_tasks
    Task.belongsTo(models.PreDef, {
      foreignKey: {
        allowNull: false,
      },
    });

  };




  return Task;
};

module.exports = taskFn;
