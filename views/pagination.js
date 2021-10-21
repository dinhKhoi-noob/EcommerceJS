const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = (app) => {
    app.get('/page/index',(req,res)=>{
        let fileName = "pages/index.ejs"
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            let products;
            let categories;
            let discountingProducts;
            let breakfastDishes;
            let lunchDishes;
            let dinnerDishes;
            if(err)
            {
                return res.render("pages/404.ejs");
            }
            try {
                discountingProducts = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product?discount=1`);
                products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product`);
                categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`);
                breakfastDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='breakfast'`);
                lunchDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='lunch'`);
                dinnerDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='dinner'`);
            } catch (error) {
                console.log(error);
            }
            return res.render(fileName,{
                data:{
                    products:products?products.data.result:null,
                    categories:categories?categories.data.result:null,
                    discountingProducts:discountingProducts?discountingProducts.data.result:null,
                    breakfast:breakfastDishes?breakfastDishes.data.result:null,
                    lunch:lunchDishes?lunchDishes.data.result:null,
                    dinner:dinnerDishes?dinnerDishes.data.result:null
                }
            })
        })

    })
    app.get('/page/discount',(req,res)=>{
        let fileName = 'pages/discount.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            const products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product?discount=1`)
            const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)
            // console.log(products.data.result);
            return res.render(fileName,{
                data:{
                    products:products.data.result,
                    categories:categories.data.result
                }
            })
        })
    })
    app.get('/page/category/:id',(req,res)=>{
        const id = req.params.id;
        const root = req.query.root;
        let fileName = 'pages/category.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            try {
                const uri = !root?`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${id}`:`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${id}?root=1`
                const products = await axios.get(uri);
                console.log('products: ',products.data.result);
                const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)
                console.log(`http://${process.env.express_host}:${process.env.express_port}/api/category/${id}`);
                const currentCategory = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category/${id}`)
                return res.render(fileName,{
                    data:{
                        products:products.data.result,
                        categories:categories.data.result,
                        currentCategory:currentCategory.data.result
                    }
                })   
            } catch (error) {
                return res.render('pages/404.ejs')    
            }
        })
    })
    app.get('/page/dish/:id',(req,res)=>{
        const id = req.params.id;
        let fileName = 'pages/dish.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            try {
                const response = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/detail/${id}`)
                const dish = response.data.result;
                const relatedDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${dish[0].category_id}`);
                return res.render(fileName,{
                    data:{
                        dish,
                        relatedDishes:relatedDishes.data.result
                    }
                })   
            } catch (error) {
                return res.render('pages/404.ejs')
            }
        })
    })
    app.get('/page/checkout/:user_id',async(req,res)=>{
        let userInfo = null;
        const userId = req.params.user_id;
        let fileName = 'pages/checkout.ejs'
        try {
            if(userId)
            {
                const response = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/auth/${userId}`);
                if(response && response.data){
                    userInfo = response.data.result;
                }
                console.log(userInfo)
            }   
        } catch (error) {
            // console.log(error);
        }
        return res.render(fileName,{
            data:{
                user_info:userInfo
            }
        })
    })
}