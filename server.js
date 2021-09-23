const express = require("express");
const app = express();
const userRoute = require("./services/javascript/routes/user");
const categoryRoute = require("./services/javascript/routes/category");
const productRoute = require("./services/javascript/routes/product");
const orderRoute = require("./services/javascript/routes/order");
const orderItemRoute = require("./services/javascript/routes/orderItem");
const discountRoute = require("./services/javascript/routes/discount");
const paymentRoute = require("./services/javascript/routes/payment");

app.set('view engine','ejs');
app.use(express.json());
app.use('/api/auth',userRoute);
app.use('/api/category',categoryRoute);
app.use('/api/product',productRoute);
app.use('/api/order',orderRoute);
app.use('/api/order_item',orderItemRoute);
app.use('/api/discount',discountRoute);
app.use('/api/payment',paymentRoute);
app.use(express.static('public'))
require('./views/pagination')(app);

app.listen(4000,()=>{
    console.log("http://localhost:4000");
});