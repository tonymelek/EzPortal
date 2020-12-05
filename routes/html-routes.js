//Dependencies
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
    const rolesPerDept = await db.Role.findAll({
        include: [{ model: db.Dept, attributes: ['name'] }],
        group: ['DeptId'],
        attributes: ['DeptId', [db.sequelize.fn('COUNT', 'title'), 'titles']]
    });
    for (let item of rolesPerDept) {
        item.dataValues.DeptName = item.dataValues.Dept.name
    }
    const usersPerRole = await db.User.findAll({
        include: [{ model: db.Role, attributes: ['title'] }],
        group: ['RoleId'],
        attributes: ['RoleId', [db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    })
    for (let item of usersPerRole) {
        item.dataValues.roleT = item.dataValues.Role.title
    }
    const usersPerLevel = await db.User.findAll({
        include: [{ model: db.Role, attributes: ['title', 'management_level'] }],
        group: ['management_level'],
        attributes: [[db.sequelize.fn('COUNT', 'first_name'), 'employees']],
    })
    const userSum = []
    for (let item of usersPerLevel) {
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

    const [token, authData] = await checkToken(req.params.token)
    const jwtToken = { token }

    res.render('admin', { title: "EzPortal | Admin | Departments", admin: authData.user, rolesPerDept, usersPerRole, userSum, jwtToken })
})
//Admin Profile
router.get('/admin-prof/:token', async (req, res) => {

    const [token, authData] = await checkToken(req.params.token)
    const jwtToken = { token }
    const tasks = await db.Task.findAll({
        include: [{ model: db.User, as: "assigned_by", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.User, as: "assigned_to", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.PreDef }],
        where: {
            assignedto: authData.user.id
        }
    });

    res.render('adminprofile', { title: "EzPortal | Admin | Profile", admin: authData.user, tasks, jwtToken })
})



//Admin Departments
router.get('/admin-dept/:token', async (req, res) => {
    const depts = await db.Dept.findAll()
    const [token, authData] = await checkToken(req.params.token)
    res.render('admindepartments', { title: "EzPortal | Admin | Departments", admin: authData.user, depts, token })
})
//Admin Roles
router.get('/admin-role/:token', async (req, res) => {
    const roles = await db.Role.findAll({ order: [['DeptId'], ['management_level', 'DESC']] })
    const depts = await db.Dept.findAll()
    const [token, authData] = await checkToken(req.params.token)
    res.render('adminroles', { title: "EzPortal | Admin | Roles", admin: authData.user, roles, depts, token })
})

//Admin Employees
router.get('/admin-user/:token', async (req, res) => {
    const users = await db.User.findAll()
    const roles = await db.Role.findAll()
    const depts = await db.Dept.findAll()
    const [token, authData] = await checkToken(req.params.token)
    res.render('adminemployees', { title: "EzPortal | Admin | Employees", admin: authData.user, roles, depts, users, token })
})

//Manager-Home
router.get('/manager-home/:token', async (req, res) => {
    const [token, authData] = await checkToken(req.params.token)
    const jwtToken = { token }
    const tasks = await db.Task.findAll({
        include: [{ model: db.User, as: "assigned_by", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.User, as: "assigned_to", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.PreDef }],
        where: {
            assignedto: authData.user.id
        }
    });
    res.render('manager', { title: "EzPortal | Manager | Departments", manager: authData.user, tasks, jwtToken })
})

//Manager-Task
router.get('/manager-tasks/:token', async (req, res) => {
    const [token, authData] = await checkToken(req.params.token)
    const team = await db.User.findAll({
        include: [{ model: db.Role, where: { management_level: [1, 2], DeptId: authData.user.Role.DeptId } }]
    })
    const predefTasks = await db.PreDef.findAll()

    const tasks = await db.Task.findAll({
        include: [{ model: db.User, as: "assigned_by", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.User, as: "assigned_to", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.PreDef }],
        where: {
            assignedby: authData.user.id
        }
    });
    res.render('managertask', { title: "EzPortal | Manager | Tasks", manager: authData.user, tasks, predefTasks, team, token })
})

//Employee-Home
router.get('/user-home/:token', async (req, res) => {

    const [token, authData] = await checkToken(req.params.token)
    const jwtToken = { token }
    const tasks = await db.Task.findAll({
        include: [{ model: db.User, as: "assigned_by", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.User, as: "assigned_to", attributes: ['first_name', 'last_name', 'RoleId'] }, { model: db.PreDef }],
        where: {
            assignedto: authData.user.id
        }
    });

    res.render('employee', { title: "EzPortal | Employee | Tasks", employee: authData.user, tasks, jwtToken })

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
module.exports = router;