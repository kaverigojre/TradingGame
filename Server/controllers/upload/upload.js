const express = require("express");
const { S3Client } = require("@aws-sdk/client-s3");

const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");

dotenv.config();
let s3 = new S3Client({
  region: process.env.AWS_REGION, //Need to specify env file
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,//Need to specify env file
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,//Need to specify env file
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        Date.now().toString() +
          path.parse(file.originalname).name +
          path.extname(file.originalname)
      );
    },
  }),
}).single("image");

function uploadHandler(req, res) {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);

      res.send("Something went wrong");
    }
    console.log(req.file.location);

    res.send(req.file.location);
  });
}
module.exports = { uploadHandler, upload };
