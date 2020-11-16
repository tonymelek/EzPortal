const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { jwtSign, jwtVerify, jwtRefresh } = require('./../middleware/jwt')
const db = require('../models');
const router = express.Router();
const secret = process.env.JWT_SECRET

router.get('/', (req, res) => {
    res.render('index', {
        title: 'EzPortal | Login'
    })
})
//Check Token
const checkToken = async (token) => {
    let authData;
    let newToken = token;
    try {
        authData = await jwtVerify(token, secret);
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            newToken = jwtRefresh(token, '15m')
            authData = await jwtVerify(newToken, secret);
        }
    }
    return [newToken, authData]
}


//Home page Lander
router.get('/lander/:token', async (req, res) => {
    const [newToken, authData] = await checkToken(req.params.token)
    switch (authData.user.Role.management_level) {
        case 100:
            const roles = await db.Role.findAll()
            const depts = await db.Dept.findAll()
            const users = await db.User.findAll()
            // console.log(roles[0].dataValues);
            res.status(200).render('admin', { title: "EzPortal | Admin", admin: authData.user, roles, depts, users });
            break;
        case 1:

        default:
            break;
    }
})
router.get('/counter', (req, res) => {
    // Sample Query to get roles count for each department
    db.Role.findAll({
        include: [{ model: db.Dept, attributes: ['name'] }],
        group: ['DeptId'],
        attributes: ['DeptId', [db.sequelize.fn('COUNT', 'title'), 'titles']],
    }).then(function (tags) {
        res.json(tags)
    });
})




module.exports = router;
