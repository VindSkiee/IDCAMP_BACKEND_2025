class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, res, next) {
    try {
      this._validator.validateSongPayload(req.body);

      const {
        title, year, genre, performer, duration, albumId,
      } = req.body;

      const songId = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          songId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getSongsHandler(req, res, next) {
    try {
      const { title, performer } = req.query;
      const songs = await this._service.getSongs({ title, performer });

      return res.status(200).json({
        status: 'success',
        data: {
          songs,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getSongByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);

      return res.status(200).json({
        status: 'success',
        data: {
          song,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async putSongByIdHandler(req, res, next) {
    try {
      this._validator.validateSongPayload(req.body);

      const { id } = req.params;
      const {
        title, year, genre, performer, duration, albumId,
      } = req.body;

      await this._service.editSongById(id, {
        title, year, genre, performer, duration, albumId,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteSongByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default SongsHandler;
