/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
const express = require('express');
const { bcryptComp, bcryptHash } = require('./../middleware/bcrypt')
const { jwtSign, jwtVerify, jwtRefresh } = require('./../middleware/jwt')
const db = require('../models');
const axios = require('axios')
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const secret = process.env.JWT_SECRET;
const PORT = process.env.PORT

//Create First Department without Token
router.post('/create-first-dept', async (req, res) => {
  const depts = await db.Dept.findAll();
  if (depts.length === 0) {
    db.Dept.create({ name: req.body.name }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
  }
  else {
    res.status(403).json({ msg: "Sorry, you can't create a new department, contact your admin" })
  }
});

//Create Department
router.post('/createdept', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    if (authData.user.Role.management_level === 100) { //Only IT Admin Can Create New Departments
      db.Dept.create({ name: req.body.name }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't create a new department, contact your admin" })
    }
  }
  catch (err) {
    throw err
  }
});

// Create First Role without Token
router.post('/create-first-role', async (req, res) => {
  const depts = await db.Role.findAll();
  if (depts.length === 0) {
    db.Role.create({
      title: req.body.title,
      hourly_rate: req.body.wage,
      management_level: req.body.level,
      DeptId: req.body.deptid,

    }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
  }
  else {
    res.status(403).json({ msg: "Sorry, you can't create a new role, contact your admin" })
  }
});

//Create Role
router.post('/createdept', verifyToken, async (req, res) => {
  try {
    console.log(req.token, req.body);
    const authData = await jwtVerify(req.token, secret);
    //Only IT Admin Can Create New Departments and managers of same department
    if ((authData.user.Role.management_level === 100) || (authData.user.Role.management_level > req.body.level && authData.user.Role.DeptId == req.body.deptid)) {
      db.Role.create({
        title: req.body.title,
        hourly_rate: req.body.wage,
        management_level: req.body.level,
        DeptId: req.body.deptid,
      }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't create a new role, contact your admin" })
    }
  }
  catch (err) {
    throw err;
  }
});

//Create admin/first-user without Authentication token 
router.post('/create-admin', async (req, res) => {
  const hash = await bcryptHash('123456789');
  const users = await db.User.findAll();
  if (users.length === 0) {
    const newUser = await db.User.create({
      first_name: req.body.f_name,
      last_name: req.body.l_name,
      mobile: req.body.mob,
      office_number: req.body.off,
      email: req.body.email,
      password: hash,
      RoleId: req.body.rolid,
    });
    res.status(200).json(newUser);
  } else {
    res.status(403).json({ msg: "Sorry, you can't create a new user, contact your admin" })
  }
});

//Create new Employee
router.post('/createuser', verifyToken, async (req, res) => {
  const authData = await jwtVerify(req.token, secret);
  // Give the new user a default password of 123456789 and hash it before adding into the database
  if (authData.user.Role.management_level === 100) {
    const hash = await bcryptHash('123456789')
    const data = await db.User.create({
      first_name: req.body.f_name,
      last_name: req.body.l_name,
      mobile: req.body.mob,
      office_number: req.body.off,
      email: req.body.email,
      password: hash,
      RoleId: req.body.rolid,
    })
    res.status(200).json(data);
  } else {
    res.status(403).json({ msg: 'Sorry you are not allowed to add new users' });
  }
});

//Create new tasks

//Get all departments

//Get all roles

//Get all employee

//Get employee

//Get all tasks

//Get task

//Update department

//Update role

//update employee

//Delete department

//Delete role

//Delete employee



//Generate Token
router.post('/login', async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: {
        email: req.body.email,
      },
      include: [db.Role],
    })
    if (user) {
      console.log(user.dataValues, user.dataValues.Role.management_level);
      const result = await bcryptComp(req.body.password, user.dataValues.password)
      if (result) {
        const token = await jwtSign(user, '15m');
        switch (user.dataValues.Role.management_level) {
          case 100:
            const roles = await db.Role.findAll()
            const depts = await db.Dept.findAll()
            const users = await db.User.findAll()
            // console.log(roles[0].dataValues);
            res.status(200).render('admin', { title: "EzPortal | Admin", admin: user.dataValues, roles, depts, users, token });
            break;
          case 1:

          default:
            break;
        }

      } else {
        res.status(403).json({ msg: 'Sorry, user not found' });
      }
    }
  }
  catch (err) {
    throw err
  }
});

//Refresh Token

router.get('/refreshtoken/:oldtoken', (req, res) => {
  const token = jwtRefresh(req.params.oldtoken, '15m')
  res.json({ token })
})

module.exports = router;