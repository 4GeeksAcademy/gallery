const {deleteFile} = require('./_utils.js');

module.exports = (req, res) => {
    if(!req.query.uuid || req.query.uuid === 'undefined'){
        res.status(400);
        res.send(JSON.stringify({ message: "Missing uuid" }));
        return;
    }
    res.setHeader('content-type', 'application/json');
    deleteFile(req.query.uuid)
        .then(data => {
            console.log(data);           // successful response
            res.send(JSON.stringify(data));
        })
        .catch(error => {
            console.log(err, err.stack); // an error occurred
            res.status(500);
            res.send(JSON.stringify(data));
        });
}