const express = require("express");
const app = express();

app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.render(__dirname+"/views/pages/index.ejs")
});

app.use(express.static('public'))

app.listen(4000);