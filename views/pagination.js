const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = (app) => {
    app.get('/page/index',(req,res)=>{
        let fileName = "pages/index.ejs"
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render("pages/404.ejs");
            }
            const products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product`)
            const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)

            return res.render(fileName,{
                data:{
                    products:products.data.result,
                    categories:categories.data.result
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
            return res.render(fileName,{
                data:{
                    products:products.data.result
                }
            })
        })
    })
    app.get('/page/category/:id',(req,res)=>{
        const id = req.params.id;
        let fileName = 'pages/category.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('page/404.ejs')
            }
            const products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/${id}`)
            return res.render(fileName,{
                data:{
                    products:products.data.result
                }
            })
        })
    })
}