/**
 * Spider Task 3
 * Mohamed Sohail
 */

exports = module.exports = {
    getRecommendedBooks,
    getBook
}

const request = require("request-promise");

function getRecommendedBooks(callback) {
    const options = {
        method: "GET",
        // My personal favourites :)
        uri: "https://www.googleapis.com/books/v1/users/103219277255719434391/bookshelves/0/volumes",
        json: true
    }

    return request(options).then(ctx => {

        for (let i = 0; i < ctx.items.length; i++) {
            ctx.items[i].volumeInfo.imageLinks.thumbnail = ctx.items[i].volumeInfo.imageLinks.thumbnail.replace(/zoom=1/gm, "zoom=2");
        }
        return callback(null, ctx);
    }).catch(error => {
        return callback(error);
    });
}

function getBook(id, callback) {
    const options = {
        method: "GET",
        uri: `https://www.googleapis.com/books/v1/volumes/${id}`,
        json: true
    }

    return request(options).then(ctx => {
        ctx.volumeInfo.imageLinks.thumbnail = ctx.volumeInfo.imageLinks.thumbnail.replace(/zoom=1/gm, "zoom=2");
        return callback(null, ctx);
    }).catch(error => {
        return callback(error);
    });
}