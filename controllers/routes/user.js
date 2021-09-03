const verify = require('../middlewares/authenticate.js');
const userMiddleware = require('../middlewares/user.js');
const route = require("express").Router();
const argon2 = require('argon2');
const connection = require('../../models/connection.js');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
route.get('/',verify, (req, res)=>{
    try {
        connection.query(`Select username, balance, email, address, total_saving from users where visible_id=${req.userId} and isActive=1`,(err,res)=>{
            if(res.length <= 0){
                return res.status(404).json({success:false,message:"Not found"});
            }
            return res.json({success:true,message:"Successfully",})
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
})
route.post('/register',userMiddleware.registerMiddleware,async(req,res)=>{
    try {
        const {username,password,email,address} = req.body;
        const hashPassword = await argon2.hash(password);
        const visibleId = randomString.generate(10);
        let query = `insert into users (visible_id,username,password,email,address) values('${visibleId}','${username}','${hashPassword}','${email}','${address}')`;
        connection.query(query,(err,result) => {
            console.log(query);
            if(result){
                const accessToken = jwt.sign({userId:visibleId},process.env.ACCESS_TOKEN_SECRET);
                return res.json({success:true,message:"Account has been created",access_token:accessToken});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
});
route.post('/login',userMiddleware.loginMiddleware,(req,res)=>{
    try {
        console.log(req.body);
        const {username,password} = req.body;
        connection.query(`select * from users where username='${username}'`,async(error,result)=>{
            if(!result || result.length < 0)
                return res.status(400).json({success:false,message:"Invalid username or password"});
            console.log(result);
            const passwordValid = await argon2.verify(result[0].password,password);
            if(!passwordValid)
            {
                return res.status(400).json({success:false,message:"Invalid username or password"});
            }
            const accessToken = jwt.sign({
                userId:result[0].visible_id
            },process.env.ACCESS_TOKEN_SECRET);
            return res.json({success:true,message:"Login successfully",access_token:accessToken});
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})
module.exports = route;