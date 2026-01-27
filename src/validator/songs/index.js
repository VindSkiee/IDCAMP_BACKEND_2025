import validatePayload from '../validatePayload.js';
import { SongPayloadSchema } from './schema.js';

const fieldMap = {
  title: 'judul',
  year: 'tahun',
  genre: 'genre',
  performer: 'penyanyi',
  duration: 'durasi',
  albumId: 'album',
};

const SongsValidator = {
  validateSongPayload: (payload) => {
    validatePayload(SongPayloadSchema, payload, {
      prefix: 'Gagal menambahkan lagu',
      fieldMap,
    });
  },
};

export default SongsValidator;
