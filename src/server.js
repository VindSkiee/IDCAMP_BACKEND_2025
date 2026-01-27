import 'dotenv/config';

import express, { json } from 'express';
import { Pool } from 'pg';

// Services
import AlbumsService from './services/postgres/AlbumsService.js';
import SongsService from './services/postgres/SongsService.js';
import UsersService from './services/postgres/UsersService.js';
import AuthenticationsService from './services/postgres/AuthenticationsService.js';
import PlaylistsService from './services/postgres/PlaylistsService.js';
import CollaborationsService from './services/postgres/CollaborationsService.js';

// Validators
import AlbumsValidator from './validator/albums/index.js';
import SongsValidator from './validator/songs/index.js';
import UsersValidator from './validator/users/index.js';
import AuthenticationsValidator from './validator/authentications/index.js';
import PlaylistsValidator from './validator/playlists/index.js';
import CollaborationsValidator from './validator/collaborations/index.js';

// API Handlers and Routes
import { AlbumsHandler, routes as albumsRoutes } from './api/albums/index.js';
import { SongsHandler, routes as songsRoutes } from './api/songs/index.js';
import { UsersHandler, routes as usersRoutes } from './api/users/index.js';
import { AuthenticationsHandler, routes as authenticationsRoutes } from './api/authentications/index.js';
import { PlaylistsHandler, routes as playlistsRoutes } from './api/playlists/index.js';
import { CollaborationsHandler, routes as collaborationsRoutes } from './api/collaborations/index.js';

// Tokenize
import TokenManager from './tokenize/TokenManager.js';

// Middleware
import authMiddleware from './middleware/authMiddleware.js';

// Exceptions
import ClientError from './exceptions/ClientError.js';

const init = async () => {
  const app = express();

  app.use(json());

  const pool = new Pool();

  try {
    const client = await pool.connect();
    console.log('Database PostgreSQL berhasil terhubung');
    client.release();
  } catch (error) {
    console.error('Database PostgreSQL gagal terhubung');
    console.error(error.message);
    process.exit(1);
  }

  const albumsService = new AlbumsService(pool);
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService(pool);
  const collaborationsService = new CollaborationsService(pool);
  const playlistsService = new PlaylistsService(pool, collaborationsService);

  // V1 Handlers
  const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);
  const songsHandler = new SongsHandler(songsService, SongsValidator);

  // V2 Handlers
  const usersHandler = new UsersHandler(usersService, UsersValidator);
  const authenticationsHandler = new AuthenticationsHandler(
    authenticationsService,
    usersService,
    TokenManager,
    AuthenticationsValidator,
  );
  const playlistsHandler = new PlaylistsHandler(
    playlistsService,
    songsService,
    PlaylistsValidator,
  );
  const collaborationsHandler = new CollaborationsHandler(
    collaborationsService,
    playlistsService,
    usersService,
    CollaborationsValidator,
  );

  // V1 Routes
  app.use('/albums', albumsRoutes(albumsHandler));
  app.use('/songs', songsRoutes(songsHandler));

  // V2 Routes
  app.use('/users', usersRoutes(usersHandler));
  app.use('/authentications', authenticationsRoutes(authenticationsHandler));
  app.use('/playlists', playlistsRoutes(playlistsHandler, authMiddleware));
  app.use('/collaborations', collaborationsRoutes(collaborationsHandler, authMiddleware));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Maaf, terjadi kesalahan pada server kami.',
    });
  });

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 5000;

  app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
};

init();
