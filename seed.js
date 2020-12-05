//Creates first admin account

//Dependencies
const axios = require('axios');
const express = require('express');
const app = express();
const db = require('./models');
const PORT = process.env.PORT || 5000

//Set Admin credentials
const f_name = "Peter"
const l_name = "Smith"
const mob = "0427894563"
const email = "peter@abc.com"
const off = "456"


// Handle Post Response
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api-routes
app.use('/api', require('./routes/api-routes'));

//Set protocol and hostanme to set end points URL
const protocol = 'http';
const hostname = 'localhost';
//Endpoints to be called
const createAdmin = `${protocol}://${hostname}:${PORT}/api/create-admin`
const firstDept = `${protocol}://${hostname}:${PORT}/api/create-first-dept`
const firstRole = `${protocol}://${hostname}:${PORT}/api/create-first-role`

//Create First Dept
axios.post(firstDept, { name: "IT" }).then(res => {
    console.log(res.data);
    //Create First Role
    axios.post(firstRole, {
        "title": "IT Admin",
        "wage": 35,
        "level": 100,
        "deptid": 1
    }).then(res => {
        console.log(res.data);
        //Create Admin
        axios.post(createAdmin, {
            f_name,
            l_name,
            mob,
            email,
            off,
            rolid: 1
        }).then(res => {
            console.log(res.data);
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}).catch(err => console.log(err))







// Initialise server
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`The Express Server is now Up and running on PORT : ${PORT}`));
});
