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

router.post('/createdept', (req, res) => {
  db.Dept.create({ name: req.body.name }).then((data) => res.status(200).json(data)).catch((err) => res.status(404).json({ msg: 'Failed to create new role' }));
});

router.post('/createrole', (req, res) => {
  db.Role.create({
    title: req.body.title,
    hourly_rate: req.body.wage,
    management_level: req.body.level,
    DeptId: req.body.deptid,

  }).then((data) => res.sendStatus(200).json(data)).catch((err) => res.status(403).json({ msg: 'Failed to create new role', err: err.message }));
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
    res.status(200).json(users);
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
      const result = await bcryptComp(req.body.password, user.dataValues.password)
      if (result) {
        const token = await jwtSign(user, '15m');
        res.json(token);

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
