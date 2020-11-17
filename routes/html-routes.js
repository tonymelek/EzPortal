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
    const dHome = await db.Role.findAll({
        include: [{ model: db.Dept, attributes: ['name'] }],
        group: ['DeptId'],
        attributes: ['DeptId', [db.sequelize.fn('COUNT', 'title'), 'titles']]
    });
    for (item of dHome) {
        item.dataValues.DeptName = item.dataValues.Dept.name
    }
    const dRole = await db.User.findAll({
        include: [{ model: db.Role, attributes: ['title'] }],
        group: ['RoleId'],
        attributes: ['RoleId', [db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    })
    for (item of dRole) {
        item.dataValues.roleT = item.dataValues.Role.title
    }
    const dUser = await db.User.findAll({
        include: [{ model: db.Role, attributes: ['title', 'management_level'] }],
        group: ['management_level'],
        attributes: [[db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    })
    const userSum = []
    console.log(dUser.dataValues)
    for (item of dUser) {
        switch (item.dataValues.Role.management_level) {
            case 100:
                userSum.push({ level: 'Admin', num: item.dataValues.employees })
                break;
            case 2:
                userSum.push({ level: 'Senior', num: item.dataValues.employees })
                break;
            case 1:
                userSum.push({ level: 'Junior', num: item.dataValues.employees })
                break;
            default:
                break;
        }
    }

    const [xtoken, authData] = await checkToken(req.params.token)
    const token = { token: xtoken }
    res.render('admin', { title: "EzPortal | Admin | Departments", admin: authData.user, dHome, dRole, userSum, token })
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


router.get('/counters', (req, res) => {
    // Sample Query to get roles count for each department
    db.User.findAll({
        include: [{ model: db.Role, attributes: ['title'] }],
        group: ['RoleId'],
        attributes: ['RoleId', [db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    }).then(function (tags) {
        res.json(tags)
    });
})
router.get('/counterss', (req, res) => {
    // Sample Query to get roles count for each department
    db.User.findAll({
        include: [{ model: db.Role, attributes: ['title', 'management_level'] }],
        group: ['management_level'],
        attributes: [[db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    }).then(function (tags) {
        res.json(tags)
    });
})

router.get('/manager', (req, res) => {
    res.render('manager')
})





module.exports = router;
