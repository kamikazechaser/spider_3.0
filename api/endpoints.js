/**
 * Spider Task 3
 * Mohamed Sohail
 */

const gBooks = require("../lib/gbooks");
const sqlDb = require("../lib/sqldb");
const models = require("../models");

const Review = models.Review;
const Status = models.Status;
const Library = models.Library;
const Favourite = models.Favourite;
const User = models.User;

exports = module.exports = {
    getBookController: (req, res) => {
        if (req.isAuthenticated()) {
            gBooks.getBook(req.params.id, (error, book) => {
                if (!error) {
                    sqlDb.getReviews(req.params.id, reviews => {
                        const ctx = {
                            book: book,
                            review: reviews
                        }
                        return res.render("book.ejs", { prefetch: ctx });
                    });
                } else {
                    return res.status(500).json({ error: error });
                }
            });
        } else {
            res.redirect("/signin");
        }
    },

    newReviewController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        const reviewObject = {
            title: req.body.title,
            content: req.body.content,
            book: refererUrl,
            name: req.user.name,
            userid: req.user.id
        }

        return Review.create(reviewObject).then((createdReview, created) => {
            sqlDb.createLog(req.user.id, "Reviewed", "a book", req.header("Referer"));
            if (!createdReview) return res.status(500).json({ error: "Couldn't create review" });
            if (createdReview) return res.redirect("back");
        });
    },

    newRatingController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        const ratingObject = {
            book: refererUrl,
            userid: req.user.id,
            rating: req.body.rating
        }

        sqlDb.upsertStatus(ratingObject, { userid: req.user.id, book: refererUrl }).then(result => {
            sqlDb.createLog(req.user.id, "Rated", req.body.title, req.body.rating);
            return res.redirect("back");
        });
    },

    newStatusController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        const statusObject = {
            book: refererUrl,
            userid: req.user.id,
            read: req.body.status,
            title: req.body.title
        }

        sqlDb.upsertStatus(statusObject, { userid: req.user.id, book: refererUrl }).then(result => {
            sqlDb.createLog(req.user.id, req.body.status, req.body.title, null);
            return res.redirect("back");
        });
    },

    getBookStatusController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        Status.findAll({ raw: true, where: { userid: req.user.id, book: refererUrl }}).then(status => {
            res.status(200).json(status);
        });
    },

    newLibraryController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        const libraryObject = {
            book: refererUrl,
            userid: req.user.id,
            title: req.body.title
        }

        return Library.create(libraryObject).then((createdLibrary, created) => {
            sqlDb.createLog(req.user.id, "Added", req.body.title, "Library");
            if (createdLibrary) return res.redirect("back");
        }).catch(error => {
            res.status(409).json({ message: "Already in Library" });
        })
    },

    newFavouriteController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }

        const refererUrl = req.header("Referer").split("/").pop();

        const favouriteObject = {
            book: refererUrl,
            userid: req.user.id,
            title: req.body.title
        }

        return Favourite.create(favouriteObject).then((createdFavourite, created) => {
            sqlDb.createLog(req.user.id, "Added", req.body.title, "Favourites");
            if (createdFavourite) return res.redirect("back");
        }).catch(error => {
            res.status(409).json({ message: "Already in Favourites" });
        });
    },

    profileVisibilityController: (req, res) => {
        if (req.user === undefined) {
            return res.redirect("/signin");
        }
        if (req.body.visibility === "true") {
            return User.update({ visible: false }, { where: { id: req.user.id }}).then(ctx => {
                return res.redirect("back");
            });
        } else {
            return User.update({ visible: true }, { where: { id: req.user.id }}).then(ctx => {
                return res.redirect("back");
            });
        }
    }
}