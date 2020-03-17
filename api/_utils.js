const fetch = require('node-fetch');
var AWS = require('aws-sdk');
AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_CREDENTIAL_KEY, secretAccessKey: process.env.AWS_SECRET_CREDENTIAL_KEY
});
var s3 = new AWS.S3({ region: 'us-west-2' });
const bucketName = "4geeks-academy-main";

const getFiles = () => new Promise((resolve, reject) => {
    var params = {
        Bucket: bucketName, 
    };
    s3.listObjects(params, function(err, data) {
        if (err){
            reject(err);
        } 
        else{
            resolve(data.Contents);
        } 
    });
});

const deleteFile = (key) => new Promise((resolve, reject) => {
    var params = {
        Bucket: bucketName, 
        Key: key
    };
    s3.deleteObject(params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
            reject(data);
        } 
        else{
            console.log(data);           // successful response
            resolve(data);
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
            //signedUrl: '/api/upload_amazon.js?url='+Buffer.from(data).toString('base64'),
            url: `https://${bucketName}.s3.amazonaws.com/${fileName}`
        });
    });
});

const confirmUpload = (url) => new Promise((resolve, reject) => {
    // Make a request to the S3 API to get a signed URL which we can use to upload our file
  fetch(url)
    .then(data => {
        console.log("Uploaded: ", data.Contents);
        resolve(data);
    })
    .catch(err => {
        console.log("Error signing URL for upload ",err);
        reject(err);
    })
});

module.exports = { getFiles, getUploadURL, confirmUpload, deleteFile };