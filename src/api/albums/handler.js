class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);

      const { name, year } = req.body;
      const albumId = await this._service.addAlbum({ name, year });

      return res.status(201).json({
        status: 'success',
        data: {
          albumId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      return res.status(200).json({
        status: 'success',
        data: {
          album,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async putAlbumByIdHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);

      const { id } = req.params;
      const { name, year } = req.body;

      await this._service.editAlbumById(id, { name, year });

      return res.status(200).json({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AlbumsHandler;
