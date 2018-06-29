/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("Status", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rating: {
            type: Sequelize.STRING,
            notEmpty: false
        },
        read: {
            type: Sequelize.STRING,
            notEmpty: false
        },
        book: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return Status;
};