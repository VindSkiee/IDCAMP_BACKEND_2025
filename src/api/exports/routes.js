import express from 'express';

const routes = (handler, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/playlists/:playlistId', handler.postExportPlaylistHandler);

  return router;
};

export default routes;
