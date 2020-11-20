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
      db.Dept.create({ name: req.body.name }).then((data) => {
        res.status(200).json(data)
      }
      ).catch((err) => res.status(403).json({ msg: 'Failed to create new department', err: err.message }));
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
  const roles = await db.Role.findAll();
  if (roles.length === 0) {
    db.Role.create({
      title: req.body.title,
      hourly_rate: req.body.wage,
      management_level: req.body.level,
      DeptId: req.body.deptid

    }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
  }
  else {
    res.status(403).json({ msg: "Sorry, you can't create a new role, contact your admin" })
  }
});

//Create Role
router.post('/createrole', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    //Only IT Admin Can Create New Roles and managers of same department
    if ((authData.user.Role.management_level === 100) || (authData.user.Role.management_level > req.body.level && authData.user.Role.DeptId == req.body.deptid)) {
      db.Role.create({
        title: req.body.title,
        hourly_rate: req.body.wage,
        management_level: req.body.level,
        DeptId: req.body.deptid
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
      RoleId: req.body.rolid
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
      RoleId: req.body.rolid
    })
    res.status(200).json(data);
  } else {
    res.status(403).json({ msg: 'Sorry you are not allowed to add new users' });
  }
});

//Create new pre-defined tasks
router.post('/create-pretask', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    //Only IT Admin and Managers Can Create New Tasks
    if (authData.user.Role.management_level > 1) {
      db.PreDef.create({
        title: req.body.title,
        body: req.body.body
      }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new task', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't create a new task, contact your admin" })
    }
  }
  catch (err) {
    throw err;
  }
});

//Assign a task
router.post('/assign-task', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    const data = await db.Task.create({
      assignedto: req.body.assignedto,
      assignedby: authData.user.id,
      PreDefId: req.body.preid
    })
    res.status(200).json(data)
  }
  catch (err) {
    throw err
  }
});

//Change password
router.put('/changepass', verifyToken, async (req, res) => {

  try {
    const authData = await jwtVerify(req.token, secret);
    const hash = await bcryptHash(req.body.password)
    if (await bcryptComp(req.body.old_pass, authData.user.password)) {
      await db.User.update({ password: hash }, { where: { id: authData.user.id } })
      res.status(200).json({ msg: "Password updated successfully" })
    }
    else {
      res.status(200).json({ msg: "failed to update, wrong old password" })
    }
  }
  catch (err) {
    throw err
  }
})
//Complete a task
router.put('/complete-task', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    await db.Task.update({ completed: true }, { where: { id: req.body.task_id } })
    res.status(200).json({ msg: 'task marked as completed' })
  }
  catch (err) {
    throw err
  }
})


//Approve a task
router.put('/approve-task', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    await db.Task.update({ approved: true }, { where: { id: req.body.task_id } })
    res.status(200).json({ msg: 'task marked as completed' })
  }
  catch (err) {
    throw err
  }
})


//Update department
router.put('/updatedept', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    if (authData.user.Role.management_level === 100) { //Only IT Admin Can Update Departments
      db.Dept.update({ name: req.body.name }, { where: { id: req.body.id } }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to update a department', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't update a department, contact your admin" })
    }
  }
  catch (err) {
    throw err
  }
});

//Update role
router.put('/updaterole', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    //Only IT Admin Can Update Roles and managers of same department
    if ((authData.user.Role.management_level === 100) || (authData.user.Role.management_level > req.body.level && authData.user.Role.DeptId == req.body.deptid)) {
      db.Role.update({
        title: req.body.title,
        hourly_rate: req.body.wage,
        management_level: req.body.level,
        DeptId: req.body.deptid
      },
        {
          where: {
            id: req.body.id
          }
        }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to update role', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't update a role, contact your admin" })
    }
  }
  catch (err) {
    throw err;
  }
});

//update employee
router.put('/updateuser', verifyToken, async (req, res) => {
  const authData = await jwtVerify(req.token, secret);
  // Give the user a default password of 123456789 and hash it before adding into the database
  if (authData.user.Role.management_level === 100) {
    const hash = await bcryptHash('123456789')
    const data = await db.User.update({
      first_name: req.body.f_name,
      last_name: req.body.l_name,
      mobile: req.body.mob,
      office_number: req.body.off,
      email: req.body.email,
      password: hash,
      RoleId: req.body.rolid
    },
      {
        where: {
          id: req.body.id
        }
      })
    res.status(200).json(data);
  } else {
    res.status(403).json({ msg: 'Sorry you are not allowed to update users' });
  }
});

//Delete department
router.delete('/deletedept', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    if (authData.user.Role.management_level === 100) { //Only IT Admin Can Delete Departments
      db.Dept.destroy({ where: { id: req.body.id } }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to delete department', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't delete a department, contact your admin" })
    }
  }
  catch (err) {
    throw err
  }
});

//Delete role
router.delete('/deleterole', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    if (authData.user.Role.management_level === 100) { //Only IT Admin Can Delete Roles
      db.Role.destroy({ where: { id: req.body.id } }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to delete role', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't delete a role, contact your admin" })
    }
  }
  catch (err) {
    throw err
  }
});

//Delete employee
router.delete('/deleteuser/:id', verifyToken, async (req, res) => {
  try {
    const authData = await jwtVerify(req.token, secret);
    if (authData.user.Role.management_level === 100) { //Only IT Admin Can Delete Users
      db.User.destroy({ where: { id: req.params.id } }).then((data) => res.status(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to delete user', err: err.message }));
    }
    else {
      res.status(403).json({ msg: "Sorry, you can't delete a user, contact your admin" })
    }
  }
  catch (err) {
    throw err
  }
});

//Delete tasks

//Generate Token

router.post('/login', async (req, res) => {
  console.log('\n');
  let user;
  try {
    user = await db.User.findOne({
      where: {
        email: req.body.email,
      },
      include: [db.Role],
    })
    if (user == null) {
      res.send('<h1>Sorry, User not found</h1> <br><a href="/" ><h2>Try Again</h2></a>');
      return
    }
    const result = await bcryptComp(req.body.password, user.dataValues.password)
    if (result) {
      const token = await jwtSign(user, '15m');
      res.status(200).json({ token, level: user.dataValues.Role.management_level })
      return
    } else {
      res.send('<h1>Sorry, Wrong user or password</h1> <br><a href="/" ><h2>Try Again</h2></a>');
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
