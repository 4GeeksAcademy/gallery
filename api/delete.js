var uploadcare = require('uploadcare')(process.env.UPLOAD_CARE_PUBLIC, process.env.UPLOAD_CARE_KEY),
fs = require('fs');
module.exports = (req, res) => {
    const uuid = req.query.uuid ? req.query.uuid : null;
    const limit = req.query.limit ? req.query.limit : 100;
    res.setHeader('content-type', 'application/json');
    uploadcare.files.remove(uuid, (error, data) => {
        if(error){
            res.send(JSON.stringify(data));
        }
        else{
            res.send(JSON.stringify(data));
        }
    });
}