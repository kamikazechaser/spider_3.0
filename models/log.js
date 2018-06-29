/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define("Log", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        action: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        book: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        value: {
            type: Sequelize.STRING,
            notEmpty: false
        },
        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return Log;
};