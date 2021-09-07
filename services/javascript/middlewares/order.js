const connection = require('../../../models/connection.js');

const nullCheck = (req, res, next) => {
    const {user_id, date_created} = req.body;
    if(!user_id || !date_created)
        return res.status(400).json({success:false,message:"Please enter all required fields"})
    next();
}

const referenceCheck = (req, res, next) => {
    const user_id = req.body.user_id;
    try {
        // console.log(`Select visible_id from users where visible_id='${user_id}'`);
        return connection.query(`Select visible_id from users where visible_id='${user_id}'`,(err,result)=>{
            if(!result || result.length < 1)
                return res.status(400).json({success:false,message:"Invalid user id"})
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const dateCheck = (req, res, next) => {
    const date_created = req.body.date_created;
    const formatDateString = /^(((\d{4})(-)(0[13578]|10|12)(-)(0[1-9]|[12][0-9]|3[01]))|((\d{4})(-)(0[469]|11)(-)(0[1-9]|[12][0-9]|30))|((\d{4})(-)(02)(-)(0[1-9]|[12][0-9]|2[0-8]))|(([02468][048]00)(-)(02)(-)(29))|(([13579][26]00)(-)(02)(-)(29))|(([0-9][0-9][0][48])(-)(02)(-)(29))|(([0-9][0-9][2468][048])(-)(02)(-)(29))|(([0-9][0-9][13579][26])(-)(02)(-)(29)))(\s)(([0-1][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9]))$/;
    if(!formatDateString.test(date_created))
        return res.status(400).json({success:false,message:"Invalid date input"});
    next();
}

module.exports = {
    nullCheck,
    referenceCheck,
    dateCheck
};