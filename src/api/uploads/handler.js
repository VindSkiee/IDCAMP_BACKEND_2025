class UploadsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(req, res, next) {
    try {
      const { file } = req;
      const { id } = req.params;

      if (!file) {
        return res.status(400).json({
          status: 'fail',
          message: 'File cover harus diunggah',
        });
      }

      // Validate file size explicitly (in case middleware is bypassed)
      if (file.size > 512000) {
        return res.status(413).json({
          status: 'fail',
          message: 'File terlalu besar. Maksimal ukuran file adalah 512KB',
        });
      }

      this._validator.validateImageHeaders({ 'content-type': file.mimetype });

      const filename = await this._storageService.writeFile(
        file.buffer,
        { filename: file.originalname },
      );

      const host = process.env.HOST || 'localhost';
      const port = process.env.PORT || 5000;
      const coverUrl = `http://${host}:${port}/upload/images/${filename}`;

      await this._albumsService.updateAlbumCover(id, coverUrl);

      return res.status(201).json({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default UploadsHandler;
