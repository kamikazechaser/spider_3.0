/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = (sequelize, Sequelize) => {
    const Favourite = sequelize.define("Favourite", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        book: {
            type: Sequelize.STRING,
            notEmpty: true,
            unique: true
        },
        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true
        }
    });

    return Favourite;
};