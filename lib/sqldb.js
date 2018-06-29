/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = {
    upsertStatus,
    getReviews,
    getUserDetails,
    createLog
}

const models = require("../models");
const User = models.User;
const Status = models.Status;
const Review = models.Review;
const Library = models.Library;
const Favourite = models.Favourite;
const Log = models.Log;

function upsertStatus(values, condition) {
    return Status.findOne({ where: condition }).then(ctx => {
        if (ctx) {
            return ctx.update(values);
        } else {
            return Status.create(values);
        }
    })
}

function getReviews(bookid, callback) {
    Review.findAll({ raw: true, where: { book: bookid }}).then(reviews => {
        return callback(reviews);
    });
}

function getUserDetails(userId, callback) {
    Status.findAll({
        where: {
            read: "Currently Reading",
            userid: userId
        }
    }).then(status => {
        Library.findAll({
            where: {
                userid: userId
            }
        }).then(library => {
            Favourite.findAll({
                where: {
                    userid: userId
                }
            }).then(favourite => {
                User.findOne({
                    where: {
                        id: userId
                    }
                }).then(user => {
                    Log.findAll({
                        where: {
                            userid: userId
                        },
                        order: [
                            ["id", "DESC"]
                        ]
                    }).then(logs => {
                        const object = {
                            user: user,
                            status: status,
                            library: library,
                            favourite: favourite,
                            logs: logs
                        }
                        return callback(object);
                    })
                });
            });
        });
    })
}

function createLog(userId, action, book, value) {
    const logObject = {
        userid: userId,
        action: action,
        book: book,
        value: value
    }

    return Log.create(logObject)
}