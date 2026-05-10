import multer from "multer";

/**
 * Multer Storage Config
 */
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "public");

  },

  filename: function (req, file, cb) {

    const cleanName = file.originalname
      .replace(/\s+/g, "-");

    const filename =
      Date.now() + "-" + cleanName;

    cb(null, filename);
  }
});

/**
 * File Filter
 * Allow Only PDF Files
 */
const fileFilter = (req, file, cb) => {

  if (file.mimetype === "application/pdf") {

    cb(null, true);

  } else {

    cb(new Error("Only PDF files are allowed"), false);

  }
};

/**
 * Upload Middleware
 */
export const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },

  fileFilter

});