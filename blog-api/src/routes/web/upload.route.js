const express = require("express");
const router = express.Router();
const { upload } = require("@/utils/upload");
const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return throwError(400, "No file uploaded");

  const fileUrl = `/uploads/${req.file.filename}`;
  response.success(res, 201, { url: fileUrl });
});

module.exports = router;
