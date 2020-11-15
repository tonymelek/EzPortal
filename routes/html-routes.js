const express = require('express');

router.get('/', (req, res) => {
    res.render('index', {
        title: 'EzPortal | Login'
    })
})

router.get('/admin', (req, res) => {
    res.render('admin', {
    })
}
)
const router = express.Router();

module.exports = router;
