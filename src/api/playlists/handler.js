class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistPayload(req.body);

      const { name } = req.body;
      const { id: credentialId } = req.auth;

      const playlistId = await this._playlistsService.addPlaylist({
        name,
        owner: credentialId,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          playlistId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPlaylistsHandler(req, res, next) {
    try {
      const { id: credentialId } = req.auth;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      return res.status(200).json({
        status: 'success',
        data: {
          playlists,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deletePlaylistByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylistById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }

  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistSongPayload(req.body);

      const { id: playlistId } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.getSongById(songId);
      await this._playlistsService.addSongToPlaylist(playlistId, songId);
      await this._playlistsService.addActivity(playlistId, songId, credentialId, 'add');

      return res.status(201).json({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      return next(error);
    }
  }

  async getSongsFromPlaylistHandler(req, res, next) {
    try {
      const { id: playlistId } = req.params;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistsService.getSongsFromPlaylist(playlistId);

      return res.status(200).json({
        status: 'success',
        data: {
          playlist,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistSongPayload(req.body);

      const { id: playlistId } = req.params;
      const { songId } = req.body;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
      await this._playlistsService.addActivity(playlistId, songId, credentialId, 'delete');

      return res.status(200).json({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPlaylistActivitiesHandler(req, res, next) {
    try {
      const { id: playlistId } = req.params;
      const { id: credentialId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const activities = await this._playlistsService.getActivities(playlistId);

      return res.status(200).json({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default PlaylistsHandler;
