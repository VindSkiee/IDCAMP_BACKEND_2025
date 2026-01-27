class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);

      const { id: credentialId } = req.auth;
      const { playlistId, userId } = req.body;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._usersService.getUserById(userId);
      const collaborationId = await this._collaborationsService.addCollaboration(
        playlistId,
        userId,
      );

      return res.status(201).json({
        status: 'success',
        data: {
          collaborationId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);

      const { id: credentialId } = req.auth;
      const { playlistId, userId } = req.body;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return res.status(200).json({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default CollaborationsHandler;
