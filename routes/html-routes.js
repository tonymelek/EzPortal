const express = require('express')
const router = express.Router()


///use router instead of app when creating the routes


router.get("/", function (req, res) {
    res.render("index",)
});








module.exports = router