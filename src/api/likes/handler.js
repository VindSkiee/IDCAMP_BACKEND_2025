class LikesHandler {
  constructor(likesService) {
    this._likesService = likesService;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: credentialId } = req.auth;

      await this._likesService.addLike(credentialId, albumId);

      return res.status(201).json({
        status: 'success',
        message: 'Like berhasil ditambahkan',
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteLikeHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { id: credentialId } = req.auth;

      await this._likesService.deleteLike(credentialId, albumId);

      return res.status(200).json({
        status: 'success',
        message: 'Like berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }

  async getLikesHandler(req, res, next) {
    try {
      const { id: albumId } = req.params;
      const { likes, source } = await this._likesService.getLikesCount(albumId);

      const response = res.status(200);

      if (source === 'cache') {
        response.set('X-Data-Source', 'cache');
      }

      return response.json({
        status: 'success',
        data: {
          likes,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default LikesHandler;
