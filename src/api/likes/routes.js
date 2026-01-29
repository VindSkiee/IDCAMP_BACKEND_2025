import express from 'express';

const routes = (handler, authMiddleware) => {
  const router = express.Router();

  router.post('/:id/likes', authMiddleware, handler.postLikeHandler);
  router.delete('/:id/likes', authMiddleware, handler.deleteLikeHandler);
  router.get('/:id/likes', handler.getLikesHandler);

  return router;
};

export default routes;
