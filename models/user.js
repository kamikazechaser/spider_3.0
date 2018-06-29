/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        visible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });

    return User;
};