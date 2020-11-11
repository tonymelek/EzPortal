const PreDefined = (sequelize, DataTypes) => {
    const PreDef = sequelize.define("PreDef", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 150],
                    msg: 'The Department name should be between 2 and 150 characters'
                }
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 500],
                    msg: 'The Department name should be between 2 and 500 characters'
                }
            }
        }

    },
        {
            freezeTableName: true
        }
    );
    PreDef.associate = (models) => {
        //Associate tasks to pre-defined task
        PreDef.hasMany(models.Task);
    }
    return PreDef
}

module.exports = PreDefined