const { confirmUpload } = require('./_utils.js');

module.exports = (req, res) => {
    if(!req.query.url){
        res.status(400);
        res.send(JSON.stringify({ message: "Missing url" }));
        return;
    }

    const url = Buffer.from(req.query.url, 'base64').toString();
    res.setHeader('content-type', 'application/json');
    confirmUpload(url)
        .then(data => {
            console.log("Upload Success: ", data);
            res.send(JSON.stringify(data));
        })
        .catch(error => {
            res.status(500);
            res.send(JSON.stringify(error));
        });
}