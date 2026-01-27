import validatePayload from '../validatePayload.js';
import { AlbumPayloadSchema } from './schema.js';

const fieldMap = {
  name: 'nama album',
  year: 'tahun',
};

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    validatePayload(AlbumPayloadSchema, payload, {
      prefix: 'Gagal menambahkan album',
      fieldMap,
    });
  },
};

export default AlbumsValidator;
