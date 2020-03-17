const { getUploadURL, getFiles } = require('./_utils.js');

module.exports = (req, res) => {
    if(!req.query.objectName || !req.query.contentType){
        res.status(400);
        res.send(JSON.stringify({ message: "Missing fileName or fileType" }));
        return;
    }

    const fileName = req.query.objectName;
    const fileType = req.query.contentType;
    res.setHeader('content-type', 'application/json');
    getUploadURL(fileName, fileType)
        .then(data => {
            res.send(JSON.stringify(data));
        })
        .catch(error => {
            res.status(500);
            res.send(JSON.stringify(error));
        });
}