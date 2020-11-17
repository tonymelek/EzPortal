const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { jwtSign, jwtVerify, jwtRefresh } = require('./../middleware/jwt')
const db = require('../models');
const router = express.Router();
const secret = process.env.JWT_SECRET

//Landing Page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'EzPortal | Login'
    })
})
//Admin-Home
router.get('/admin-home/:token', async (req, res) => {
    const roles = await db.Role.findAll()
    const depts = await db.Dept.findAll()
    const users = await db.User.findAll()
    const [xtoken, authData] = await checkToken(req.params.token)
    const token = { token: xtoken }
    res.render('admin', { title: "EzPortal | Admin | Departments", admin: authData.user, depts, roles, users, token })
})
//Admin Departments
router.get('/admin-dept/:token', async (req, res) => {
    const depts = await db.Dept.findAll()
    const [token, authData] = await checkToken(req.params.token)
    res.render('admindepartments', { title: "EzPortal | Admin | Departments", admin: authData.user, depts, token })
})
//Admin Roles
router.get('/admin-role/:token', async (req, res) => {
    const roles = await db.Role.findAll()
    const depts = await db.Dept.findAll()
    const [token, authData] = await checkToken(req.params.token)
    res.render('adminroles', { title: "EzPortal | Admin | Roles", admin: authData.user, roles, depts, token })
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






//Dummy Activity
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

router.get('/manager', (req, res) => {
    res.render('manager')
})





module.exports = router;
