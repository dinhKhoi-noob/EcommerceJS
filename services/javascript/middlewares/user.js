const connection = require('../../../models/connection.js');
const registerMiddleware = (req,res,next) =>{
    const {username,password,email,address,phone} = req.body;
    if(!username || !password || !email || !address || !phone || username === "" || password === "" || email === ""|| address === "" || phone === "")
        return res.status(400).json({success:false,message:"Please enter all fields"});
    const sampleEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const samplePhone = /^0\d{9}$/;
    if(!sampleEmail.test(email))
        return res.status(400).json({success:false,message:"Invalid email address"});
    if(!samplePhone.test(phone))
        return res.status(400).json({success:false,message:"Invalid phone number"});
    let query = `select username from users where username='${username}'`;
    return connection.query(query,(error,result)=>{
        console.log(query,result);
        if(result && result.length > 0)
            return res.status(400).json({success:false,message:"User is already registered"});
        next();
    });
}
const loginMiddleware = (req,res,next) =>{
    console.log(req.body);
    const {username,password} = req.body;
    if(!username || !password || username.trim() === "" || password.trim() ==="")
        return res.status(400).json({success:false,message:"Missing username or password"});
    next();
}
module.exports = {
    registerMiddleware,
    loginMiddleware,
}