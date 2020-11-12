const express = require('express')
const jwt=require('jsonwebtoken')
const db=require('./../models')
const router = express.Router()

const secret='Groupxyz'
///use router instead of app when creating the routes 
// start the api routees without'/api/' , i.e. router.get('/user/') instead of app.get('/api/user')

router.post('/login',(req,res)=>{
   db.User.findOne({
        where:{
            email:req.body.email,
            password:req.body.password
        }
    }).then(user=>{
        if(user){
        jwt.sign({user:user.email},user.password,{expiresIn:'30s'},(err,token)=>{
            res.json({token})})
        }else{
            user={
                email:"tony@abc.com",
                password:'123'    
            }
            jwt.sign({user:user},secret,{expiresIn:'1d'},(err,token)=>{
                res.json({token})})
            //res.sendStatus(403)
        }
    }).catch(err=>{
        throw err
    })
    });
//
router.post('/adduser',verifyToken,(req,res)=>{
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            throw err
        }else{
            res.json({
                msg:'Your data has been added',
                authData
            })
        }
    })
})

function verifyToken(req,res,next){
const bearerHeader=req.headers['authorization'];
if(typeof bearerHeader==='undefined'){
    return res.sendStatus(403);
}
const bearer=bearerHeader.split(' ')
const token=bearer[1]
req.token=token;
next();
}
module.exports = router