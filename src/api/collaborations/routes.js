import express from 'express';

const routes = (handler, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', handler.postCollaborationHandler);
  router.delete('/', handler.deleteCollaborationHandler);

  return router;
};

export default routes;
