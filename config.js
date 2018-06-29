/**
 * Spider Task 2
 * Mohamed Sohail
 */

exports = module.exports = {
    server: {
        port: 3000
    },
    session: {
        secret: "aRandomLongStringToBeStoredAsEnvVariable",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 21600000
        }
    }
}