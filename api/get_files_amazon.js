const { uploadFile, getFiles } = require('./_utils.js');

module.exports = (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 100;
    res.setHeader('content-type', 'application/json');
    getFiles()
        .then(data => {
            const images = data.map(i => {
                return {
                    ...i,
                    url: "https://4geeks-academy-main.s3-us-west-2.amazonaws.com/"+i.Key,
                    uuid: i.ETag.replace('"',""),
                    description: "no description",
                    category: "uknown",
                    created_at: i.LastModified
                }
            });
            res.send(JSON.stringify(images));
        })
        .catch(error => {
            res.send(JSON.stringify(error));
        });
}