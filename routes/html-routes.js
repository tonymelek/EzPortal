const express = require('express')
const router = express.Router()


///use router instead of app when creating the routes



router.get('/', (req, res) => {
    res.render('index', {
        title: 'EzPortal | Login'
    })
})








module.exports = router