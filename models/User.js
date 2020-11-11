const User_fn = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'The first name should be between 2 and 50 characters'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'The last name should be between 2 and 50 characters'
                }
            }
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [11, 11],
                    msg: 'The mobile number should be exactly 11 characters'
                }
            }
        },
        office_number: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
        {
            freezeTableName: true
        }
    );

    //Associate users to role
    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: {
                allowNull: false
            }
        })
    }
    //Associate Employees to Tasks 
    User.associate = (models) => {
        User.hasMany(models.Task, {
            foreignKey: {
                name: 'assigned_by',
                allowNull: false
            }
        });
        User.hasMany(models.Task, {
            foreignKey: {
                name: 'assigned_to',
                allowNull: false
            }
        })
    }
    //Associate Employees to Time Sheets
    // User.associate = (models) => {
    //     User.hasMany(models.TSheet)
    // }


    return User
}

module.exports = User_fn