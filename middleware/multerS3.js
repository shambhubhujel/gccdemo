import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

// // AWS config
aws.config.update({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const multerS3Config = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  key: function (req, file, cb) {
    const fileName = Date.now().toString() + '-' + file.originalname;
    // req.body.photo = fileName;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

export const upload = multer({
  storage: multerS3Config,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE,
  },
});
