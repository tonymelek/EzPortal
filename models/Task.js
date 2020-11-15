const taskFn = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
      foreignKey: {
        name: 'assigned_by',
        allowNull: false,
      },

    });
    Task.belongsTo(models.User, {
      foreignKey: {
        name: 'assigned_to',
        allowNull: false,
      },
    });
Task.belongsTo(models.PreDef, {
      foreignKey: {
        allowNull: false,
      },
    });

  };

  // Associate task to pre_defined_tasks
  Task.associate = (models) => {
    
  };

  return Task;
};

module.exports = taskFn;
