/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("Review", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        content: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        book: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return Review;
};