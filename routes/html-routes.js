const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { jwtSign, jwtVerify } = require('./../middleware/jwt')
const db = require('../models');
const router = express.Router();
const secret = process.env.JWT_SECRET

router.get('/', (req, res) => {
    res.render('index', {
        title: 'EzPortal | Login'
    })
})

// router.get('/admin/:id', verifyToken, async (req, res) => {
//     try {
//         const admin = await db.User.findOne({ where: { id: req.params.id } })
//         console.log(admin);
//           res.render('admin', { "admin": admin.dataValues })
//     }
//     catch (err) {
//         res.status(403).json({ msg: "Unauthorized Access" })
//     }
// })

// router.get('/admin/:id', async (req, res) => {
//     console.log('I came here');
//     try {
//         const admin = await db.User.findOne({ where: { id: req.params.id } })
//         console.log(admin.dataValues);
//         res.render('admin', { "admin": admin.dataValues })
//     }
//     catch (err) {
//         res.status(403).json({ msg: "Unauthorized Access" })
//     }
// })


//Home page Lander
router.get('/lander/:token', async (req, res) => {
    console.log('I came here');
    const authData = await jwtVerify(req.params.token, secret);
    switch (authData.user.Role.management_level) {
        case 100:
            console.log(authData.user);
            res.status(200).render('admin', { title: "EzPortal | Admin", admin: authData.user });
            break;
        case 1:

        default:
            break;
    }
})

router.get('/admin', (req, res) => {
    res.render('admin')
})



module.exports = router;
