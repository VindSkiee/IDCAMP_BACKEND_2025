import express from 'express';

const routes = (handler, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', handler.postPlaylistHandler);
  router.get('/', handler.getPlaylistsHandler);
  router.delete('/:id', handler.deletePlaylistByIdHandler);
  router.post('/:id/songs', handler.postSongToPlaylistHandler);
  router.get('/:id/songs', handler.getSongsFromPlaylistHandler);
  router.delete('/:id/songs', handler.deleteSongFromPlaylistHandler);
  router.get('/:id/activities', handler.getPlaylistActivitiesHandler);

  return router;
};

export default routes;
