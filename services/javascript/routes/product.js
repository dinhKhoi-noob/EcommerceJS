const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const productMiddleware = require('../middlewares/product.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',productMiddleware.nullCheck, productMiddleware.referenceCheck, productMiddleware.titleCheck, (req, res) => {
    const {title,price,category_id,root_category} = req.body;
    try {
        const visibleId = randomString.generate(10);
        connection.query(`INSERT INTO products (visible_id, title, category_id, price,root_category) VALUES ('${visibleId}', '${title}', '${category_id}','${price}','${root_category}')`,(err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: visibleId});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
});

route.get('/',(req,res)=>{
    const searchString = req.query.search;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    try {
        if(!searchString || searchString==="")
            return connection.query(`SELECT visible_id,title,category_id,price,root_category FROM products where is_active=1 limit ${fromIndex},${toIndex}`,(err,result)=>{
                if(result.length > 0)
                    return res.json({success:true,message:"Successfully",result});
                return res.status(404).json({success:false,message:"Not found"})
            });
        connection.query(`SELECT visible_id,title,category_id,price,root_category FROM products where is_active=1 and title LIKE '%${searchString}%' limit ${fromIndex},${toIndex}`,(err,result)=>{
            if(result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"})
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.get('/:id', (req, res)=>{
    const searchString = req.query.search;
    const rootSearch = req.query.root;
    const criteria = (rootSearch === 0 || !rootSearch)?"category_id":"root_category";
    const id = req.params.id;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    try {
        if(!searchString || searchString === "")
            return connection.query(`SELECT visible_id,title,category_id,price FROM products where ${criteria}='${id}' and is_active=1 limit ${fromIndex},${toIndex}`,(err,result)=>{
                if(result.length > 0)
                    return res.json({success:true,message:"Successfully",result});
                return res.status(400).json({success:false,message:"Not found"});
            });
        connection.query(`SELECT visible_id,title,category_id,price FROM products WHERE title LIKE '%${searchString}%' and is_active=1 and ${criteria}='${id}' limit ${fromIndex},${toIndex}`,(err,result)=>{
            if(result.length > 0)
                return res.json({success:true,message:"Successfully",result})
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.patch('/:id',productMiddleware.nullCheck,productMiddleware.referenceCheck,productMiddleware.titleCheck,(req,res)=>{
    const {title,price,category_id,root_category} = req.body;
    const id = req.params.id;
    try {
        connection.query(`UPDATE products SET
            title = '${title}',
            category_id = '${category_id}',
            price = ${price},
            root_category='${root_category}'
            WHERE products.visible_id = '${id}'`,
        (err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: id});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
})

route.delete('/:id',(req,res)=>{
    const id = req.params.id;
    try {
        connection.query(`UPDATE products SET
            is_active = '0'
            WHERE products.visible_id = '${id}'`,
        (err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: visibleId});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error",visible_id:id});
    }
})

module.exports = route;