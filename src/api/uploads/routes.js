import express from 'express';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 512000, // 512KB
  },
});

const routes = (handler) => {
  const router = express.Router();

  router.post(
    '/:id/covers',
    upload.single('cover'),
    handler.postUploadImageHandler,
    // Multer error handler
    // eslint-disable-next-line no-unused-vars
    (err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            status: 'fail',
            message: 'File terlalu besar. Maksimal ukuran file adalah 512KB',
          });
        }
        return res.status(400).json({
          status: 'fail',
          message: err.message,
        });
      }
      return next(err);
    },
  );

  return router;
};

export default routes;
