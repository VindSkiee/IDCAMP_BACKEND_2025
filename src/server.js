import 'dotenv/config';

import express, { json } from 'express';
import { Pool } from 'pg';

import AlbumsService from './services/postgres/AlbumsService.js';
import SongsService from './services/postgres/SongsService.js';

import AlbumsValidator from './validator/albums/index.js';
import SongsValidator from './validator/songs/index.js';

import { AlbumsHandler, routes as albumsRoutes } from './api/albums/index.js';
import { SongsHandler, routes as songsRoutes } from './api/songs/index.js';

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

  const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);
  const songsHandler = new SongsHandler(songsService, SongsValidator);

  app.use('/albums', albumsRoutes(albumsHandler));
  app.use('/songs', songsRoutes(songsHandler));

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
