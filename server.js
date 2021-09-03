const express = require("express");
const app = express();
const userRoute = require("./controllers/routes/user.js");
app.set('view engine','ejs');
app.get("/",(req,res)=>{
    res.render(__dirname+"/views/pages/index.ejs")
});
app.use(express.json());
app.use('/auth',userRoute);
app.use(express.static('public'))

app.listen(4000,()=>{
    console.log("http://localhost:4000");
});