/**
 * Spider Task 3
 * Mohamed Sohail
 */

const db = {};
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const sequelize = new Sequelize("db", null, null, {
    dialect: "sqlite",
    storage: "db.sqlite",
    logging: false
});

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
}).forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        return db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

exports = module.exports = db;