var AWS = require('aws-sdk');
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_CREDENTIAL_KEY, secretAccessKey: process.env.AWS_SECRET_CREDENTIAL_KEY
});
var s3 = new AWS.S3();
const bucketName = "4geeks-academy-main";

const getFiles = () => new Promise((resolve, reject) => {
    var params = {
        Bucket: bucketName, 
    };
    s3.listObjects(params, function(err, data) {
        console.log("Result from amazon", data);
        if (err){
            reject(err);
        } 
        else{
            resolve(data.Contents);
        } 
    });
});

const getUploadURL = (fileName, fileType) => new Promise((resolve, reject) => {
      // Set up the payload of what we are sending to the S3 api
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read'
    };
      // Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', params, (err, data) => {
        if(err){
            console.log("Error signing URL for upload ",err);
            reject(err)
        }
            // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
        resolve({
            signedRequest: data,
            signedUrl: data,
            url: `https://${bucketName}.s3.amazonaws.com/${fileName}`
        });
    });
});

module.exports = { getFiles, getUploadURL };