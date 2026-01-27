const mapAlbumDBToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

/* eslint-disable camelcase */
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
