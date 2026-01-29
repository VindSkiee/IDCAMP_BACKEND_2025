class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(req, res, next) {
    try {
      this._validator.validateExportPlaylistPayload(req.body);

      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const message = JSON.stringify({ playlistId, targetEmail });

      try {
        await this._producerService.sendMessage('export:playlists', message);
      } catch (queueError) {
        console.error('Failed to queue export request:', queueError.message);
        return res.status(503).json({
          status: 'error',
          message: 'Service sementara tidak tersedia. Silakan coba lagi nanti.',
        });
      }

      return res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ExportsHandler;
