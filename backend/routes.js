import express from "express";
import multer from "multer";
import { uploadBlob } from "./blobService.js";


const router = express.Router();
const multerMiddleware = multer();

const SIZE_LIMIT = 2 * 1024 * 1024;
const SUPPORTED_MIMETYPE = new Map([
  [ "image/png", new Uint8Array([ 0x89, 0x50, 0x4e, 0x47 ]) ],
  [ "image/jpeg", new Uint8Array([ 0xff, 0xd8, 0xff, 0xe0 ]) ],
  [ "image/gif", new Uint8Array([ 0x47, 0x49, 0x46, 0x38 ]) ]
]);

router.post("/upload", multerMiddleware.single("file"), async (req, res) => {
  if (!req.file || req.file.size === 0) {
    res.status(400).send({
      "message": "No file uploaded"
    });
    return;
  }

  console.log(Object.prototype.toString.call(req.file));

  const file = req.file;

  const size = file.size;
  if (size > SIZE_LIMIT) {
    res.status(413).send({
      "message": "Please upload files within 2MB"
    });
    return;
  }

  const mimetype = file.mimetype;
  if (!SUPPORTED_MIMETYPE.has(mimetype)) {
    res.status(400).send({
      "message": "We only support png, jpeg, jpg and gif"
    });
    return;
  }

  const buffer = file.buffer;
  const magicNumber = SUPPORTED_MIMETYPE.get(mimetype);

  for (let i = 0; i < magicNumber.length; i++) {
    if (buffer[i] !== magicNumber[i]) {
      res.status(400).send({
        "message": "We only support png, jpeg, jpg and gif"
      });
    }
  }

  try {
    const url = await uploadBlob(buffer, size, mimetype);
    res.status(201).header("Location", url)
      .send({
        "url": url
      });
  } catch (err) {
    res.status(500).send({
      "message": "Something went wrong, please try again later"
    });
  }

});

export { router };
