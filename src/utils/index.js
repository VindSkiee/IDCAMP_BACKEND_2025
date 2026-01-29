/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  id,
  name,
  year,
  cover_url,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

const mapSongDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});
/* eslint-enable camelcase */

const mapSongDBToSimple = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

export {
  mapAlbumDBToModel,
  mapSongDBToModel,
  mapSongDBToSimple,
};
